import * as z from 'zod';

// loginde min sınırı atma -- onceden kaydolmus 6 haneden az olanlar olabilir
export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required',
    }),
    password: z.string().min(1,{
        message: 'Password is required',
    })
});

