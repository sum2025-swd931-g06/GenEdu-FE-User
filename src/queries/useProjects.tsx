import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userAPI, projectAPI } from '../apis/projects'
import type { Project } from '../types/auth.type'

// Query keys
export const queryKeys = {
  user: {
    profile: ['user', 'profile'] as const,
    projects: ['user', 'projects'] as const
  },
  project: {
    detail: (id: string) => ['project', 'detail', id] as const
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
      queryClient.invalidateQueries({ queryKey: queryKeys.user.projects })
    }
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) => projectAPI.update(id, updates),
    onSuccess: (data, variables) => {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.user.projects })
    }
  })
}
