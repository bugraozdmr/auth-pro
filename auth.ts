import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './lib/db'
import { getUserById } from './data/user'
import { UserRole } from '@prisma/client'


export const {
    handlers: {GET,POST},
    auth,
    signIn,
    signOut
} = NextAuth({
    callbacks: {
        async signIn({user}){
            // ne gelir biliyorsak yaz gec - ts sıkıntılı abi
            const existingUser = await getUserById(user.id as string);


            // mail onay gerek
            if(!existingUser || !existingUser.emailVerified){
                // TODO CHANGE FALSE
                return true;
            }

            return true;
        },
        async session({token,session}){
            
            if(token.sub && session.user){
                session.user.id = token.sub;
            }

            if(token.role && session.user){
                // hata cozuldu -- next-auth.d.ts
                session.user.role = token.role as UserRole;
            }

            return session;
        },
        async jwt ({token}){
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;

            token.role = existingUser.role;

            return token;
        }
    },
    adapter:PrismaAdapter(db),
    session:{strategy:'jwt'},
    ...authConfig
})