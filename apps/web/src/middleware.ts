import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ApiResponse, Role } from './@types'
import { httpClient } from './lib/repository/httpClient'
import { HttpError } from './lib/repository/httpError'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('X-Access-Token')?.value
    const businessId = request.cookies.get('X-Business-Id')?.value
    const signInUrl = new URL('/sign-in', request.url)
    const businessesUrl = new URL('/businesses', request.url)
    let currentRole: Role | null = null
    if (!token) {
        if (pathname === '/sign-in') return NextResponse.next()
        return NextResponse.redirect(signInUrl)
    }

    if (token) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/role`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Business-Id': businessId!
                },
                // cache: "no-cache"
            })
            const data = await response.json() as ApiResponse<Role>
            currentRole = data.data
            return NextResponse.next()
        } catch (error) {
            console.log(error)
            if (error instanceof HttpError) {
                if (pathname === '/businesses') return NextResponse.next()
                return NextResponse.redirect(businessesUrl)
            }
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/settings/:path*',
        '/apps',
        '/dashboard',
        '/templates',
        '/attendances',
        '/campaigns',
        '/businesses',
        // '/users',
        // '/tasks',
        // '/leaves',
        // '/payrolls',
        // '/payslips/:path*',
        // '/roles',
        // '/permissions',
        // '/notifications',
    ],
}