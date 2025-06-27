import { useState, useEffect, useCallback } from 'react'
import { Project, ProjectDetail, AudioProject } from '../types/auth.type'
import { projectService } from '../services/project.service'
import { useAuth } from './useAuth'

/**
 * Custom hook for managing project data and operations
 */
export const useProjects = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [audioProjects, setAudioProjects] = useState<AudioProject[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUserProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Initialize service with current user
      await projectService.loginUser(user?.email || '')
      const userProjects = await projectService.getUserProjects()
      setProjects(userProjects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [user])

  const loadUserAudioProjects = useCallback(async () => {
    try {
      const userAudioProjects = await projectService.getUserAudioProjects()
      setAudioProjects(userAudioProjects)
    } catch (err) {
      console.error('Failed to load audio projects:', err)
    }
  }, [])

  // Load user projects when user changes
  useEffect(() => {
    if (user?.email) {
      loadUserProjects()
      loadUserAudioProjects()
    }
  }, [user, loadUserProjects, loadUserAudioProjects])

  const createProject = async (title: string, topic: string): Promise<Project | null> => {
    try {
      setLoading(true)
      setError(null)

      const newProject = await projectService.createProject(title, topic)
      setProjects((prev) => [newProject, ...prev])
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getProjectDetails = async (projectId: string): Promise<ProjectDetail | null> => {
    try {
      setLoading(true)
      setError(null)

      return await projectService.getProjectDetails(projectId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project details')
      return null
    } finally {
      setLoading(false)
    }
  }

  const generateSlides = async (projectId: string, topic: string): Promise<ProjectDetail | null> => {
    try {
      setLoading(true)
      setError(null)

      const projectDetail = await projectService.generateSlides(projectId, topic)

      // Update local projects state
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, slideNum: projectDetail?.slides.length || 0, status: 'IN_PROGRESS' } : p
        )
      )

      return projectDetail
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate slides')
      return null
    } finally {
      setLoading(false)
    }
  }

  const generateAudioNarration = async (
    projectId: string,
    textContent: string,
    voiceType?: string
  ): Promise<AudioProject | null> => {
    try {
      setLoading(true)
      setError(null)

      const audioProject = await projectService.generateAudioNarration(projectId, textContent, voiceType)

      // Update local state
      setAudioProjects((prev) => [audioProject, ...prev])
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, audioProject } : p)))

      return audioProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate audio narration')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateProjectStatus = async (
    projectId: string,
    status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'
  ): Promise<void> => {
    try {
      setError(null)

      const updatedProject = await projectService.updateProjectStatus(projectId, status)
      if (updatedProject) {
        setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project status')
    }
  }

  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const success = await projectService.deleteProject(projectId)
      if (success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
        setAudioProjects((prev) => prev.filter((a) => a.id !== `audio-${projectId}`))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
    } finally {
      setLoading(false)
    }
  }

  const searchProjects = async (query: string): Promise<Project[]> => {
    try {
      setError(null)
      return await projectService.searchProjects(query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search projects')
      return []
    }
  }

  const exportProject = async (projectId: string, format: 'pdf' | 'pptx' | 'html'): Promise<string | null> => {
    try {
      setLoading(true)
      setError(null)

      return await projectService.exportProject(projectId, format)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export project')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getProjectStats = useCallback(async () => {
    try {
      return await projectService.getProjectStats()
    } catch (err) {
      console.error('Failed to get project stats:', err)
      return {
        totalProjects: 0,
        completedProjects: 0,
        totalSlides: 0,
        totalAudioMinutes: 0
      }
    }
  }, [])

  const refreshProjects = () => {
    loadUserProjects()
    loadUserAudioProjects()
  }

  return {
    // State
    projects,
    audioProjects,
    loading,
    error,

    // Actions
    createProject,
    getProjectDetails,
    generateSlides,
    generateAudioNarration,
    updateProjectStatus,
    deleteProject,
    searchProjects,
    exportProject,
    getProjectStats,
    refreshProjects,

    // Helpers
    clearError: () => setError(null)
  }
}

/**
 * Hook for getting individual project details
 */
export const useProject = (projectId: string | undefined) => {
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      loadProjectDetail()
    }
  }, [projectId])

  const loadProjectDetail = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      setError(null)

      const detail = await projectService.getProjectDetails(projectId)
      setProjectDetail(detail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project details')
    } finally {
      setLoading(false)
    }
  }

  const refreshProject = () => {
    loadProjectDetail()
  }

  return {
    projectDetail,
    loading,
    error,
    refreshProject,
    clearError: () => setError(null)
  }
}
