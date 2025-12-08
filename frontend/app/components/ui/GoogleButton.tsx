"use client"

import { GoogleIcon } from "./GoogleIcon";
import { signIn } from "next-auth/react";

interface GoogleButtonProps {
    text: string;
    googleIcon?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export function GoogleButton({ text, googleIcon, icon, className }: GoogleButtonProps) {

    return (
        <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className={`${className} w-full cursor-pointer flex justify-center items-center gap-2 rounded-full border border-black/10 px-6 py-2 text-lg font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow card-shadow`}
        >
            <>
                {text}
                {
                    googleIcon && <GoogleIcon className="size-4" />
                }
                {icon}
            </>
        </button>
    )
}