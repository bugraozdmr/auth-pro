import { getVerificationTokenByEmail } from '@/data/verification-token';
import {v4 as uuidv4} from 'uuid'
import { db } from './db';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import crypto from 'crypto'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

export const generateTwoFactorToken = async (email: string) => {
    // 100k ile 1m arasi
    const token = crypto.randomInt(100_000,1_000_000).toString();
    // TODO : CHANGE THAT WITH 15 MINS LATER
    const expires = new Date(new Date().getTime() + 5*60*1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await db.twoFactorToken.delete({
            where: {id : existingToken.id}
        });
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return twoFactorToken;
}

export const generatePasswordResetToken = async (email : string) => {
    const token = uuidv4();
    // 1 saat verdi 3600 sn
    const expires = new Date(new Date().getTime() + 3600*1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    // tum hepsini siler oncekileri
    if(existingToken){
        await db.passwordResetToken.delete({
            where: {id : existingToken.id}
        });
    };

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return passwordResetToken;
}

export const generateVerificationToken = async (email:string) => {
    const token = uuidv4();

    // 1 saat verdi 3600 sn
    const expires = new Date(new Date().getTime() + 3600*1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
        await db.verificationToken.delete({
            where : {
                id:existingToken.id,
            }
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return verificationToken;
}