import {
    createContext,
    useEffect,
    useReducer,
    useCallback,
    useMemo,
    useContext,
    useState,
    useRef,
} from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Role, UserProvider } from '@/@types'
// types
import type { Profile } from '@/@types/user'
import { toast } from 'sonner'
import { auth } from '@/lib/queries/auth'
import { AuthValidators } from '@/lib/validators/auth'
import { getCookie } from '@/lib/cookies'
import { httpClient, ResponseWithHeaders } from '@/lib/repository/http-client'

export type ActionMapType<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: M[Key] }
}

export type AuthStateType = {
    isAuthenticated: boolean
    isInitialized: boolean
    isAuthorized: boolean
    user: Profile | null
    role: Role | null
}

export type JWTContextType = {
    isAuthenticated: boolean
    isAuthorized: boolean
    isInitialized: boolean
    user: Profile | null
    role: Role | null
    signIn: (data: AuthValidators.SignIn) => Promise<void>
    signUp: (data: AuthValidators.SignUp) => Promise<void>
    signOut: () => void
    signInWithProvider?: (provider: UserProvider) => void
    refreshToken?: () => Promise<void>
}

export type GoogleUserResponse = {
    sub: string
    email: string
    name: string
    picture: string
}

export type FacebookUserResponse = {
    id: string
    email: string
    name: string
    picture: {
        data: { url: string }
    }
}

export type OauthAccount = {
    email: string
    name: string
    avatar: string
}

export type OAuth2Token = {
    access_token: string
    token_type: string
    expires_in: number
}

enum Types {
    INITIAL = 'INITIAL',
    BUSINESS = 'BUSINESS',
    LOGIN = 'LOGIN',
    REGISTER = 'REGISTER',
    LOGOUT = 'LOGOUT',
}

type Payload = {
    [Types.INITIAL]: {
        isAuthenticated: boolean
        user: Profile | null
        role: Role | null
        isAuthorized: boolean
    }
    [Types.BUSINESS]: {
        role: Role | null
        isAuthorized: boolean
    }
    [Types.LOGIN]: {
        user: Profile
    }
    [Types.LOGOUT]: undefined
}

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>]

const initialState: AuthStateType = {
    isAuthorized: false,
    isInitialized: false,
    isAuthenticated: false,
    user: null,
    role: null,
}

const reducer = (state: AuthStateType, action: ActionsType) => {
    if (action.type === Types.INITIAL) {
        return {
            isInitialized: true,
            isAuthenticated: action.payload.isAuthenticated,
            user: action.payload.user,
            role: action.payload.role,
            isAuthorized: action.payload.isAuthorized,
        }
    }
    if (action.type === Types.BUSINESS) {
        return {
            ...state,
            isAuthenticated: true,
            isAuthorized: action.payload.isAuthorized,
            role: action.payload.role,
        }
    }
    if (action.type === Types.LOGIN) {
        return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
        }
    }
    if (action.type === Types.LOGOUT) {
        return {
            ...state,
            isAuthenticated: false,
            user: null,
            role: null,
            isAuthorized: false
        }
    }
    return state
}

export const AuthContext = createContext<JWTContextType | null>(null)

