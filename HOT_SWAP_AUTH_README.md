# 🔄 Hot-Swap Authentication System

This implementation provides a seamless fallback system that automatically switches between **Keycloak SSO** and **Local Authentication** based on availability.

## 🎯 **Features**

✅ **Auto-Detection** - Automatically detects if Keycloak is available  
✅ **Hot-Swapping** - Runtime switching between auth providers  
✅ **Unified Interface** - Same hooks and components work with both providers  
✅ **Graceful Fallback** - Falls back to local auth if Keycloak fails  
✅ **Development Tools** - Debug component for testing  
✅ **Mock API Support** - Built-in mock authentication for development

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    App.tsx                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            UnifiedAuthProvider                      │    │
│  │  ┌─────────────────┐  ┌─────────────────────────┐   │    │
│  │  │ KeycloakProvider│  │   LocalAuthProvider     │   │    │
│  │  └─────────────────┘  └─────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                useAuth() Hook                               │
│  - Unified interface for both providers                    │
│  - Auto-detects active provider                            │
│  - Returns consistent API                                   │
└─────────────────────────────────────────────────────────────┘
```

## ⚙️ **Configuration**

### Environment Variables

Create a `.env` file in your project root:

\`\`\`env

# Authentication Provider ('keycloak' or 'local' or 'auto')

VITE_AUTH_PROVIDER=auto

# Keycloak Configuration

VITE_KEYCLOAK_ENABLED=true
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=GenEdu
VITE_KEYCLOAK_CLIENT_ID=genedu-frontend

# Local Auth Configuration

VITE_LOCAL_AUTH_ENABLED=true
VITE_API_URL=http://localhost:3000/api
\`\`\`

### Provider Selection Logic

1. **AUTO MODE (Recommended)**: Automatically detects Keycloak availability
2. **KEYCLOAK MODE**: Forces Keycloak (falls back to local if unavailable)
3. **LOCAL MODE**: Forces local authentication

## 🔧 **Implementation Details**

### 1. **UnifiedAuthProvider** (`src/contexts/UnifiedAuthProvider.tsx`)

Main provider that:

- Auto-detects auth provider availability
- Wraps the appropriate provider
- Handles initialization errors
- Provides provider switching functionality

### 2. **LocalAuthProvider** (`src/contexts/LocalAuthContext.tsx`)

Local authentication provider that:

- Manages JWT tokens in localStorage
- Provides login/register functionality
- Includes mock API for development
- Auto-refreshes tokens

### 3. **Unified useAuth Hook** (`src/hooks/useUnifiedAuth.ts`)

Single hook interface that:

- Works with both Keycloak and local auth
- Provides consistent API
- Auto-detects active provider
- Type-safe authentication methods

### 4. **Local Auth Service** (`src/services/local-auth.service.ts`)

Service layer that:

- Handles API communication
- Manages token storage
- Provides mock authentication
- Validates and refreshes tokens

## 📱 **Usage Examples**

### Basic Authentication

\`\`\`tsx
import { useAuth } from '../hooks/useAuth'

const MyComponent = () => {
const { user, isAuthenticated, login, logout, authProvider } = useAuth()

const handleLogin = async () => {
if (authProvider === 'local') {
// Local auth requires credentials
await login({ email: 'user@example.com', password: 'password' })
} else {
// Keycloak handles redirect
login()
}
}

return (
<div>
<p>Provider: {authProvider}</p>
{isAuthenticated ? (
<div>
<p>Welcome, {user?.fullName}!</p>
<button onClick={logout}>Logout</button>
</div>
) : (
<button onClick={handleLogin}>Login</button>
)}
</div>
)
}
\`\`\`

### Conditional Routing

\`\`\`tsx
import { useAuthProvider } from '../hooks/useAuth'

const AppRoutes = () => {
const authProvider = useAuthProvider()

return (
<Routes>
{/_ ... other routes ... _/}

      {authProvider === 'local' ? (
        <>
          <Route path='/login' element={<LocalLogin />} />
          <Route path='/register' element={<LocalRegister />} />
        </>
      ) : (
        <>
          <Route path='/login' element={<KeycloakLogin />} />
          <Route path='/register' element={<KeycloakRegister />} />
        </>
      )}
    </Routes>

)
}
\`\`\`

## 🧪 **Testing & Development**

### Mock Authentication

For development, use the built-in mock credentials:

- **Email**: \`demo@example.com\`
- **Password**: \`demo123\`

### Debug Component

Add the debug component to see auth state:

\`\`\`tsx
import AuthDebug from '../components/AuthDebug'

// In your component
<AuthDebug showToggle={true} />
\`\`\`

### Manual Provider Switching

In development, you can switch providers via console:

\`\`\`javascript
// Switch to local auth
window.switchAuthProvider('local')

// Switch to Keycloak
window.switchAuthProvider('keycloak')
\`\`\`

## 🚀 **Deployment Scenarios**

### Scenario 1: Full Keycloak Setup

- Keycloak server running
- All users authenticate via SSO
- Falls back to local if Keycloak is down

### Scenario 2: Local Development

- No Keycloak server
- Uses local authentication with mock API
- Easy development without external dependencies

### Scenario 3: Hybrid Environment

- Some users via Keycloak (employees)
- Some users via local auth (external users)
- Dynamic switching based on user type

## 🔐 **Security Considerations**

### Token Management

- **Keycloak**: Uses Keycloak's token management
- **Local**: JWT tokens stored in localStorage
- **Refresh**: Auto-refresh before expiration

### Validation

- **Keycloak**: Server-side validation via Keycloak
- **Local**: Custom validation endpoint
- **Fallback**: Mock validation for development

### HTTPS Requirements

- **Production**: Always use HTTPS
- **Development**: HTTP allowed for localhost
- **Tokens**: Secure transmission required

## 🐛 **Troubleshooting**

### Common Issues

1. **Keycloak Connection Failed**

   - Check VITE_KEYCLOAK_URL in .env
   - Verify Keycloak server is running
   - Check network connectivity

2. **Local Auth Not Working**

   - Verify VITE_API_URL in .env
   - Check if backend API is running
   - Falls back to mock if API unavailable

3. **Provider Not Switching**
   - Clear localStorage and cookies
   - Refresh the page
   - Check console for errors

### Debug Steps

1. Open browser DevTools
2. Check Console for auth logs
3. View Network tab for API calls
4. Check Application tab for localStorage
5. Use AuthDebug component

## 📚 **API Reference**

### useAuth Hook

\`\`\`typescript
interface UnifiedAuthContext {
user: AuthUser | LocalAuthUser | null
isAuthenticated: boolean
isLoading: boolean
token: string | null
refreshToken: string | null
login: (credentials?) => void | Promise<void>
logout: () => void
updateToken?: () => Promise<boolean>
authProvider: 'keycloak' | 'local'
}
\`\`\`

### Configuration Types

\`\`\`typescript
interface AuthConfig {
provider: 'keycloak' | 'local'
keycloak: {
enabled: boolean
url: string
realm: string
clientId: string
}
local: {
enabled: boolean
apiUrl: string
}
}
\`\`\`

## 🎉 **Benefits**

✅ **Zero Downtime** - Never lose authentication functionality  
✅ **Developer Friendly** - Easy local development  
✅ **Production Ready** - Robust error handling  
✅ **Type Safe** - Full TypeScript support  
✅ **Flexible** - Multiple deployment options

This hot-swap system ensures your authentication always works, regardless of external service availability!
