import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import FormEditEvents from "@/features/Events/CreateEvents/components/FormEditEvents";
import { notFound, unauthorized } from "next/navigation";


interface EditEventPageProps {
    params: {
        id: string;
    };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const user = await getUser();

    if (user?.role !== "ADMIN") {
        return unauthorized();
    }

    const eventId = parseInt(params.id);

    if (isNaN(eventId)) {
        notFound();
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId.toString() },
    });

    if (!event) {
        notFound();
    }

    return (
        <section className="mx-10 my-5 p-8 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Modifier l'événement</h2>
            <FormEditEvents event={event} />
        </section>
    );
}
