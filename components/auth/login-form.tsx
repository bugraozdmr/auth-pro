'use client'
import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { LoginSchema } from '@/schemas';
import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

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
import { login } from '@/actions/login';

export function LoginForm() {
    const searchParams = useSearchParams();
    const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with different provider!' : '';

    const [isPending, startTransition] = useTransition();
    const [error,setError] = useState<string | undefined>('');
    const [success,setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues:{
            email : '',
            password : ''
        }
    });

    // passing validated values
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            login(values)
            .then((data:any) => {
                // TODO: Add when we add 2FA
                setError(data && data.error);
                setSuccess(data && data.success);
            });
        });
    }

  return (
    <CardWrapper
    headerLabel='Welcome back'
    backButtonLabel="Don't have an account"
    backButtonHref='/auth/register'
    showSocial={true}>
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
            >
                <div className='space-y-4'>
                    {/* Email */}
                    <FormField 
                    control={form.control}
                    name='email'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    placeholder='john.doe@example.com'
                                    type='email'
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    {/* Password */}
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
                <FormError message={error || urlError} />
                <FormSuccess message={success} />
                
                <Button
                type='submit'
                className='w-full'
                disabled={isPending}>
                    Login
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}
