import axios from 'axios'
import { UserData } from '../types/auth.type'
import { Project, ProjectDetail, ProjectResponseDTO } from '../types/project.type'
import api from './api.config'

// User API
export const userAPI = {
  getProfile: (): Promise<UserData> => api.get('/user/profile').then((res) => res.data),

  getProjects: (): Promise<Project[]> => api.get('/user/projects').then((res) => res.data)
}
// Project API
export const projectAPI = {
  getAllProjectOfUser: (): Promise<ProjectResponseDTO[]> => api.get('/projects').then((res) => res.data),

  getById: (id: string): Promise<ProjectDetail> => api.get(`/projects/${id}`).then((res) => res.data),

  create: (projectData: Partial<Project>): Promise<Project> =>
    api.post('/projects', projectData).then((res) => res.data),

  update: (id: string, updates: Partial<Project>): Promise<Project> =>
    api.put(`/projects/${id}`, updates).then((res) => res.data),

  delete: (id: string): Promise<{ message: string }> => api.delete(`/projects/${id}`).then((res) => res.data)
}

export default api
