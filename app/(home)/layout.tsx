import HomeNavbar from "@/components/layout/home/home-navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex size-full flex-col">
      <HomeNavbar />
      <div className="flex size-full flex-col pt-14">{children}</div>
    </div>
  );
}
