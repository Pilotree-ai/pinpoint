// A sample page with a few deliberate mistakes, so there is something to report.
const team = [
  { name: "Sam Taylor", role: "Owner", status: "Active" },
  { name: "Priya Shah", role: "Editor", status: "Active" },
  { name: "Leo Martin", role: "Viewer", status: "Invited" },
];

export default function Demo() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Team settings</h1>
          <p className="mt-1 text-gray-500">Manage who can access your workspace.</p>
        </div>
        <button id="invite-button" className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
          Invite memebers
        </button>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Seats used</p>
          <p className="mt-2 text-3xl font-semibold">3 / 5</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Pending invites</p>
          <p className="mt-2 text-3xl font-semibold">1</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Plan</p>
          <p className="mt-2 text-3xl font-semibold text-gray-300">Pro</p>
        </div>
      </section>

      <table className="mt-8 w-full text-left text-sm">
        <thead className="border-b border-gray-200 text-gray-500">
          <tr>
            <th className="py-3">Name</th>
            <th className="py-3">Role</th>
            <th className="py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {team.map((m) => (
            <tr key={m.name} className="border-b border-gray-100">
              <td className="py-3 font-medium">{m.name}</td>
              <td className="py-3">{m.role}</td>
              <td className="py-3">
                <span
                  className={
                    m.status === "Active"
                      ? "rounded-full bg-green-100 px-2 py-1 text-green-700"
                      : "rounded-full bg-green-100 px-2 py-1 text-green-700"
                  }
                >
                  {m.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-10 flex justify-end gap-3">
        <button className="rounded-lg border border-gray-300 px-4 py-2">Cancel</button>
        <button className="rounded-lg border border-gray-300 px-4 py-2">Save</button>
      </div>
    </main>
  );
}
