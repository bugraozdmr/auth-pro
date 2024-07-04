import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './lib/db'
import { getUserById } from './data/user'
import { UserRole } from '@prisma/client'
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation'
import { getAccountByUserId } from './data/account'


export const {
    handlers: {GET,POST},
    auth,
    signIn,
    signOut
} = NextAuth({
    pages:{
        signIn: '/auth/login',
        error: '/auth/error'
    },
    events:{
        async linkAccount({user}){
            await db.user.update({
                where: {id : user.id},
                data : {emailVerified : new Date()}
            })
        }
    },
    callbacks: {
        async signIn({user, account}){
            // Allow OAuth without email verification
            if(account?.provider !== 'credentials') return true;

            // ne gelir biliyorsak yaz gec - ts sıkıntılı abi
            const existingUser = await getUserById(user.id as string);

            // Prevent sign in without email verification
            if(!existingUser || !existingUser.emailVerified) return false;

            
            if(existingUser.isTwoFactorEnabled){
                // login icinde daha guzelce ele alindi
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if(!twoFactorConfirmation) return false;

                // All the login attemps will direct it to the 2FA -- cause it deletes the token after
                await db.twoFactorConfirmation.delete({
                    where: {id : twoFactorConfirmation.id}
                });
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

            if(session.user){
                // hata cozuldu -- next-auth.d.ts
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }

            if(session.user){
                // session updated - - - After token update dont forget updating session also
                session.user.name = token.name;
                session.user.email = token.email as string;
                session.user.isOAuth = token.isOAuth as boolean;
            }

            return session;
        },
        async jwt ({token}){
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;

            const existingAccount = await getAccountByUserId(
                existingUser.id
            );

            // boolean aliyoruz artik
            token.isOAth = !!existingAccount;
            // jwt always being called we manually update in settingsPage - - - this values fetching from database dynamicle so easy to attach
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

            return token;
        }
    },
    adapter:PrismaAdapter(db),
    session:{strategy:'jwt'},
    ...authConfig
})