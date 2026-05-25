import { useState } from "react";
import type { Event } from "../modules/Event";

interface Props {
  initial?: Event;
  onSubmit: (evt: Event) => void;
}

const EventForm = ({ initial, onSubmit }: Props) => {
  const [name, setName] = useState(initial?.name || "");
  const [date, setDate] = useState(initial?.date || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price.toString() || "0");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const evt: Event = {
      id: initial?.id || Date.now().toString(),
      name,
      date,
      description,
      price: parseFloat(price) || 0,
    };
    onSubmit(evt);
    setName("");
    setDate("");
    setDescription("");
    setPrice("0");
  };

  return (
    <form onSubmit={handle} className="space-y-2">
      <div>
        <label className="block">Name</label>
        <input
          className="border p-1 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block">Date</label>
        <input
          type="date"
          className="border p-1 w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block">Description</label>
        <textarea
          className="border p-1 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block">Price</label>
        <input
          type="number"
          step="0.01"
          className="border p-1 w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-1">
        {initial ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default EventForm;
