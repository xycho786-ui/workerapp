import "./book-open.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-full bg-white text-gray-900 justify-center px-6 py-12">
      {children}
    </div>
  );
}
