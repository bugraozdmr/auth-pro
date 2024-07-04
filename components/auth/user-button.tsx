'use client';

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

import { ExitIcon } from '@radix-ui/react-icons';

import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/use-current-user';
import { LogoutButton } from './logout-button';

export const UserButton = () => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ''}  />
                    <AvatarFallback className='bg-orange-600'  >
                        <FaUser className='text-white' />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-40' align='end'>
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className='h-4 w-4 mr-2' />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

