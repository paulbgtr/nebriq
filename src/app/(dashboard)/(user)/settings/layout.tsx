export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8">{children}</div>
  );
}
