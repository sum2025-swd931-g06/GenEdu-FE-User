import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../apis/api.config'
import { ProjectResponseDTO } from '../types/project.type'

interface CreateProjectParams {
  lessonId: number
  title: string
  customInstructions?: string
  slideNumber?: number
}

interface CreateProjectError {
  message: string
  status?: number
}

// API service for creating projects
const createProject = async (params: CreateProjectParams): Promise<ProjectResponseDTO> => {
  const response = await api.post<ProjectResponseDTO>('/contents/projects', params)

  if (response.status !== 201) {
    throw new Error(`Failed to create project: ${response.status} ${response.statusText}`)
  }

  return response.data
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation<ProjectResponseDTO, CreateProjectError, CreateProjectParams>({
    mutationFn: createProject,
    onSuccess: (data) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] })

      // Optionally add the new project to the cache
      queryClient.setQueryData(['projects'], (oldData: ProjectResponseDTO[] | undefined) => {
        if (!oldData) return [data]
        return [data, ...oldData]
      })
    },
    onError: (error) => {
      console.error('Failed to create project:', error)
    }
  })
}

// Validation helpers
export const validateProjectRequest = (params: CreateProjectParams): string[] => {
  const errors: string[] = []

  if (!params.lessonId || params.lessonId <= 0) {
    errors.push('Lesson ID must be a positive number.')
  }

  if (!params.title || params.title.trim().length === 0) {
    errors.push('Title is required.')
  } else if (params.title.length > 255) {
    errors.push('Title must be less than 255 characters.')
  }

  if (params.customInstructions && params.customInstructions.length > 1000) {
    errors.push('Custom instructions must be less than 1000 characters.')
  }

  if (params.slideNumber !== undefined && params.slideNumber < 1) {
    errors.push('Slide number must be at least 1.')
  }

  return errors
}

export default useCreateProject
