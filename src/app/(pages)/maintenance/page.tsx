import { Card, CardContent, CardHeader } from "@/front/components/ui/card";
import Image from "next/image";

export default function page() {
    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="flex flex-col text-center">
                <Image src="/ccv_light.svg" alt="Maintenance" width={200} height={200} className="mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-center mt-10 w-full">Site web en maintenance</h1>
            </CardHeader>
            <CardContent>
                <p className="text-center mt-4 text-lg">Nous travaillons actuellement sur le développement du site web. Merci de votre patience !</p>
            </CardContent>
        </Card>
    )
}