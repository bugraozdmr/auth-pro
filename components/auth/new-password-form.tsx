'use client'
import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { NewPasswordSchema } from '@/schemas';
import { useTransition } from 'react';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { reset } from '@/actions/reset';
import { useSearchParams } from 'next/navigation';
import { newPassword } from '@/actions/new-password';

export function NewPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');


    const [isPending, startTransition] = useTransition();
    const [error,setError] = useState<string | undefined>('');
    const [success,setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues:{
            password : '',
        }
    });

    // passing validated values
    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            newPassword(values,token)
            .then((data:any) => {   // wrong thou :any
                // TODO: Add when we add 2FA
                setError(data && data.error);
                setSuccess(data && data.success);
            });
        });

        console.log(values)
    }

  return (
    <CardWrapper
    headerLabel='Enter a new password'
    backButtonLabel="Back to login"
    backButtonHref='/auth/login'
    showSocial={false}>
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
            >
                <div className='space-y-4'>
                    {/* Email */}
                    <FormField 
                    control={form.control}
                    name='password'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    placeholder='******'
                                    type='password'
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                {/* Form Error -- Success -- ikisinden biri duser errora */}
                <FormError message={error} />
                <FormSuccess message={success} />
                
                <Button
                type='submit'
                className='w-full'
                disabled={isPending}>
                    Reset password
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}
