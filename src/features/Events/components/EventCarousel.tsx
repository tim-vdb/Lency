import EventCard from "./EventCard";
import { GetEvents } from "./events.action";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Event = {
  image: string | null;
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

  let lastOfEvents: Event[] = [];

  const findLatestEvents = () => {
    if (events) {
      lastOfEvents = [
        events[events.length - 1],
        events[events.length - 2],
        events[events.length - 3],
      ];
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
        {lastOfEvents.map((event, index) => (
          <CarouselItem key={index} className="md:basis-1/2">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center p-6">
                  <EventCard event={event} />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
