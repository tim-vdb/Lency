import EventsToggleAction from '../../../features/Events/ToggleAction/EventsToggleAction'
import { GetEvents } from '@/features/Events/GetEvents/events.action'

export default async function Events() {
  const events = await GetEvents()

  return <EventsToggleAction events={events} />
}
