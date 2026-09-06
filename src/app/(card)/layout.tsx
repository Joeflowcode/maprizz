export default function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="flex flex-1 flex-col bg-cream">
      {children}
    </main>
  );
}
