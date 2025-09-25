import { getUser } from '@/lib/auth-session';
import EventsToggleAction from '../../../features/Events/ToggleAction/EventsToggleAction'
import { GetEvents } from '@/features/Events/GetEvents/events.action'
import unauthorized from '@/app/unauthorized';

export default async function Events() {
  const events = await GetEvents()
  const user = await getUser();

  if (user?.role !== "ADMIN") {
    return unauthorized();
  }

  return <EventsToggleAction events={events} />
}
