'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GalleryDeleteAction } from '../server/gallery.action'

export default function ButtonDeleteImage({ id }: { id: number }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
            try {
                const formData = new FormData();
                formData.append('id', id.toString());

                await GalleryDeleteAction(formData);
                router.refresh();
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="flex items-center justify-center gap-1"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    )
}
