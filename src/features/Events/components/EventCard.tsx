import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

type EventCardProps = {
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

export default function EventCard({
  id,
  name,
  description,
  image,
  location,
  dateStart,
  dateEnd,
  openAt,
  closeAt,
  maxParticipants,
  visibleToGuests,
}: EventCardProps) {
  console.log(id);
  console.log(image);
  return (
    visibleToGuests && (
      <Card className="overflow-hidden rounded-2xl shadow-md hover:cursor-pointer transition">
        {image && typeof image === "string" && image.length > 0 && (
          <div className="h-60 w-[90%] rounded-xl m-auto overflow-hidden">
            <Image
              width={400}
              height={400}
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          )}
          <Link href={`/events/${id}`}>
            <Button>S&apos;inscrire</Button>
          </Link>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(dateStart)} → {formatDate(dateEnd)}{" "}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {location}
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">
              {`Inscriptions : ${formatDate(openAt)} → ${formatDate(closeAt)}`}
            </span>
            <span className="text-xs font-medium">{`Max: ${maxParticipants}`}</span>
          </div>
        </CardContent>
      </Card>
    )
  );
}
