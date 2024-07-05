'use server';

import * as z from 'zod';
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import bcrypt from 'bcrypt'







export const settings = async (
    values : z.infer<typeof SettingsSchema>
) => {
    // icine name veriyoz yakalaniyor
    const user = await currentUser();

    if(!user){
        return {error : 'Unauthorized'}
    }

    const dbUser = await getUserById(user.id as string);

    if(!dbUser) {
        return {error : 'Unauthorized'}
    }

    // eger OAuth kullanicisi ise degerler undefined olcak yani gitmicek
    if (user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnable = undefined;
    }

    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email);

        if(existingUser && existingUser.id !== user.id){
            return { error : 'Email already in use !'}
        }

        const verificationToken = await generateVerificationToken(
            values.email
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return {success : 'Verification mail sent!'}
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        );

        if(!passwordsMatch){
            return {error : 'Incorrect password!'}
        }

        const hashedPassword = await bcrypt.hash(
            values.newPassword,
            10
        );

        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    // db'de olmayan proplar undefined olacak ve okunmicak
    await db.user.update({
        where : {id : dbUser.id},
        data : {
            // spread
            ...values,
        }
    });

    return {success : 'Settings Updated !'}
}