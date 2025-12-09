import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateNoteParams } from "../types";
import { NOTE_TYPES } from "../constants";

// Initialize the client with the API key from the environment
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn("Missing VITE_GEMINI_API_KEY in .env file - will use OpenRouter only");
}

if (!OPENROUTER_API_KEY) {
    console.warn("Missing VITE_OPENROUTER_API_KEY in .env file - will use Gemini only");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

/**
 * Generate content using OpenRouter API as fallback
 */
const generateWithOpenRouter = async (
    params: GenerateNoteParams,
    onChunk?: (text: string) => void
): Promise<string> => {
    const selectedType = NOTE_TYPES.find(t => t.id === params.type);
    const systemPrompt = selectedType?.prompt || 'Summarize this text.';

    // OpenRouter API doesn't support image input in the same way, so we'll include it in the text if present
    let userContent = params.text || '';
    if (params.imageBase64) {
        userContent += '\n\n[Note: Image content was provided but OpenRouter API doesn\'t support image analysis in this implementation]';
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'NoteTect'
        },
        body: JSON.stringify({
            model: 'qwen/qwen3-235b-a22b:free', // Using free Gemini model via OpenRouter
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ],
            stream: true
        })
    });

    if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                        fullText += content;
                        if (onChunk) {
                            onChunk(content);
                        }
                    }
                } catch (e) {
                    // Skip invalid JSON
                }
            }
        }
    }

    return fullText;
};

/**
 * Generate content using Gemini API
 */
const generateWithGemini = async (
    params: GenerateNoteParams,
    onChunk?: (text: string) => void
): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    const selectedType = NOTE_TYPES.find(t => t.id === params.type);
    const systemPrompt = selectedType?.prompt || 'Summarize this text.';

    const parts: any[] = [systemPrompt];

    if (params.text) {
        parts.push(params.text);
    }

    if (params.imageBase64 && params.imageMimeType) {
        parts.push({
            inlineData: {
                data: params.imageBase64,
                mimeType: params.imageMimeType
            }
        });
    }

    const result = await model.generateContentStream(parts);

    let fullText = '';
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        if (onChunk) {
            onChunk(chunkText);
        }
    }
    return fullText;
};

export const generateContent = async (
    params: GenerateNoteParams,
    onChunk?: (text: string) => void
): Promise<string> => {
    // Try Gemini first if API key is available
    if (GEMINI_API_KEY) {
        try {
            console.log('Attempting to generate content with Gemini...');
            const result = await generateWithGemini(params, onChunk);
            console.log('Successfully generated content with Gemini');
            return result;
        } catch (error) {
            console.error("Gemini API error:", error);

            // Fall back to OpenRouter if available
            if (OPENROUTER_API_KEY) {
                console.log('Falling back to OpenRouter...');
                try {
                    const result = await generateWithOpenRouter(params, onChunk);
                    console.log('Successfully generated content with OpenRouter');
                    return result;
                } catch (openRouterError) {
                    console.error("OpenRouter API error:", openRouterError);
                    throw new Error("Both Gemini and OpenRouter failed. Please check your API keys and internet connection.");
                }
            } else {
                throw new Error("Gemini API failed and no OpenRouter API key configured. Please check your Gemini API key and internet connection.");
            }
        }
    } else if (OPENROUTER_API_KEY) {
        // Use OpenRouter directly if no Gemini key
        console.log('Using OpenRouter (no Gemini API key configured)...');
        try {
            const result = await generateWithOpenRouter(params, onChunk);
            console.log('Successfully generated content with OpenRouter');
            return result;
        } catch (error) {
            console.error("OpenRouter API error:", error);
            throw new Error("Failed to generate content with OpenRouter. Please check your API key and internet connection.");
        }
    } else {
        throw new Error("No API keys configured. Please add GEMINI_API_KEY or OPENROUTER_API_KEY to your .env file.");
    }
};
