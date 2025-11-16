export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex size-full">{children}</div>;
}
