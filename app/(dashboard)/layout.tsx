import AppSidebar from "@/components/app-sidebar";
import CurrentDate from "@/components/current-date";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed left-[-10%] top-[-20%] z-0 h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] z-0 h-[50%] w-[50%] rounded-full bg-secondary/10 blur-[120px]" />

      <AppSidebar />

      <div className="md:pl-72">
        <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-end border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl md:left-72 md:h-24 md:px-10">
          <div className="text-right text-sm font-semibold leading-[1.3] tracking-[-0.015em] sm:text-base md:text-[23px]">
            <CurrentDate />
          </div>
        </header>

        <div className="relative pt-20 md:pt-24">
          {children}
        </div>
      </div>
    </main>
  );
}
