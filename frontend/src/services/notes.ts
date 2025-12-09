import { api } from './api';
import { Note, CreateNoteRequest } from '../types';

export const notesService = {
  // Get all notes for the current user
  async getAll(): Promise<Note[]> {
    return api.get<Note[]>('/notes');
  },

  // Get all notes in a specific folder (new endpoint)
  async getByFolder(folderId: number): Promise<Note[]> {
    return api.get<Note[]>(`/notes/folder/${folderId}`);
  },

  async getById(id: number): Promise<Note> {
    return api.get<Note>(`/notes/${id}`);
  },

  // Create note with optional folderId as query parameter
  async create(data: CreateNoteRequest, folderId?: number): Promise<Note> {
    const endpoint = folderId 
      ? `/notes?folderId=${folderId}` 
      : '/notes';
    return api.post<Note>(endpoint, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/notes/${id}`);
  },

  async update(id: number, title: string): Promise<Note> {
    return api.put<Note>(`/notes/${id}`, { title });
  },

  // Update note content (for action items completion, etc.)
  async updateContent(id: number, content: string): Promise<Note> {
    return api.put<Note>(`/notes/${id}/content`, { content });
  },

  // Move note to a different folder (new endpoint)
  async moveToFolder(noteId: number, folderId?: number): Promise<Note> {
    const endpoint = folderId 
      ? `/notes/${noteId}/move?folderId=${folderId}` 
      : `/notes/${noteId}/move`;
    return api.put<Note>(endpoint, {});
  },
};
