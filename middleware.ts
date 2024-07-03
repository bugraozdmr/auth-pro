import authConfig from "./auth.config";
import NextAuth from 'next-auth';
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from './routes'

const {auth} = NextAuth(authConfig);

// middleware next icin gerek
// uyandirilmasi icin config verildi belirli yerde gelir
export default auth((req) => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // api routelarına izin verir direkt
    if(isApiAuthRoute){
        return null;
    }

    if(isAuthRoute){
        // eger sonrasinda degismek istersen direkt dosyayi degisirsin -- ikisi birlesince link olusur
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return null;
    }

    if(!isLoggedIn && !isPublicRoute){
        return Response.redirect(new URL('/auth/login',nextUrl));
    }

    // ancak bu sekilde olur sira onemli
    return null;
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}