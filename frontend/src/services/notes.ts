import { api } from './api';
import { Note, CreateNoteRequest } from '../types';

export const notesService = {
  async getAll(): Promise<Note[]> {
    return api.get<Note[]>('/notes');
  },

  async getById(id: number): Promise<Note> {
    return api.get<Note>(`/notes/${id}`);
  },

  async create(data: CreateNoteRequest): Promise<Note> {
    return api.post<Note>('/notes', data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/notes/${id}`);
  },

  async update(id: number, title: string): Promise<Note> {
    return api.put<Note>(`/notes/${id}`, { title });
  },
};
