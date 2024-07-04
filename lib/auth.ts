// burdan geldi cunku session.data? -- hookda

import { auth } from "@/auth";

export const currentUser = async () => {
    const session = await auth();

    return session?.user;
}

export const CurrentRole = async () => {
    const session = await auth();

    // burda session altinda data olmaz
    return session?.user?.role;
};