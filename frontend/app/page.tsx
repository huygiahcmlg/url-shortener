import UrlForm from "@/components/UrlForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      {/* dark overlay */}
      <div className="fixed inset-0 bg-black/40 -z-10" />

      <div className="w-full max-w-xl text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight drop-shadow">
          Rút gọn link
        </h1>
        <p className="mb-8 text-white/80 drop-shadow">
          Làm ngắn link · Short link
        </p>
        <UrlForm />
      </div>
    </main>
  );
}
