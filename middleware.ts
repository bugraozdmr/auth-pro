import authConfig from "./auth.config";
import NextAuth from 'next-auth';
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from './routes'

const {auth} = NextAuth(authConfig);

// BU AMK NULL DONMICEK
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
        return ;
    }

    if(isAuthRoute){
        // eger sonrasinda degismek istersen direkt dosyayi degisirsin -- ikisi birlesince link olusur
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return ;
    }

    if(!isLoggedIn && !isPublicRoute){
        let callbackUrl = nextUrl.pathname;
        if(nextUrl.search){
            callbackUrl += nextUrl.search;
        }

        const encodedCallBackUrl = encodeURIComponent(callbackUrl);



        return Response.redirect(new URL(
            `/auth/login?callbackUrl=${encodedCallBackUrl}`,
            nextUrl));
    }

    // ancak bu sekilde olur sira onemli
    return ;
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}