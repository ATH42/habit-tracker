import HabitTrackerClient from "./_components/HabitTrackerClient";

export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-8 text-4xl font-bold">Habit Tracker</h1>
      <HabitTrackerClient />
    </main>
  );
}
