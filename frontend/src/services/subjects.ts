import { api } from './api';
import { Subject, CreateSubjectRequest } from '../types';

export const subjectsService = {
  async getAll(): Promise<Subject[]> {
    return api.get<Subject[]>('/subjects');
  },

  async getById(id: number): Promise<Subject> {
    return api.get<Subject>(`/subjects/${id}`);
  },

  async create(data: CreateSubjectRequest): Promise<Subject> {
    return api.post<Subject>('/subjects', data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/subjects/${id}`);
  },
};
