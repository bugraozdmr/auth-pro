'use server';

import * as z from 'zod';
import { SettingsSchema } from "@/schemas";
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

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

    await db.user.update({
        where : {id : dbUser.id},
        data : {
            // spread
            ...values,
        }
    });

    return {success : 'Settings Updated !'}
}