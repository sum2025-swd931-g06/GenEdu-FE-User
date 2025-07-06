export interface Slide {
  id: string
  title: string
  content: string
  order: number
}

export interface ProjectDetail extends Project {
  slides: Slide[]
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
