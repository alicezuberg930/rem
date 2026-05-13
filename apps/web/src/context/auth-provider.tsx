import {
    createContext,
    useEffect,
    useReducer,
    useCallback,
    useMemo,
    useContext,
    useState,
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

export function AuthProvider({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const navigate = useNavigate()
    const { mutateAsync: m1 } = useMutation(auth().signIn.mutationOptions())
    const { mutateAsync: m2 } = useMutation(auth().signUp.mutationOptions())
    const { mutateAsync: m3 } = useMutation(auth().signOut.mutationOptions())
    const { data: profile, isError: profileError, refetch: refetchProfile } = useQuery(auth().profile.queryOptions())
    const { data: role, isError: roleError, refetch: refetchRole } = useQuery(auth().role.queryOptions())
    const [businessId, setBusinessId] = useState<string | undefined>(getCookie('X-Business-Id'))

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

    const signIn = useCallback(
        async (data: AuthValidators.SignIn) => {
            await m1(data, {
                onSuccess: (response) => {
                    dispatch({
                        type: Types.LOGIN,
                        payload: { user: response.data.user },
                    })
                    toast.success(response.message)
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

    // const refreshToken = useCallback(async () => {
    //     if (isRefreshing.current) return
    //     isRefreshing.current = true
    //     try {
    //         const response = await axios.post('/auth/refresh-token')
    //         if (response.status === 200) {
    //             console.log('Token refreshed successfully')
    //             // Store the refresh timestamp
    //             dispatchRedux(setLastTokenRefresh(Date.now()))
    //         }
    //     } catch (error) {
    //         console.error('Failed to refresh token:', error)
    //         // If refresh fails, log out the user
    //         dispatch({ type: Types.LOGOUT })
    //         navigate(paths.HOME, { replace: true })
    //     } finally {
    //         isRefreshing.current = false
    //     }
    // }, [navigate])

    // const signInWithProvider = useCallback((provider: UserProvider) => {
    //     const apiUrl = import.meta.env.VITE_API_URL
    //     window.location.href = `${apiUrl}/auth/provider/${provider}`
    // }, [])

    // Set up axios interceptor for automatic token refresh on 401
    // useEffect(() => {
    //     const interceptor = axios.interceptors.response.use((response) => response,
    //         async (error) => {
    //             const originalRequest = error.config
    //             if (error.response?.status === 401 && !originalRequest._retry) {
    //                 originalRequest._retry = true
    //                 try {
    //                     await refreshToken()
    //                     return axios(originalRequest)
    //                 } catch (refreshError) {
    //                     return Promise.reject(refreshError)
    //                 }
    //             }
    //             return Promise.reject(error)
    //         }
    //     )
    //     return () => {
    //         axios.interceptors.response.eject(interceptor)
    //     }
    // }, [refreshToken])

    // Set up automatic token refresh every 30 minutes
    // useEffect(() => {
    //     if (state.isAuthenticated) {
    //         // 29 minutes in milliseconds
    //         const REFRESH_INTERVAL = 29 * 60 * 1000
    //         // Check when the last refresh happened
    //         const now = Date.now()
    //         let timeUntilNextRefresh = REFRESH_INTERVAL

    //         if (lastTokenRefresh) {
    //             const timeSinceLastRefresh = now - lastTokenRefresh
    //             timeUntilNextRefresh = Math.max(REFRESH_INTERVAL - timeSinceLastRefresh, 0)
    //             // If it's been more than 29 minutes, refresh immediately
    //             if (timeSinceLastRefresh >= REFRESH_INTERVAL) {
    //                 refreshToken()
    //                 timeUntilNextRefresh = REFRESH_INTERVAL
    //             }
    //         } else {
    //             dispatchRedux(setLastTokenRefresh(now))
    //         }
    //         console.log(timeUntilNextRefresh / 1000, 'seconds until next token refresh')
    //         // Schedule the first refresh
    //         const initialTimer = setTimeout(() => {
    //             refreshToken()
    //             // set up recurring refresh if the user doesn't refresh the page
    //             refreshTimerRef.current = setInterval(() => {
    //                 refreshToken()
    //             }, REFRESH_INTERVAL)
    //         }, timeUntilNextRefresh)

    //         return () => {
    //             clearTimeout(initialTimer)
    //             if (refreshTimerRef.current) {
    //                 clearInterval(refreshTimerRef.current)
    //             }
    //         }
    //     }
    // }, [state.isAuthenticated, refreshToken])

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
