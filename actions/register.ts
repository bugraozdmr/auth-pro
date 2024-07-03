'use server';
import * as z from 'zod';
import { RegisterSchema } from '@/schemas';
import bcrypt from 'bcrypt'
import { db } from '@/lib/db';
import {getUserByEmail} from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values : z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:'Invalid fields !'}
    }

    const {email,password,name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password,10);

    // email ile ara
    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return {error:'Email already in use!'};
    }

    await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
        }
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    )

    // TODO : Send verification token email

    return {success:'Confirmation email sent !'}
};