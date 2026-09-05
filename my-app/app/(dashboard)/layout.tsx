import AppSidebar from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const formattedDate =
    today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed left-[-10%] top-[-20%] z-0 h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] z-0 h-[50%] w-[50%] rounded-full bg-secondary/10 blur-[120px]" />

      <AppSidebar />

      <div className="pl-72">
        <header className="fixed left-72 right-0 top-0 z-40 flex h-24 items-center justify-between border-b border-white/10 bg-background/80 px-10 backdrop-blur-xl">
          <div className="text-[23px] font-semibold leading-[1.3] tracking-[-0.015em]">
            {formattedDate}
          </div>
        </header>
        <div className="relative pt-24">
          {children}
        </div>
      </div>
    </main>
  );
}