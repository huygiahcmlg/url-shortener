import UrlForm from "@/components/UrlForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          Rút gọn link
        </h1>
        <p className="mb-8 text-gray-500">
          Làm ngắn link · Short link
        </p>
        <UrlForm />
      </div>
    </main>
  );
}
