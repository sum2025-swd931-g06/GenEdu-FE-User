import { createContext } from 'react'
import type { LocalAuthContextType } from '../types/local-auth.type'

export const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined)
