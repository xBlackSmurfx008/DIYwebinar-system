import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h2>Organizer Dashboard</h2>
      <p>Welcome. Create and manage your events.</p>
      <ul>
        <li><Link href="/events/new">Create a new event</Link></li>
        <li><Link href="/obs">OBS configuration</Link></li>
      </ul>
    </div>
  );
}
