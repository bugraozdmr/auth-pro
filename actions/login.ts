'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import {signIn} from '@/auth'
import {DEFAULT_LOGIN_REDIRECT} from '@/routes'
import {AuthError} from 'next-auth'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail } from '@/data/user';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import bcrypt from 'bcrypt'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { db } from '@/lib/db';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';




export const login = async (
    values : z.infer<typeof LoginSchema>,
    callbackUrl? : string | null
) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:'Invalid fields !'}
    }

    const {email , password, code} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    // QUESTION -- GOOGLE auth accounts has email but has no password ?
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error:'Invalid email or password !'};
    }

    // IMPORTANT -- IF NOT PASSWORDS MATCH DONT SEND CONFIRMATION EMAIL -- THIS ONE WAS FORGOTTEN
    const passwordsMatch = await bcrypt.compare(
        password,
        existingUser.password
    );

    if(!passwordsMatch){
        return {error:'Invalid email or password !'};
    }

    if(!existingUser.emailVerified && passwordsMatch){
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

    // 2FA CHECK
    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            // TODO : Verify code
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );

            if(!twoFactorToken){
                return {error: 'Invalid code' };
            }

            if(twoFactorToken.token !== code){
                return { error : 'Invalid code' };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired){
                return { error : 'Code has expired' };
            }

            // delete that token
            await db.twoFactorToken.delete({
                where : {
                    id : twoFactorToken.id
                }
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where : {id : existingConfirmation.id}
                });
            }

            await db.twoFactorConfirmation.create({
                data : {
                    userId : existingUser.id,
                }
            });

            
        }
        else{
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            );
    
            return { twoFactor : true };
        }
    }


    try{
        await signIn('credentials',{
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
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