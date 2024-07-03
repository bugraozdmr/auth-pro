'use client'
import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { RegisterSchema } from '@/schemas';
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
import { register } from '@/actions/register';

export function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const [error,setError] = useState<string | undefined>('');
    const [success,setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            email : '',
            password : '',
            name:''
        }
    });

    // passing validated values
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            register(values)
            .then((data) => {
                setError(data.error);
                setSuccess(data.success);
            });
        });
    }

  return (
    <CardWrapper
    headerLabel='Create an account'
    backButtonLabel="Already having an account ?"
    backButtonHref='/auth/login'
    showSocial={true}>
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
            >
                <div className='space-y-4'>
                    {/* Name */}
                    <FormField 
                    control={form.control}
                    name='name'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    placeholder='John Doe'
                                    type='text'
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
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
                {/* Form Error -- Success */}
                <FormError message={error} />
                <FormSuccess message={success} />
                
                <Button
                type='submit'
                className='w-full'
                disabled={isPending}>
                    Register
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}
