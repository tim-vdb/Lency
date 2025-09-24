"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import { signUp } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpForm() {
    const router = useRouter()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="dark:bg-gray-900 py-12 min-h-screen flex items-center">
            <div className="max-w-md w-full mx-auto px-6 sm:px-8 lg:px-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        S'inscrire à Mölkky !
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                        Remplissez les informations pour créer votre compte.
                    </p>
                </div>

                <div className="space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">Prénom</Label>
                            <Input 
                                id="first-name" 
                                placeholder="Max" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Nom</Label>
                            <Input 
                                id="last-name" 
                                placeholder="Robinson" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="m@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="Mot de passe" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                        <Input 
                            id="password_confirmation" 
                            type="password" 
                            placeholder="Confirmer le mot de passe" 
                            value={passwordConfirmation} 
                            onChange={(e) => setPasswordConfirmation(e.target.value)} 
                            className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Photo de profil (optionnelle)</Label>
                        <div className="flex items-end gap-4">
                            {imagePreview && (
                                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                    <img src={imagePreview} alt="Prévisualisation" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 w-full">
                                <Input 
                                    id="image" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    className="w-full"
                                />
                                {imagePreview && <X className="cursor-pointer" onClick={() => { setImage(null); setImagePreview(null) }} />}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-2 rounded-xl hover:bg-orange-500 transition-colors"
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true)
                            try {
                                await signUp.email({
                                    email,
                                    password,
                                    name: `${firstName} ${lastName}`,
                                    image: image ? await convertImageToBase64(image) : "",
                                    callbackURL: "/dashboard",
                                })
                                toast.success("Utilisateur inscrit avec succès")
                                router.push("/dashboard")
                            } catch (error: any) {
                                toast.error(error?.message || "Une erreur est survenue")
                            } finally {
                                setLoading(false)
                            }
                        }}
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : "S'inscrire"}
                    </Button>
                </div>

                <div className="flex justify-center w-full mt-6">
                    <p className="text-xs text-neutral-500">
                        <Link href="/login" className="underline dark:text-orange-200/90">
                            Have already an account?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}
