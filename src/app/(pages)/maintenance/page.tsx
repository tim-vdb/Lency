import { Card, CardContent, CardHeader } from "@/front/components/ui/card";

export default function page() {
    return (
        <Card className="h-screen border-none justify-center shadow-none max-w-lg mx-auto">
            <CardHeader className="flex flex-col text-center">
                <h1 className="text-4xl font-bold text-center mt-10 w-full">Site web en maintenance</h1>
            </CardHeader>
            <CardContent>
                <p className="text-center mt-4 text-lg">Nous travaillons actuellement sur le développement du site web. Merci de votre patience !</p>
            </CardContent>
        </Card>
    )
}