export function AuthProvider({ children, }: Readonly<{ children: React.ReactNode }>) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const navigate = useNavigate()
    const refreshTimerRef = useRef<any>(null)
    const { mutateAsync: m1 } = useMutation(auth().signIn.mutationOptions())
    const { mutateAsync: m2 } = useMutation(auth().signUp.mutationOptions())
    const { mutateAsync: m3 } = useMutation(auth().signOut.mutationOptions())
    const { mutateAsync: m4 } = useMutation(auth().refresh.mutationOptions())
    const { data: profile, isError: profileError, refetch: refetchProfile } = useQuery(auth().profile.queryOptions())
    const { data: role, isError: roleError, refetch: refetchRole } = useQuery(auth().role.queryOptions())
    const [businessId, setBusinessId] = useState<string | undefined>(getCookie('X-Business-Id'))

    // Register response interceptor to capture token expiration from headers
    useEffect(() => {
        // console.log(httpClient.interceptors.response.getHandlers().length)
        httpClient.interceptors.response.use(
            async (response) => {
                console.log('Response interceptor called with headers:', (response as ResponseWithHeaders<any>).headers)
                // Check for token expiration in response headers (from auto-refresh)
                const expiration = (response as ResponseWithHeaders<any>).headers?.get?.('X-Access-Token-Expiration')
                if (expiration) {
                    localStorage.setItem('accessTokenExpiration', expiration)
                }
                return response
            }
        )

        // Cleanup interceptor on unmount
        return () => {
            // Note: InterceptorManager doesn't have a remove method, so we leave it registered
            // This is fine as it's a global interceptor for the auth flow
        }
    }, [])

    useEffect(() => {
        const handler = () => {
            setBusinessId(getCookie('X-Business-Id'))
        }
        window.addEventListener('business-id-change', handler)
        return () => {
            window.removeEventListener('business-id-change', handler)
        }
    }, [])

    // Re-fetch role when businessId changes
    useEffect(() => {
        if (businessId) refetchRole()
    }, [businessId, refetchRole])

    // Update auth state when role data arrives
    useEffect(() => {
        if (role) {
            dispatch({
                type: Types.BUSINESS,
                payload: {
                    role: role.data,
                    isAuthorized: true
                },
            })
        }
    }, [role])

    // Handle role fetch errors
    useEffect(() => {
        if (roleError) {
            dispatch({
                type: Types.BUSINESS,
                payload: {
                    role: null,
                    isAuthorized: false
                },
            })
        }
    }, [roleError])

    // const isRefreshing = useRef<boolean>(false)
    // const refreshTimerRef = useRef<number | null>(null)
    // const { lastTokenRefresh } = useSelector(state => state.app)

    useEffect(() => {
        if (state.isAuthenticated) refetchProfile()
    }, [state.isAuthenticated, refetchProfile])

    useEffect(() => {
        if (profile) {
            dispatch({
                type: Types.INITIAL,
                payload: {
                    user: profile.data,
                    isAuthenticated: true,
                    role: null,
                    isAuthorized: false
                },
            })
        }
    }, [profile])

    useEffect(() => {
        if (profileError) {
            dispatch({
                type: Types.INITIAL,
                payload: {
                    user: null,
                    isAuthenticated: false,
                    role: null,
                    isAuthorized: false
                },
            })
        }
    }, [profileError])

    // Schedule token refresh before expiration. Refreshes 20 seconds before the token expires
    const scheduleTokenRefresh = useCallback(async () => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)

        const expiredIn = localStorage.getItem('accessTokenExpiration')
        if (!expiredIn) return
        const expirationTime = Number(expiredIn) * 1000
        const now = Date.now()
        const timeUntilExpiration = Math.max(expirationTime - now, 0)
        const REFRESH_BUFFER = 20 * 1000

        // If token already expired or expires within buffer, refresh immediately
        if (timeUntilExpiration <= REFRESH_BUFFER) {
            await m4(undefined, {
                onError(error) {
                    console.error('Token refresh failed:', error)
                    // If refresh fails, log out the user
                    dispatch({ type: Types.LOGOUT })
                    navigate({ replace: true, to: '/sign-in' })
                },
                onSuccess(response) {
                    localStorage.setItem('accessTokenExpiration', response.data.accessTokenExpiration)
                    // After successful refresh, schedule the next one
                    scheduleTokenRefresh()
                }
            })
            return
        }

        // Schedule refresh for later
        const timeUntilRefresh = timeUntilExpiration - REFRESH_BUFFER
        refreshTimerRef.current = setTimeout(() => {
            m4(undefined, {
                onError(error) {
                    console.error('Token refresh failed:', error)
                    // If refresh fails, log out the user
                    dispatch({ type: Types.LOGOUT })
                    navigate({ replace: true, to: '/sign-in' })
                },
                onSuccess(response) {
                    localStorage.setItem('accessTokenExpiration', response.data.accessTokenExpiration)
                    // After successful refresh, schedule the next one
                    scheduleTokenRefresh()
                }
            })
        }, timeUntilRefresh)
    }, [m4, navigate])

    // Schedule token refresh when user logs in
    useEffect(() => {
        if (state.isAuthenticated) {
            scheduleTokenRefresh()
        } else {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
        }
        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
        }
    }, [state.isAuthenticated, scheduleTokenRefresh])

    const signIn = useCallback(
        async (data: AuthValidators.SignIn) => {
            await m1(data, {
                onSuccess: (response) => {
                    dispatch({
                        type: Types.LOGIN,
                        payload: { user: response.data.user },
                    })
                    toast.success(response.message)
                    localStorage.setItem('accessTokenExpiration', response.data.accessTokenExpiration)
                    navigate({ replace: true, to: '/businesses' })
                },
            })
        },
        [navigate, m1]
    )

    const signUp = useCallback(
        async (data: AuthValidators.SignUp) => {
            await m2(data, {
                onSuccess: (response) => {
                    toast.success(response.message)
                    navigate({ to: '/sign-in' })
                },
            })
        },
        [navigate, m2]
    )

    const signOut = useCallback(async () => {
        await m3(undefined, {
            onSuccess: (_) => {
                dispatch({ type: Types.LOGOUT })
                navigate({ replace: true, to: '/sign-in' })
            },
        })
    }, [navigate, m3])

    const memoizedValue: JWTContextType = useMemo(
        () => ({
            isAuthorized: state.isAuthorized,
            isInitialized: state.isInitialized,
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            role: state.role,
            signIn,
            signUp,
            signOut,
        }),
        [state, signIn, signOut, signUp]
    )

    return (
        <AuthContext.Provider value={memoizedValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth context must be use inside AuthProvider')
    }
    return context
}