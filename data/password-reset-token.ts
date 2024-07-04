import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token : string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where : {token}
        });

        return passwordResetToken;
    } catch (error) {
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email : string) => {
    try {
        // burda ayni mailing birden cok resettoken'ı olabilir ondan first bu da en son atilani alir
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where : {email}
        });

        return passwordResetToken;
    } catch (error) {
        return null;
    }
}