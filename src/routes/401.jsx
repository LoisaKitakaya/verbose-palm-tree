import MetaTitle from "../components/meta/meta-title";

export default function Unauthorized() {
  return (
    <>
      <MetaTitle title="Unauthorized" />

      <div className="grid h-screen place-content-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-9xl font-black text-gray-200">401</h1>

          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Unauthorized!
          </p>

          <p className="mt-4 text-gray-500">
            You are not authorized to view that page.
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
          >
            Go To Home Page
          </a>
        </div>
      </div>
    </>
  );
}
