// roottaki auth dosyasi bu
import {auth,signOut} from "@/auth"
import React from 'react';

const SettingsPage = async () => {
    const session = await auth();

    return (
        <div>
            {JSON.stringify(session)}
            <form action={async () => {
                'use server';

                // ekstra param gerekti
                await signOut({
                    redirectTo:'/auth/login'
                });
            }}>
                <button type="submit">
                    Sign out
                </button>
            </form>
        </div>
    )
}

export default SettingsPage;