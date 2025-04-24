export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square bg-gray-200 rounded-lg shadow"></div>

        <div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>{" "}
          <div className="h-7 bg-gray-200 rounded w-1/4 mb-5"></div>{" "}
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>{" "}
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>{" "}
          <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>{" "}
          <div className="h-10 bg-gray-200 rounded w-32"></div>{" "}
        </div>
      </div>
    </main>
  );
}
