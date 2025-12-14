import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import { DeleteEventAction } from '../events.action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EventWithCreator } from '../event.types';

interface EventsTableProps {
  events: EventWithCreator[];
}

export default function EventsTable({ events }: EventsTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${name}" ?`)) {
      try {
        const result = await DeleteEventAction(id);
        if (result.success) {
          toast.success('Événement supprimé avec succès !');
          router.refresh();
        } else {
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (event: EventWithCreator) => {
    // Navigate to edit page with event data
    router.push(`/admin/events/edit/${event.id}`);
  };

  return (
    <Table className="shadow-md border-2 border-gray-800 rounded-md">
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
          <TableHead className="min-w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event: EventWithCreator) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.name}</TableCell>
            <TableCell>{event.description}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>{event.dateStart.toLocaleString()}</TableCell>
            <TableCell>{event.dateEnd.toLocaleString()}</TableCell>
            <TableCell>{event.openAt.toLocaleString()}</TableCell>
            <TableCell>{event.closeAt.toLocaleString()}</TableCell>
            <TableCell>{event.maxParticipants}</TableCell>
            <TableCell>{event.visibleToGuests ? 'Oui' : 'Non'}</TableCell>
            <TableCell>{event.creator?.name || 'Non défini'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(event)}
                  className="p-2"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event.id, event.name)}
                  className="p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={11}>Total d'évènements {events.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
