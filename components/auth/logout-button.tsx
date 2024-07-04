'use client';

import { logout } from "@/actions/signout";

interface LogoutButtonProps{
    children : React.ReactNode
}

export const LogoutButton = ({
    children
} : LogoutButtonProps) => {
    const onClickHandler = () => {
        logout();
    }

    return (
        <span onClick={onClickHandler} className="cursor-pointer">
            {children}
        </span>
    );
}