import { useSession } from "next-auth/react"

// client olacak hook cunku -- eger server comp icinde olursa diye lib/auth alindada tanimla

export const UseCurrentRole = () => {
    const session = useSession();

    return session.data?.user?.role;
};