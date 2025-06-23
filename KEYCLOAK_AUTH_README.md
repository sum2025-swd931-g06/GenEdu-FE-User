# Keycloak Authentication System

This application uses **Keycloak** as the primary and only authentication provider. The authentication system is built using `@react-keycloak/web` and provides secure SSO integration.

## Features

- **Keycloak SSO Integration**: Secure authentication using Keycloak server
- **Token Management**: Automatic token refresh and session management
- **Protected Routes**: Route-level protection for authenticated content
- **User Profile**: Access to user information from Keycloak token
- **Debug Tools**: Development-only debug component showing auth status

## Configuration

### Environment Variables (.env)

```properties
# Authentication Configuration
VITE_AUTH_PROVIDER=keycloak

# Keycloak Configuration
VITE_KEYCLOAK_ENABLED=true
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=GenEdu
VITE_KEYCLOAK_CLIENT_ID=genedu-frontend

# Development flags
VITE_DEBUG_AUTH=false
```

### Required Environment Setup

1. **Keycloak Server**: Must be running at the configured URL
2. **Realm**: The specified realm must exist in Keycloak
3. **Client**: The client ID must be configured in the realm with:
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:5173/*` (adjust port as needed)
   - Web Origins: `http://localhost:5173`

## Architecture

### Core Components

1. **KeycloakProviderWithInit** (`src/core/keycloak/KeycloakProviderWithInit.tsx`)

   - Initializes Keycloak connection
   - Handles authentication events
   - Provides Keycloak context to the app

2. **AuthProvider** (`src/contexts/AuthContext.tsx`)

   - Wraps Keycloak context
   - Provides unified auth interface
   - Manages user state and token handling

3. **useAuth Hook** (`src/hooks/useAuth.ts`)
   - Primary interface for authentication
   - Returns auth state, user info, and auth methods
   - Used throughout the application

### Authentication Flow

1. **App Initialization**: App loads and initializes Keycloak
2. **Auto-Login Check**: Checks for existing session
3. **Login Redirect**: If not authenticated, user can trigger login
4. **Token Management**: Automatic token refresh
5. **Logout**: Clean session termination

## Usage

### Basic Auth Check

```tsx
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <button onClick={login}>Login</button>
  }

  return (
    <div>
      <p>Welcome, {user?.fullName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protected Routes

```tsx
import ProtectedRoute from './components/ProtectedRoute'

;<Route
  path='/profile'
  element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  }
/>
```

### Auth Context

The `useAuth` hook provides:

```typescript
interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: () => void
  logout: () => void
  updateToken: () => Promise<boolean>
}
```

## Development

### Debug Tools

In development mode, an `AuthDebug` component shows:

- Current authentication status
- User information (if authenticated)
- Token preview

### Troubleshooting

1. **Keycloak Connection Issues**

   - Verify Keycloak server is running
   - Check realm and client configuration
   - Ensure CORS settings allow your frontend domain

2. **Token Issues**

   - Check token expiration settings in Keycloak
   - Verify refresh token configuration
   - Monitor browser console for auth errors

3. **Redirect Issues**
   - Ensure Valid Redirect URIs are correctly configured
   - Check that Web Origins includes your frontend domain
   - Verify the frontend URL matches the redirect configuration

### Testing

To test authentication:

1. Start Keycloak server on configured port
2. Create test users in the realm
3. Run the frontend application
4. Test login/logout flows
5. Verify protected routes are working

## Security Considerations

- Tokens are stored in memory (not localStorage) for security
- Automatic token refresh prevents session expiration
- Protected routes ensure sensitive content requires authentication
- HTTPS should be used in production
- Keycloak should be properly secured and configured

## Production Deployment

1. **Environment Variables**: Set production Keycloak URL and realm
2. **HTTPS**: Ensure all communication is over HTTPS
3. **CORS**: Configure Keycloak CORS for production domains
4. **Client Configuration**: Update redirect URIs for production URLs
5. **Debug Mode**: Disable debug components (`VITE_DEBUG_AUTH=false`)
