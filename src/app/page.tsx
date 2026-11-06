import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Pinpoint</h1>
      <p className="mt-4 text-lg text-gray-600">
        Bug reports pinned to the exact element. Open the demo page, click the round button in the
        bottom-right corner, choose <strong>Inspect Element</strong>, and click anything that looks wrong.
      </p>
      <Link
        href="/demo"
        className="mt-8 inline-flex rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
      >
        Open the demo page
      </Link>
      <p className="mt-10 text-sm text-gray-500">
        To add Pinpoint to your own app, see the README.
      </p>
    </main>
  );
}
