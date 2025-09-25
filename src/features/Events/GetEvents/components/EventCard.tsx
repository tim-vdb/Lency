"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string | null;
    location: string;
    dateStart: Date;
    dateEnd: Date;
    openAt: Date;
    closeAt: Date;
    maxParticipants: number;
    visibleToGuests: boolean;
  };
  images: {
    id: number;
    key: string;
    url: string;
    type: "EVENT" | "GALLERY";
    uploadedBy: string;
    createdAt: Date;
  }[];
}

export default function EventCard({ event, images }: EventCardProps) {
  const pathname = usePathname();
  const user = useUser();

  // Vérification que event existe
  if (!event) {
    return null;
  }

  // Vérification que images existe et est un tableau
  if (!images || !Array.isArray(images)) {
    return null;
  }

  // Vérification que l'utilisateur est connecté (membre ou admin)
  if (!user) {
    return null;
  }

  const eventImage = images.length > 0 ? images[0] : null;

  return (
    <>
      {(event.visibleToGuests === true || (user.role === "MEMBER" || user.role === "ADMIN")) ? (
        <Card className="overflow-hidden rounded-2xl shadow-md hover:cursor-pointer transition mb-10">
          {eventImage?.url && (
            <div className="h-60 w-[90%] rounded-xl m-auto overflow-hidden">
              <Image
                width={400}
                height={400}
                src={eventImage.url}
                alt={event.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-xl font-semibold h-[4vh]">
              {event.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {pathname !== "/" && event.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 h-25">
                {event.description}
              </p>
            )}

            {pathname !== "/" && (
              <Link href={`/events/${event.id}`}>
                <Button>S&apos;inscrire</Button>
              </Link>
            )}

            <div className="flex items-center text-sm text-muted-foreground mt-4">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(event.dateStart)} → {formatDate(event.dateEnd)}{" "}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {event.location}
            </div>
            {pathname !== "/" && (
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  {`Inscriptions : ${formatDate(event.openAt)} → ${formatDate(
                    event.closeAt
                  )}`}
                </span>
                <span className="text-xs font-medium">{`Max: ${event.maxParticipants}`}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-gray-500 p-4">
          Cet événement est réservé aux membres
        </div>
      )}
    </>
  );
}
