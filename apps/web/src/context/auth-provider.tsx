import {
    createContext,
    useEffect,
    useReducer,
    useCallback,
    useMemo,
    useContext,
} from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Role } from '@/@types'
// types
import type { Profile } from '@/@types/user'
import { toast } from 'sonner'
import { getCookie } from '@/lib/cookies'
import { auth } from '@/lib/queries/auth'
import { AuthValidators } from '@/lib/validators/auth'

export type ActionMapType<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: M[Key] }
}

export type AuthStateType = {
    isAuthenticated: boolean
    isInitialized: boolean
    user: Profile | null
    role: Role | null
}

export type JWTContextType = {
    isAuthenticated: boolean
    isInitialized: boolean
    user: Profile | null
    role: Role | null
    signIn: (data: AuthValidators.SignIn) => Promise<void>
    signUp: (data: AuthValidators.SignUp) => Promise<void>
    signOut: () => void
    signInWithProvider?: (provider: string) => void
    refreshToken?: () => Promise<void>
    getCurrentRole: (businessId: string) => void
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
    }
    [Types.BUSINESS]: {
        role: Role | null
    }
    [Types.LOGIN]: {
        user: Profile
    }
    [Types.REGISTER]: {
        user: null
    }
    [Types.LOGOUT]: undefined
}

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>]

const initialState: AuthStateType = {
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
        }
    }
    if (action.type === Types.BUSINESS) {
        return {
            ...state,
            isAuthenticated: true,
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
    if (action.type === Types.REGISTER) {
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
    const { data } = useQuery(auth().profile.queryOptions())

    // const isRefreshing = useRef<boolean>(false)
    // const refreshTimerRef = useRef<number | null>(null)
    // const { lastTokenRefresh } = useSelector(state => state.app)

    useEffect(() => {
        if (data) {
            let role = getCookie('X-Business-Id')
                ? (data.data.businesses.find((b) => b.id === getCookie('X-Business-Id'))
                    ?.role ?? null)
                : null
            dispatch({
                type: Types.INITIAL,
                payload: {
                    user: data.data,
                    isAuthenticated: true,
                    role,
                },
            })
        }
    }, [state.isAuthenticated, data])

    const getCurrentRole = useCallback(
        async (businessId: string) => {
            let role =
                state.user?.businesses.find((b) => b.id === businessId)?.role ?? null
            dispatch({
                type: Types.BUSINESS,
                payload: { role },
            })
        },
        [navigate]
    )

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
                    dispatch({
                        type: Types.REGISTER,
                        payload: { user: null },
                    })
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

    // const signInWithProvider = useCallback((provider: string) => {
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

    const memoizedValue = useMemo(
        () => ({
            isInitialized: state.isInitialized,
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            role: state.role,
            signIn,
            signUp,
            signOut,
            getCurrentRole,
        }),
        [state, signIn, signOut, signUp, getCurrentRole]
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
