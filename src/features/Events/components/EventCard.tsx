"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import no_image from "../../../../public/images/no-image.jpg";

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    location: string;
    dateStart: Date;
    dateEnd: Date;
    openAt: Date;
    closeAt: Date;
    maxParticipants: number;
    visibleToGuests: boolean;
  };
}

export default function EventCard({ event }: EventCardProps) {
  console.log(event.id);
  console.log(event.image);

  const pathname = usePathname();

  return (
    event.visibleToGuests && (
      <Card className="overflow-hidden rounded-2xl shadow-md hover:cursor-pointer transition">
        {pathname !== "/" ? (
          event.image &&
          typeof event.image === "string" &&
          event.image.length > 0 && (
            <div className="h-60 w-[90%] rounded-xl m-auto overflow-hidden">
              <Image
                width={400}
                height={400}
                src={event.image}
                alt={event.name}
                className="h-full w-full object-cover"
              />
            </div>
          )
        ) : (
          <div className="h-35 w-[90%] rounded-xl m-auto overflow-hidden">
            <Image
              width={400}
              height={400}
              src={event.image ?? no_image}
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
            <p className="text-sm text-muted-foreground line-clamp-3">
              {event.description}
            </p>
          )}

          {pathname !== "/" && (
            <Link href={`/events/${event.id}`}>
              <Button>S&apos;inscrire</Button>
            </Link>
          )}

          <div className="flex items-center text-sm text-muted-foreground">
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
    )
  );
}
