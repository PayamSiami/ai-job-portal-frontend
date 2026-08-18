import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/50 dark:from-gray-900 dark:via-blue-900/50 dark:to-indigo-900/30 relative overflow-hidden m-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}