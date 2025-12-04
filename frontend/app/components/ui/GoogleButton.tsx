"use client"

import { GoogleIcon } from "./GoogleIcon";
import { signIn } from "next-auth/react";

interface GoogleButtonProps {
    text: string
}

export function GoogleButton({ text }: GoogleButtonProps) {

    return (
        <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className={`w-full cursor-pointer flex justify-center items-center gap-2 rounded-full bg-white border border-black/10 px-6 py-2 text-lg font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow card-shadow`}
        >
            <>
                {text}
                <GoogleIcon className="size-4" />
            </>
        </button>
    )
}