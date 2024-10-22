import { newPassword } from '@/actions/new-password';
import { UserRole } from '@prisma/client';
import * as z from 'zod';


// REFINE ILE EKSTRA ESLESME TANIMLAMA
export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled : z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN,UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6))
}).refine((data) => {
    if(data.newPassword && !data.password){
        return false;
    }

    return true;
},{
    // password altina cikacak bu mesaj
    message: 'Password required',
    path: ['password']
}).refine((data) => {
    if(data.password && !data.newPassword){
        return false;
    }

    return true;
},{
    // password altina cikacak bu mesaj
    message: 'New password required',
    path: ['newPassword']
})

/****************** */

export const NewPasswordSchema = z.object({
    password: z.string().min(6,{
        message: "Min of 6 characters required",
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

// loginde min sınırı atma -- onceden kaydolmus 6 haneden az olanlar olabilir
export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required',
    }),
    password: z.string().min(1,{
        message: 'Password is required',
    }),
    code : z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Email is required',
    }),
    password: z.string().min(6,{
        message: 'Minimum 6 characters required',
    }),
    name: z.string().min(1,{
        message: 'Name is required',
    }), 
});
