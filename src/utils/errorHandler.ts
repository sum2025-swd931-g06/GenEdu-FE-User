import toast from 'react-hot-toast'

// API Error Response Structure
interface APIError {
  statusCode: string
  title: string
  detail: string
  fieldErrors: Record<string, string[]> | null
}

// Axios Error Interface
interface AxiosError {
  response?: {
    data?: APIError
    status?: number
  }
  code?: string
  message?: string
}

// Error Handler Utility
export class ErrorHandler {
  static handleAPIError(error: unknown, fallbackMessage: string = 'An error occurred'): void {
    console.error('API Error:', error)

    const axiosError = error as AxiosError

    // Check if it's an axios error with response data
    if (axiosError?.response?.data) {
      const apiError: APIError = axiosError.response.data

      // Use the detail field as the primary error message
      if (apiError.detail) {
        toast.error(apiError.detail, {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #f5222d',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px'
          },
          iconTheme: {
            primary: '#f5222d',
            secondary: '#fff'
          }
        })
        return
      }

      // Fallback to title if detail is not available
      if (apiError.title) {
        toast.error(apiError.title, {
          duration: 4000,
          position: 'top-right'
        })
        return
      }

      // Handle field errors if available
      if (apiError.fieldErrors) {
        const fieldErrorMessages = Object.entries(apiError.fieldErrors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('\n')

        toast.error(`Validation errors:\n${fieldErrorMessages}`, {
          duration: 6000,
          position: 'top-right'
        })
        return
      }
    }

    // Handle network errors
    if (axiosError?.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.', {
        duration: 4000,
        position: 'top-right'
      })
      return
    }

    // Handle timeout errors
    if (axiosError?.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.', {
        duration: 4000,
        position: 'top-right'
      })
      return
    }

    // Handle 401 errors
    if (axiosError?.response?.status === 401) {
      toast.error('Authentication failed. Please login again.', {
        duration: 4000,
        position: 'top-right'
      })
      return
    }

    // Handle 403 errors
    if (axiosError?.response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.', {
        duration: 4000,
        position: 'top-right'
      })
      return
    }

    // Handle 404 errors
    if (axiosError?.response?.status === 404) {
      toast.error('Resource not found.', {
        duration: 4000,
        position: 'top-right'
      })
      return
    }

    // Handle 500 errors
    if (axiosError?.response?.status === 500) {
      toast.error('Internal server error. Please try again later.', {
        duration: 4000,
        position: 'top-right'
      })
      return
    }

    // Fallback error message
    toast.error(fallbackMessage, {
      duration: 4000,
      position: 'top-right'
    })
  }

  static handleSuccess(message: string): void {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #52c41a',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      iconTheme: {
        primary: '#52c41a',
        secondary: '#fff'
      }
    })
  }

  static handleWarning(message: string): void {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #faad14',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      iconTheme: {
        primary: '#faad14',
        secondary: '#fff'
      }
    })
  }

  static handleInfo(message: string): void {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #1890ff',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      iconTheme: {
        primary: '#1890ff',
        secondary: '#fff'
      }
    })
  }

  static handleLoading(message: string): string {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }
    })
  }

  static dismissToast(toastId: string): void {
    toast.dismiss(toastId)
  }
}
