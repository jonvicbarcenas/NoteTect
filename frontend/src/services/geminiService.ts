import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateNoteParams } from "../types";
import { NOTE_TYPES } from "../constants";

// Initialize the client with the API key from the environment
const API_KEY = import.meta.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Missing GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export const generateContent = async (
    params: GenerateNoteParams,
    onChunk?: (text: string) => void
): Promise<string> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
                onChunk(fullText);
            }
        }
        return fullText;
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate content. Please check your API key and internet connection.");
    }
};
