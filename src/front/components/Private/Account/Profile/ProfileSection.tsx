"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar"
import { Button } from "@/front/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card"
import { Input } from "@/front/components/ui/input"
import { Badge } from "@/front/components/ui/badge"
import { Field, FieldGroup, FieldLabel } from "@/front/components/ui/field"
import { Separator } from "@/front/components/ui/separator"
import { Camera, AlertTriangle } from "lucide-react"

export function ProfileSection() {
    return (
        <div className="flex flex-col gap-6">
            {/* Profile Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Informations du profil</CardTitle>
                    <CardDescription>
                        Mettez à jour vos informations personnelles et votre photo de profil.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-4">
                            <Avatar className="size-20">
                                <AvatarImage src="" alt="Photo de profil" />
                                <AvatarFallback className="text-lg bg-primary/10 text-primary">TV</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm">
                                    <Camera className="size-4" />
                                    Changer la photo
                                </Button>
                                <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Max 2MB.</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Form Fields */}
                        <FieldGroup>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
                                    <Input id="firstName" placeholder="Non spécifié" defaultValue="" />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="lastName">Nom</FieldLabel>
                                    <Input id="lastName" placeholder="Non spécifié" defaultValue="" />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="username">Nom d&apos;utilisateur</FieldLabel>
                                <Input id="username" placeholder="@username" defaultValue="N/A" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" type="email" defaultValue="timotheevdbosch@gmail.com" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                                <Input id="phone" type="tel" placeholder="Non spécifié" defaultValue="" />
                            </Field>
                        </FieldGroup>

                        {/* Account Info */}
                        <Separator />

                        <div className="grid gap-4 sm:grid-cols-2 text-sm">
                            <div>
                                <p className="text-muted-foreground">Rôle</p>
                                <p className="font-medium">MEMBER</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Statut</p>
                                <Badge variant="secondary">Membre</Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Inscription</p>
                                <p className="font-medium">03/03/2026</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Dernière modification</p>
                                <p className="font-medium">07/03/2026</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button>Enregistrer les modifications</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
