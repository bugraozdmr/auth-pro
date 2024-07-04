
import { db } from "@/lib/db";

export const getAccountByUserId = async (userId : string) => {
    try {
        const account = await db.account.findFirst({
            where : {userId : userId}
        });

        return account;
        
    } catch (error) {
        return null;
    }
}