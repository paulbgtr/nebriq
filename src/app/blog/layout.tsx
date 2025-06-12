import { Header } from "@/shared/components/header";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="mt-[8rem]">{children}</main>
    </div>
  );
}
