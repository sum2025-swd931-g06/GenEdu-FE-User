import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationAPI } from '../apis/notifications'
import { NotificationPaginationParams, NotificationType } from '../types/notification.type'

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  byEmail: (email: string) => [...notificationKeys.all, 'byEmail', email] as const,
  paginated: (params?: NotificationPaginationParams) => [...notificationKeys.all, 'paginated', params] as const
}

// Get notifications by email
export const useNotificationsByEmail = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: notificationKeys.byEmail(email),
    queryFn: () => notificationAPI.getNotificationsByEmail(email),
    enabled: enabled && !!email,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2 // Refetch every 2 minutes for real-time updates
  })
}

// Get paginated notifications
export const useNotificationsPaginated = (params?: NotificationPaginationParams) => {
  return useQuery({
    queryKey: notificationKeys.paginated(params),
    queryFn: () => notificationAPI.getNotificationsPaginated(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2 // Refetch every 2 minutes
  })
}

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => notificationAPI.markAsRead(id),
    onSuccess: () => {
      // Invalidate all notification queries to refresh the data
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    }
  })
}

// Send notification to user
export const useSendNotificationToUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      email,
      title,
      body,
      type = 'INFO'
    }: {
      email: string
      title: string
      body: string
      type?: NotificationType
    }) => notificationAPI.sendNotificationToUser(email, title, body, type),
    onSuccess: () => {
      // Invalidate all notification queries to refresh the data
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    }
  })
}
