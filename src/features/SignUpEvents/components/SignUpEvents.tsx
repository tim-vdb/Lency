"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useRouter } from "next/navigation";
import { EventsFormSchema } from "@/features/SignUpEvents/events.schema";

export default function SignUpForm() {
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof EventsFormSchema>>({
        resolver: zodResolver(EventsFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    })}