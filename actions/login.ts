'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import {signIn} from '@/auth'
import {DEFAULT_LOGIN_REDIRECT} from '@/routes'
import {AuthError} from 'next-auth'
import { generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';

export const login = async (values : z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:'Invalid fields !'}
    }

    const {email , password} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    // QUESTION -- GOOGLE auth accounts has email but has no password ?
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error:'Invalid email or password !'};
    }

    if(!existingUser.emailVerified){
        // hata alir yoksa as string
        const verificationToken = await generateVerificationToken(
            existingUser.email as string
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return { success : 'Confirmation email sent !'}
    }


    try{
        await signIn('credentials',{
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    }catch(error){
        if(error instanceof AuthError){
            console.log(error.type)
            switch(error.type){
                case 'CredentialsSignin':
                    return {error: 'Invalid credentials !'}
                case 'CallbackRouteError':
                    return {error: 'Check again !'}
                default:
                    return {error: 'Something went wrong !'}
            }
        }

        throw error;
    }
};