"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import FormCreateEvents from '@/features/Events/CreateEvents/components/FormCreateEvents'
import EventsTable from '@/features/Events/GetEvents/components/EventsTable'
import { EventWithCreator } from '../GetEvents/event.types'

interface EventsToggleActionProps {
    events: EventWithCreator[]
}

export default function EventsToggleAction({ events }: EventsToggleActionProps) {
    const [showForm, setShowForm] = useState(false)

    return (
        <div className='w-full pt-20 flex-1'>
            <h1 className='text-2xl font-bold'>Liste des événements</h1>

            {showForm ? (
                <div>
                    <Button
                        variant='outline'
                        onClick={() => setShowForm(false)}
                        className="mb-4"
                    >
                        ← Retour à la liste
                    </Button>
                    <FormCreateEvents />
                </div>
            ) : (
                <div>
                    <EventsTable events={events} />
                    <Button
                        variant='outline'
                        onClick={() => setShowForm(true)}
                        className="mt-4 mb-4"
                    >
                        Créer un événement
                    </Button>
                </div>
            )}
        </div>
    )
}
