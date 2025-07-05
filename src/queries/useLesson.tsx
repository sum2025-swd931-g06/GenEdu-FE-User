import { useKeycloak } from '@react-keycloak/web'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Lesson } from '../types/lesson.type'
import api from '../apis/api.config'

// API service for lessons
const lessonsService = {
  async fetchLessons(token: string): Promise<Lesson[]> {
    const response = await api.get('/contents/lessons', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status !== 200) {
      throw new Error(`Failed to fetch lessons: ${response.status} ${response.statusText}`)
    }

    return response.data as Lesson[]
  }
}

// Query keys for React Query cache management
export const lessonQueryKeys = {
  all: ['lessons'] as const,
  lists: () => [...lessonQueryKeys.all, 'list'] as const,
  byChapter: (chapterId: number) => [...lessonQueryKeys.all, 'chapter', chapterId] as const,
  byId: (lessonId: number) => [...lessonQueryKeys.all, 'lesson', lessonId] as const
}

// Main hook to fetch all lessons
export const useLessons = (): UseQueryResult<Lesson[], Error> => {
  const { keycloak } = useKeycloak()

  return useQuery({
    queryKey: lessonQueryKeys.lists(),
    queryFn: () => {
      const token = keycloak.token
      if (!token) {
        throw new Error('No authentication token available')
      }
      return lessonsService.fetchLessons(token)
    },
    enabled: !!keycloak.authenticated && !!keycloak.token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}

// Hook to get lessons grouped by chapters
export const useLessonsGroupedByChapter = () => {
  const { data: lessons, ...rest } = useLessons()

  const groupedLessons = lessons?.reduce(
    (acc, lesson) => {
      const chapterId = lesson.chapterId
      if (!acc[chapterId]) {
        acc[chapterId] = {
          chapter: {
            id: lesson.chapterId,
            title: lesson.chapterTitle,
            orderNumber: lesson.chapterOrderNumber,
            description: lesson.chapterDescription
          },
          lessons: []
        }
      }
      acc[chapterId].lessons.push(lesson)
      return acc
    },
    {} as Record<
      number,
      {
        chapter: {
          id: number
          title: string
          orderNumber: number
          description: string
        }
        lessons: Lesson[]
      }
    >
  )

  // Sort chapters by order number and lessons within each chapter
  const sortedGroupedLessons = groupedLessons
    ? Object.values(groupedLessons)
        .sort((a, b) => a.chapter.orderNumber - b.chapter.orderNumber)
        .map((group) => ({
          ...group,
          lessons: group.lessons.sort((a, b) => a.lessonOrderNumber - b.lessonOrderNumber)
        }))
    : []

  return {
    data: sortedGroupedLessons,
    groupedData: groupedLessons,
    ...rest
  }
}

// Hook to get lessons by specific chapter
export const useLessonsByChapter = (chapterId: number): UseQueryResult<Lesson[], Error> => {
  const { keycloak } = useKeycloak()

  return useQuery({
    queryKey: lessonQueryKeys.byChapter(chapterId),
    queryFn: async () => {
      const token = keycloak.token
      if (!token) {
        throw new Error('No authentication token available')
      }
      const allLessons = await lessonsService.fetchLessons(token)
      return allLessons
        .filter((lesson) => lesson.chapterId === chapterId)
        .sort((a, b) => a.lessonOrderNumber - b.lessonOrderNumber)
    },
    enabled: !!keycloak.authenticated && !!keycloak.token && chapterId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

// Hook to get a specific lesson by ID
export const useLessonById = (lessonId: number): UseQueryResult<Lesson | undefined, Error> => {
  const { keycloak } = useKeycloak()

  return useQuery({
    queryKey: lessonQueryKeys.byId(lessonId),
    queryFn: async () => {
      const token = keycloak.token
      if (!token) {
        throw new Error('No authentication token available')
      }
      const allLessons = await lessonsService.fetchLessons(token)
      return allLessons.find((lesson) => lesson.lessonId === lessonId)
    },
    enabled: !!keycloak.authenticated && !!keycloak.token && lessonId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

// Hook to get unique chapters
export const useChapters = () => {
  const { data: lessons, ...rest } = useLessons()

  const chapters = lessons?.reduce(
    (acc, lesson) => {
      if (!acc.find((chapter) => chapter.id === lesson.chapterId)) {
        acc.push({
          id: lesson.chapterId,
          title: lesson.chapterTitle,
          orderNumber: lesson.chapterOrderNumber,
          description: lesson.chapterDescription
        })
      }
      return acc
    },
    [] as Array<{
      id: number
      title: string
      orderNumber: number
      description: string
    }>
  )

  const sortedChapters = chapters?.sort((a, b) => a.orderNumber - b.orderNumber) || []

  return {
    data: sortedChapters,
    ...rest
  }
}

// Hook for search functionality
export const useSearchLessons = (searchTerm: string) => {
  const { data: lessons, ...rest } = useLessons()

  const filteredLessons =
    lessons?.filter(
      (lesson) =>
        lesson.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.lessonDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  return {
    data: filteredLessons,
    searchTerm,
    ...rest
  }
}

// Utility functions for working with lesson data
export const lessonUtils = {
  // Get lesson progress (if you have progress tracking)
  getLessonProgress: (lessonId: number): number => {
    // This would typically come from a separate API or local storage
    const progress = localStorage.getItem(`lesson_progress_${lessonId}`)
    return progress ? parseInt(progress) : 0
  },

  // Set lesson progress
  setLessonProgress: (lessonId: number, progress: number): void => {
    localStorage.setItem(`lesson_progress_${lessonId}`, progress.toString())
  },

  // Check if lesson is completed
  isLessonCompleted: (lessonId: number): boolean => {
    return lessonUtils.getLessonProgress(lessonId) >= 100
  },

  // Get next lesson in the same chapter
  getNextLesson: (currentLesson: Lesson, allLessons: Lesson[]): Lesson | null => {
    const chapterLessons = allLessons
      .filter((lesson) => lesson.chapterId === currentLesson.chapterId)
      .sort((a, b) => a.lessonOrderNumber - b.lessonOrderNumber)

    const currentIndex = chapterLessons.findIndex((lesson) => lesson.lessonId === currentLesson.lessonId)
    return currentIndex >= 0 && currentIndex < chapterLessons.length - 1 ? chapterLessons[currentIndex + 1] : null
  },

  // Get previous lesson in the same chapter
  getPreviousLesson: (currentLesson: Lesson, allLessons: Lesson[]): Lesson | null => {
    const chapterLessons = allLessons
      .filter((lesson) => lesson.chapterId === currentLesson.chapterId)
      .sort((a, b) => a.lessonOrderNumber - b.lessonOrderNumber)

    const currentIndex = chapterLessons.findIndex((lesson) => lesson.lessonId === currentLesson.lessonId)
    return currentIndex > 0 ? chapterLessons[currentIndex - 1] : null
  }
}

// Export default hook
export default useLessons
