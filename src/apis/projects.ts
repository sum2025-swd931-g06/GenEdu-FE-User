import axios from 'axios'
import type { UserData, Project, ProjectDetail } from '../types/auth.type'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// User API
export const userAPI = {
  getProfile: (): Promise<UserData> => api.get('/user/profile').then((res) => res.data),

  getProjects: (): Promise<Project[]> => api.get('/user/projects').then((res) => res.data)
}

// Project API
export const projectAPI = {
  getById: (id: string): Promise<ProjectDetail> => api.get(`/projects/${id}`).then((res) => res.data),

  create: (projectData: Partial<Project>): Promise<Project> =>
    api.post('/projects', projectData).then((res) => res.data),

  update: (id: string, updates: Partial<Project>): Promise<Project> =>
    api.put(`/projects/${id}`, updates).then((res) => res.data),

  delete: (id: string): Promise<{ message: string }> => api.delete(`/projects/${id}`).then((res) => res.data)
}

export default api
