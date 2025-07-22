// Test file to demonstrate react-hot-toast error handling

import { ErrorHandler } from '../utils/errorHandler'

// Example of how to use the ErrorHandler in your components:

// For API errors (will automatically extract detail from the error response):
try {
  const response = await api.get('/some-endpoint')
  // Handle success
} catch (error) {
  ErrorHandler.handleAPIError(error, 'Failed to fetch data')
}

// For success messages:
ErrorHandler.handleSuccess('Operation completed successfully!')

// For warnings:
ErrorHandler.handleWarning('Please check your input')

// For info messages:
ErrorHandler.handleInfo('Loading data...')

// For loading states:
const toastId = ErrorHandler.handleLoading('Processing...')
// Later dismiss it:
ErrorHandler.dismissToast(toastId)

// Examples of API error structures that will be handled:
const apiErrorExamples = {
  // This will show the detail message in the toast
  error500: {
    statusCode: '500 INTERNAL_SERVER_ERROR',
    title: 'Internal Server Error',
    detail:
      '500 Internal Server Error from GET http://192.168.192.10:8093/api/v1/medias/projects/lesson-plans/project/766ece8b-80c3-496c-b0b7-fe75a7b9165d',
    fieldErrors: null
  },

  // This will show validation errors for each field
  validationError: {
    statusCode: '400 BAD_REQUEST',
    title: 'Validation Error',
    detail: 'Request validation failed',
    fieldErrors: {
      title: ['Title is required'],
      description: ['Description must be at least 10 characters']
    }
  }
}

export { apiErrorExamples }
