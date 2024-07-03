import { db } from "@/lib/db";

export const getVerificationTokenByEmail = async (
    email : string
) => {
    try{
        // 1 tane alir direkt
        const verificationToken = await db.verificationToken.findFirst({
            where : {email}
        });

        return verificationToken;
    }
    catch(error){
        return null;
    }
}

export const getVerificationTokenByToken = async (
    token : string
) => {
    try{
        // 1 tane alir direkt
        const verificationToken = await db.verificationToken.findUnique({
            where : {token}
        });

        return verificationToken;
    }
    catch(error){
        return null;
    }
}