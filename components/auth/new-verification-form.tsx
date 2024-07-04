'use client'

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import {BeatLoader} from 'react-spinners';
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

export const NewVerificationForm = () => {
    const [error,setError] = useState<string | undefined>();
    const [success,setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // token değiştiğinde onSubmit yeniden oluşturulacak ve dolayısıyla useEffect yeniden çalıştırılacaktır.
    const onSubmit = useCallback(() => {
        // if we already have success or error then dont fire useEffect again
        // it will work anyway in dev so in production nothing will happen -- iki kere calisiyor
        if(success || error) return;

        if(!token) {
            setError('Missing token !');
            return;
        }

        // Better
        newVerification(token)
        .then((data) => {
            setSuccess(data.success);
            setError(data.error);
        })
        .catch(() => {
            setError('Something went wrong !');
        });
    },[token,success,error]);

    useEffect(() => {
        onSubmit();
    },[onSubmit]);

    return (
      <CardWrapper
        headerLabel="Confirming your verification"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        showSocial={false}
      >
        <div className="flex items-center w-full justify-center">
          {!success && !error && (
            <BeatLoader />
          )}
          <FormSuccess message={success} />
          {!success && (
            <FormError message={error} />
          )}
        </div>
      </CardWrapper>
    );
}