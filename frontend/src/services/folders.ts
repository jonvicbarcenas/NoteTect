import { api } from './api';
import { Folder, CreateFolderRequest } from '../types';

export const foldersService = {
  async getAll(): Promise<Folder[]> {
    return api.get<Folder[]>('/folders');
  },

  async getById(id: number): Promise<Folder> {
    return api.get<Folder>(`/folders/${id}`);
  },

  async create(data: CreateFolderRequest): Promise<Folder> {
    return api.post<Folder>('/folders', data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/folders/${id}`);
  },
};
