export interface Slide {
  id: string
  title: string
  content: string
  order: number
}

// Forward declaration for SlideGenerationParams to avoid circular dependencies
export interface SlideGenerationParams {
  topic: string
  description?: string
  slideCount: number
  lesson?: unknown // Use unknown instead of any for better type safety
}

export interface ProjectDetail extends Project {
  slides: Slide[]
  // Optional properties for draft projects
  creationTime?: number
  metadata?: {
    topic?: string
    description?: string
    generationParams?: SlideGenerationParams
    totalWords?: number
    layoutDistribution?: Record<string, number>
    themes?: string[]
    totalSlides?: number
    createdFrom?: string
  }
  // Optional audio project for full projects
  audioProject?: {
    id?: string
    title?: string
    status?: 'DRAFT' | 'PROCESSING' | 'COMPLETED' | 'ERROR'
    audioUrl?: string
    textContent?: string
    duration?: number
  }
}

// Project types - Updated to align with simplified backend entity
export interface Project {
  id: string // UUID as string
  userId: string // UUID as string, required
  lessonId: number // Required
  title: string // Required
  lessonPlanFileId?: number // File ID instead of URL
  customInstructions?: string
  status: ProjectStatus
  slideNum?: number // Default 10 in backend
  templateId?: number
  createdOn?: string // ISO string from ZonedDateTime
  lastModifiedOn?: string // ISO string from ZonedDateTime
  deleted?: boolean // Soft delete flag
}

export type ProjectStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'

// Project Request/Response types based on backend DTOs
export interface ProjectRequestDTO {
  lessonId: number
  title: string
  customInstructions: string
  slideNumber: number
}

export interface ProjectResponseDTO {
  id: string // UUID as string
  userId: string // UUID as string
  lessonId: number
  title: string
  lessonPlanFileId?: number // Changed from lessonPlanFileUrl
  customInstructions?: string
  status: ProjectStatus
  slideNum?: number
  templateId?: number
}

export type UploadLessonPlanFileResponseDTO = {
  id: string // UUID as string
  userId: string // UUID as string
  lessonId: number
  title: string
  lessonPlanFileUrl?: string // Changed from lessonPlanFileId
  customInstructions?: string
  status: ProjectStatus
  slideNum?: number
  templateId?: number
}

// Pagination types
export interface Sort {
  sorted: boolean
  empty: boolean
  unsorted: boolean
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: Sort
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: Pageable
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: Sort
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}
