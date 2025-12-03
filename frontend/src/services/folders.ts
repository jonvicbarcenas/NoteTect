import { api } from './api';
import { Folder, CreateFolderRequest } from '../types';

export const foldersService = {
  // Get all folders for the current user (all folders across all subjects)
  async getAll(subjectId?: number): Promise<Folder[]> {
    if (subjectId) {
      // Get folders for a specific subject (new endpoint)
      return api.get<Folder[]>(`/folders/subject/${subjectId}`);
    }
    // Get all folders for the user
    return api.get<Folder[]>('/folders');
  },

  // Get folders by subject ID
  async getBySubject(subjectId: number): Promise<Folder[]> {
    return api.get<Folder[]>(`/folders/subject/${subjectId}`);
  },

  async getById(id: number): Promise<Folder> {
    return api.get<Folder>(`/folders/${id}`);
  },

  // Create folder with subjectId as query parameter (new API format)
  async create(data: CreateFolderRequest): Promise<Folder> {
    return api.post<Folder>(`/folders?subjectId=${data.subjectId}`, { name: data.name });
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/folders/${id}`);
  },

  async rename(id: number, name: string): Promise<Folder> {
    return api.put<Folder>(`/folders/${id}`, { name });
  },
};
