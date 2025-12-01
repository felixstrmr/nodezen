import { Suspense } from "react";
import HomeNavbar from "@/components/layout/home-navbar";
import HomeNavbarSkeleton from "@/components/layout/home-navbar-skeleton";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex size-full flex-col">
      <Suspense fallback={<HomeNavbarSkeleton />}>
        <HomeNavbar />
      </Suspense>

      {children}
    </div>
  );
}
