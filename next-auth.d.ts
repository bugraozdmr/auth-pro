import NextAuth,{type DefaultSession} from 'next-auth'

// Session tipi tanimlaniyor

export type ExtendedUser = DefaultSession['user'] & {
    role : UserRole;
    isTwoFactorEnabled : boolean;
    isOAuth : boolean;
};

declare module 'next-auth'{
    interface Session{
        user: ExtendedUser
    }
}