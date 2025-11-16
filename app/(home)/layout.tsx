import HomeNavbar from "@/components/layout/home/home-navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex size-full flex-col overflow-hidden pt-[70px]">
      <HomeNavbar />
      {children}
    </div>
  );
}
