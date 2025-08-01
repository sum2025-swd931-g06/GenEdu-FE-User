// import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

async function enableMocking() {
  // if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  //   return worker.start({
  //     onUnhandledRequest: 'bypass' // Don't warn about unhandled requests
  //   })
  // }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    // </StrictMode>
  )
})
