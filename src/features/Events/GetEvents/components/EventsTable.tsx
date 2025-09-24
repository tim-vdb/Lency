import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface EventsTableProps {
    events: any[]
}

export default function EventsTable({ events }: EventsTableProps) {

    return (
        <Table className='shadow-md border-2 border-gray-800 rounded-md'>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-56">Nom</TableHead>
                    <TableHead className="min-w-56">Description</TableHead>
                    <TableHead className="min-w-56">Lieu</TableHead>
                    <TableHead className="min-w-56">Date de début</TableHead>
                    <TableHead className="min-w-56">Date de fin</TableHead>
                    <TableHead className="min-w-56">Ouverture d'inscription</TableHead>
                    <TableHead className="min-w-56">Fermeture d'inscription</TableHead>
                    <TableHead className="min-w-56">Nombre de participants</TableHead>
                    <TableHead className="min-w-56">Visible aux visiteurs</TableHead>
                    <TableHead className="min-w-56">Créateur</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map((event: any) => (
                    <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.dateStart.toLocaleString()}</TableCell>
                        <TableCell>{event.dateEnd.toLocaleString()}</TableCell>
                        <TableCell>{event.openAt.toLocaleString()}</TableCell>
                        <TableCell>{event.closeAt.toLocaleString()}</TableCell>
                        <TableCell>{event.maxParticipants}</TableCell>
                        <TableCell>{event.visibleToGuests ? "Oui" : "Non"}</TableCell>
                        <TableCell>{event.creator || "Non défini"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={10}>Total d'évènements {events.length}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
