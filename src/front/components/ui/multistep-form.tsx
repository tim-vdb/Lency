"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { createStore, useStore } from "zustand";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/front/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultistepStepDef {
    id: string;
    title: string;
}

// ─── Zustand store ────────────────────────────────────────────────────────────

interface MultistepState {
    currentStep: number;
    direction: number;
    totalSteps: number;
    steps: MultistepStepDef[];
    formRef: React.RefObject<HTMLFormElement | null>;
    goNext: () => void;
    goPrev: () => void;
    setStep: (i: number) => void;
}

function createMultistepStore(
    steps: MultistepStepDef[],
    formRef: React.RefObject<HTMLFormElement | null>,
) {
    return createStore<MultistepState>((set) => ({
        currentStep: 0,
        direction: 1,
        totalSteps: steps.length,
        steps,
        formRef,
        goNext: () =>
            set((s) => ({
                currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1),
                direction: 1,
            })),
        goPrev: () =>
            set((s) => ({
                currentStep: Math.max(s.currentStep - 1, 0),
                direction: -1,
            })),
        setStep: (i) =>
            set((s) => ({
                currentStep: i,
                direction: i > s.currentStep ? 1 : -1,
            })),
    }));
}

type MultistepStore = ReturnType<typeof createMultistepStore>;

// Context ne stocke que la référence au store (pas les valeurs) → pas de re-render context
const MultistepStoreCtx = createContext<MultistepStore | null>(null);

function useMultistep<T>(selector: (s: MultistepState) => T): T {
    const store = useContext(MultistepStoreCtx);
    if (!store) throw new Error("useMultistep must be used within MultistepForm");
    return useStore(store, selector);
}

// ─── MultistepForm ────────────────────────────────────────────────────────────

interface MultistepFormProps {
    steps: MultistepStepDef[];
    displaySteps?: MultistepStepDef[];
    onFormSubmit: (e: React.FormEvent) => void;
    navigation: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function MultistepForm({ steps, displaySteps, onFormSubmit, navigation, children, className }: MultistepFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    // Store créé une seule fois par instance de MultistepForm
    const [store] = useState(() => createMultistepStore(steps, formRef));

    const currentStep = useStore(store, (s) => s.currentStep);
    const setStep = useStore(store, (s) => s.setStep);

    const shownSteps = displaySteps ?? steps;
    const progressPercent = (currentStep / Math.max(shownSteps.length - 1, 1)) * 100;
    const stepChildren = React.Children.toArray(children);

    return (
        <MultistepStoreCtx.Provider value={store}>
            <form ref={formRef} onSubmit={onFormSubmit} className={cn("flex-1 flex flex-col overflow-hidden px-6 py-5", className)}>

                {/* ── Barre de progression ── */}
                <div className="mb-5 shrink-0 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex justify-between mb-2">
                        {shownSteps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={() => { if (i <= currentStep) setStep(i); }}
                                    className={cn(
                                        "w-4 h-4 rounded-full transition-all duration-300",
                                        i < currentStep
                                            ? "bg-primary"
                                            : i === currentStep
                                            ? "bg-primary ring-4 ring-primary/20"
                                            : "bg-muted",
                                        i <= currentStep ? "cursor-pointer hover:scale-110" : "cursor-default",
                                    )}
                                />
                                <span className={cn(
                                    "text-xs mt-1.5 hidden sm:block transition-colors duration-200",
                                    i === currentStep ? "text-primary font-medium" : "text-muted-foreground",
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* ── Card ── */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="border shadow-md rounded-3xl overflow-hidden flex flex-col flex-1 min-h-0">
                        <StepSlot stepChildren={stepChildren} />
                        {navigation}
                    </Card>
                </div>

                {/* ── Indicateur en bas ── */}
                <p className="mt-3 text-center text-xs text-muted-foreground shrink-0 animate-in fade-in duration-500">
                    Étape {currentStep + 1} sur {shownSteps.length} — {shownSteps[currentStep]?.title ?? steps[currentStep].title}
                </p>
            </form>
        </MultistepStoreCtx.Provider>
    );
}

// ─── StepSlot ─────────────────────────────────────────────────────────────────

function StepSlot({ stepChildren }: { stepChildren: React.ReactNode[] }) {
    const currentStep = useMultistep((s) => s.currentStep);
    const direction = useMultistep((s) => s.direction);

    const [displayed, setDisplayed] = useState(currentStep);
    const [animClass, setAnimClass] = useState("");
    const prevRef = useRef(currentStep);

    React.useEffect(() => {
        if (prevRef.current === currentStep) return;
        const from = direction > 0 ? "animate-in slide-in-from-right-8" : "animate-in slide-in-from-left-8";
        setAnimClass(from + " fade-in duration-300");
        setDisplayed(currentStep);
        prevRef.current = currentStep;
    }, [currentStep, direction]);

    return (
        <div key={displayed} className={cn("flex flex-col flex-1 min-h-0 overflow-hidden", animClass)}>
            {stepChildren[displayed]}
        </div>
    );
}

// ─── MultistepStep ────────────────────────────────────────────────────────────

interface MultistepStepProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function MultistepStep({ title, description, children }: MultistepStepProps) {
    return (
        <>
            <CardHeader className="shrink-0">
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 pb-2">
                {children}
            </CardContent>
        </>
    );
}

// ─── MultistepNavigation ──────────────────────────────────────────────────────

interface MultistepNavigationProps {
    onNext?: (step: number) => Promise<boolean>;
    isPending?: boolean;
    submitLabel?: string;
    disabled?: boolean;
    isLastOverride?: boolean;
}

export function MultistepNavigation({ onNext, isPending, submitLabel = "Valider", disabled, isLastOverride }: MultistepNavigationProps) {
    const currentStep = useMultistep((s) => s.currentStep);
    const totalSteps  = useMultistep((s) => s.totalSteps);
    const formRef     = useMultistep((s) => s.formRef);
    const goNext      = useMultistep((s) => s.goNext);
    const goPrev      = useMultistep((s) => s.goPrev);

    const isFirst = currentStep === 0;
    const isLast  = isLastOverride || (currentStep === totalSteps - 1);

    async function handleNext() {
        if (onNext) {
            const valid = await onNext(currentStep);
            if (!valid) return;
        }
        goNext();
    }

    function handleSubmit() {
        formRef.current?.requestSubmit();
    }

    return (
        <CardFooter className="flex justify-between pt-4 pb-4 shrink-0">
            <Button
                type="button"
                variant="outline"
                onClick={goPrev}
                disabled={isFirst || isPending}
                className="flex items-center gap-1 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
                <ChevronLeft className="h-4 w-4" />
                Précédent
            </Button>

            {/* Bouton unique type="button" — évite le submit accidentel au re-render */}
            <Button
                type="button"
                onClick={isLast ? handleSubmit : handleNext}
                disabled={isPending || (isLast && disabled)}
                className="flex items-center gap-1 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
                {isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        En cours…
                    </>
                ) : isLast ? (
                    <>
                        {submitLabel}
                        <Check className="h-4 w-4" />
                    </>
                ) : (
                    <>
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                    </>
                )}
            </Button>
        </CardFooter>
    );
}
