'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import {signIn} from '@/auth'
import {DEFAULT_LOGIN_REDIRECT} from '@/routes'
import {AuthError} from 'next-auth'
import { error } from 'console';

export const login = async (values : z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:'Invalid fields !'}
    }

    const {email , password} = validatedFields.data;

    try{
        await signIn('credentials',{
            email,
            password,
            redirectUrl: DEFAULT_LOGIN_REDIRECT
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