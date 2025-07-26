import api from './api.config'
import {
  NotificationResponse,
  PaginatedNotificationResponse,
  NotificationPaginationParams,
  NotificationEntity,
  NotificationType
} from '../types/notification.type'

export const notificationAPI = {
  // Get all notifications for a user by email
  getNotificationsByEmail: (email: string): Promise<NotificationResponse[]> =>
    api.get(`/notifications/${email}`).then((res) => res.data),

  // Get paginated notifications
  getNotificationsPaginated: (params?: NotificationPaginationParams): Promise<PaginatedNotificationResponse> => {
    const searchParams = new URLSearchParams()

    if (params?.page !== undefined) {
      searchParams.append('page', params.page.toString())
    }
    if (params?.size !== undefined) {
      searchParams.append('size', params.size.toString())
    }
    if (params?.sort && params.sort.length > 0) {
      params.sort.forEach((sortParam) => {
        searchParams.append('sort', sortParam)
      })
    }

    const queryString = searchParams.toString()
    const url = queryString ? `/notifications/page?${queryString}` : '/notifications/page'

    return api.get(url).then((res) => res.data)
  },

  // Mark notification as read
  markAsRead: (id: number): Promise<void> => api.patch(`/notifications/${id}/read`).then((res) => res.data),

  // Create a new notification (for debugging/testing)
  createNotification: (notification: Omit<NotificationEntity, 'id'>): Promise<string> =>
    api.post('/notifications', notification).then((res) => res.data),

  // Send notification to user
  sendNotificationToUser: (
    email: string,
    title: string,
    body: string,
    type: NotificationType = 'INFO'
  ): Promise<string> => {
    const params = new URLSearchParams({
      email,
      title,
      body,
      type
    })

    return api.post(`/notifications/send-to-user?${params.toString()}`).then((res) => res.data)
  }
}
