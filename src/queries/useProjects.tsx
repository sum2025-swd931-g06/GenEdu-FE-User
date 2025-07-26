import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectAPI, userAPI } from '../apis/projects'
import { Project, PaginationParams } from '../types/project.type'

// Query keys
export const queryKeys = {
  user: {
    profile: ['user', 'profile'] as const,
    projects: ['user', 'projects'] as const
  },
  project: {
    detail: (id: string) => ['project', 'detail', id] as const,
    paginated: (params?: PaginationParams) => ['projects', 'paginated', params] as const
  }
}

// User queries
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: userAPI.getProfile
  })
}

export const useUserProjects = () => {
  return useQuery({
    queryKey: queryKeys.user.projects,
    queryFn: userAPI.getProjects
  })
}

// Project queries

export const useProjectsOfUser = (params?: PaginationParams) => {
  return useQuery({
    queryKey: queryKeys.project.paginated(params),
    queryFn: () => projectAPI.getAllProjectOfUser(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}

export const useProjectDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.project.detail(id),
    queryFn: () => projectAPI.getById(id),
    enabled: !!id
  })
}

// Project mutations
export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'paginated'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.projects })
    }
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) => projectAPI.update(id, updates),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'paginated'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.projects })
      queryClient.invalidateQueries({ queryKey: queryKeys.project.detail(variables.id) })
    }
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'paginated'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.projects })
    }
  })
}
