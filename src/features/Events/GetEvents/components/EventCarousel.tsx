import EventCard from "./EventCard";
import { GetEvents } from "../events.action";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GetImages } from "@/features/Gallery/server/gallery.action";

type Event = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  location: string;
  dateStart: Date;
  dateEnd: Date;
  openAt: Date;
  closeAt: Date;
  visibleToGuests: boolean;
  maxParticipants: number;
  creatorId: string;
};

export default async function EventCarousel() {
  const events = await GetEvents();
  const images = await GetImages();
  let lastOfEvents: Event[] = [];

  const findLatestEvents = () => {
    if (events && Array.isArray(events)) {
      lastOfEvents = events.slice(-3);
    }
  };

  findLatestEvents();

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full h-full"
    >
      <CarouselContent>
        {lastOfEvents.map((event, index) => {
          // Pour chaque événement, on prend une image différente basée sur l'index
          const eventImages = images.filter(img => img.type === "EVENT");
          const eventImage = eventImages[index % eventImages.length] || null;

          return (
            <CarouselItem key={event.id} className="md:basis-1/2">
              <div className="p-1">

                <CardContent className="flex aspect-square items-center p-6">
                  <EventCard event={event} images={eventImage ? [eventImage] : []} />
                </CardContent>

              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
