'use client'
import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { ResetSchema } from '@/schemas';
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
import { login } from '@/actions/login';
import Link from 'next/link';
import { reset } from '@/actions/reset';

export function ResetForm() {
    
    const [isPending, startTransition] = useTransition();
    const [error,setError] = useState<string | undefined>('');
    const [success,setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues:{
            email : '',
        }
    });

    // passing validated values
    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            reset(values)
            .then((data:any) => {
                // TODO: Add when we add 2FA
                setError(data && data.error);
                setSuccess(data && data.success);
            });
        });

        console.log(values)
    }

  return (
    <CardWrapper
    headerLabel='Forgot your password ?'
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
                </div>
                {/* Form Error -- Success -- ikisinden biri duser errora */}
                <FormError message={error} />
                <FormSuccess message={success} />
                
                <Button
                type='submit'
                className='w-full'
                disabled={isPending}>
                    Send reset email
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}
