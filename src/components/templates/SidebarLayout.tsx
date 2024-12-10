
import HeaderBar from "@/components/molecules/HeaderBar";
import Footer from "@/components/organisms/Footer";
import { HeaderMain } from "@/components/organisms/HeaderMain";
import { ReactNode } from "react";

export const SidebarLayout = ({
  sidebarContents,
  children,
}: {
  sidebarContents: ReactNode[];
  children: ReactNode;
}) => (
  <div>
    <HeaderBar />
    <HeaderMain />
    <div className="bg-[#F5F5FA]">
      <div className="px-2 max-w-screen-xl mx-auto py-4">
        <div className="flex gap-4">
          <div className="hidden md:flex flex-col gap-4 w-[260px] shrink-0">
            {sidebarContents.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
    <div className="text-center">
      <Footer />
    </div>
  </div>
);
