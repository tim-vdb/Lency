import EventCard from "./EventCard";
import { GetEvents } from "../events.action";

export default async function EventList() {
  const events = await GetEvents();
  console.log(events);
  return (
    <>
      <h2>Découvrez tous nos événements</h2>
      <div className="grid grid-cols-1 md:gridcols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </>
  );
}
