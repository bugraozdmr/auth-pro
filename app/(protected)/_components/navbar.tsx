'use client';

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

// sadece burda kullanilacagindan dolayi burada tanimlandi


export const Navbar = () => {
    const pathName = usePathname();

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
            <div className="flex gap-x-2">
                {/* Server Button */}
                <Button 
                asChild
                variant={pathName === '/server' ? 'default' : 'outline'}
                >
                    <Link href='/server'>
                        Server
                    </Link>
                </Button>
                {/* Client Button */}
                <Button 
                asChild
                variant={pathName === '/client' ? 'default' : 'outline'}
                >
                    <Link href='/client'>
                        Client
                    </Link>
                </Button>
                {/* Admin Button */}
                <Button 
                asChild
                variant={pathName === '/admin' ? 'default' : 'outline'}
                >
                    <Link href='/admin'>
                        Admin
                    </Link>
                </Button>
                {/* Settings Button */}
                <Button 
                asChild
                variant={pathName === '/settings' ? 'default' : 'outline'}
                >
                    <Link href='/settings'>
                        Settings
                    </Link>
                </Button>
            </div>
            <UserButton />
        </nav>
    );
}