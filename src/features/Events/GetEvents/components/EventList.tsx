import EventCard from "./EventCard";
import { GetEvents } from "../events.action";
import { GetImages } from "@/features/Gallery/gallery.action";

export default async function EventList() {
  const events = await GetEvents();
  const images = await GetImages();
  console.log(events);

  // Vérification que events existe, est un tableau et n'est pas vide
  if (!events || !Array.isArray(events) || events.length === 0) {
    return null;
  }

  return (
    <>
      <h2>Découvrez tous nos événements</h2>
      <div className="grid grid-cols-1 md:gridcols-2 lg:grid-cols-3 gap-6">
        {events && events.length > 0 &&
          events.map((event) => (
            <div key={event.id}>
              <EventCard event={event} images={images} />
            </div>
          ))
        }
      </div>
    </>
  );
}
