import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import { SignInCredentials, SignUpCredentials } from '@/types/auth'

interface AuthContextType {
  user: User | null
  currentUser: User | null
  loading: boolean
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (credentials: SignInCredentials) => Promise<void>
  signUp: (credentials: SignUpCredentials) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          console.log('Initial session:', session?.user?.id)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword(credentials)
      if (error) throw error
    } catch (error: any) {
      console.error('Sign in error:', error)
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: { emailRedirectTo: `${window.location.origin}/cliente` },
      })
      if (error) throw error
      alert('Check your email for the confirmation link!')
    } catch (error: any) {
      console.error('Sign up error:', error)
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
    } catch (error: any) {
      console.error('Error signing out:', error)
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    currentUser: user,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 