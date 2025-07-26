export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR'

export type NotificationIcon = 'MESSAGE' | 'ALERT' | 'CHECK' | 'ERROR'

export type NotificationColor = 'BLUE' | 'YELLOW' | 'GREEN' | 'RED'

export interface NotificationEntity {
  id: number
  type: NotificationType
  title: string
  description: string
  time: string // ISO string from LocalDateTime
  isRead: boolean
  iconName: NotificationIcon
  iconColorHex: NotificationColor
  email: string
}

export interface NotificationResponse {
  id: number
  type: NotificationType
  title: string
  description: string
  time: string // ISO string from LocalDateTime
  isRead: boolean
  iconName: NotificationIcon
  iconColorHex: NotificationColor
  email?: string // Optional in response
}

// For paginated notifications
export interface PaginatedNotificationResponse {
  content: NotificationEntity[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      empty: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface NotificationPaginationParams {
  page?: number
  size?: number
  sort?: string[]
}
