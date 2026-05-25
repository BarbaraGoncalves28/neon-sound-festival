import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Event } from "../modules/Event";
import { getEvents } from "../services/storage";

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      {events.length === 0 && <p>No events scheduled.</p>}
      <ul className="space-y-4">
        {events.map((evt) => (
          <li key={evt.id} className="border p-4">
            <h3 className="text-lg font-semibold">{evt.name}</h3>
            <p>{evt.date}</p>
            <p>{evt.description}</p>
            <p className="font-bold">Price: ${evt.price.toFixed(2)}</p>
            <Link
              to={`/purchase/${evt.id}`}
              className="mt-2 inline-block bg-green-500 text-white px-3 py-1"
            >
              Buy Tickets
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
