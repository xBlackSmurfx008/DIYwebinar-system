import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h2>Organizer dashboard</h2>
      <p>Create an event, copy the stream key into OBS, then open the viewer link.</p>
      <ul>
        <li>
          <Link href="/events/new">Create a new event</Link>
        </li>
        <li>
          <Link href="/obs">OBS configuration</Link>
        </li>
      </ul>
    </div>
  );
}
