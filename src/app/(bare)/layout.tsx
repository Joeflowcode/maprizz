export default function BareLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="flex flex-1 flex-col bg-ink">
      {children}
    </main>
  );
}
