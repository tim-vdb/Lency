import { useMutation } from "@tanstack/react-query";
import { createFeedback, CreateFeedbackInput } from "@/front/lib/api/feedback";

export const useCreateFeedback = () =>
    useMutation({
        mutationFn: (data: CreateFeedbackInput) => createFeedback(data),
    });
