"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/front/components/ui/input";
import { cn } from "@/front/lib/utils";

const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
    ({ className, ...props }, ref) => {
        const [show, setShow] = useState(false);

        return (
            <div className="relative">
                <Input
                    {...props}
                    ref={ref}
                    type={show ? "text" : "password"}
                    className={cn("pr-10", className)}
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    tabIndex={-1}
                    aria-label={show ? "Masquer le mot de passe" : "Voir le mot de passe"}
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        );
    }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
