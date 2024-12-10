
import HeaderBar from "@/components/molecules/HeaderBar";
import Footer from "@/components/organisms/Footer";
import { HeaderMain } from "@/components/organisms/HeaderMain";
import { ReactNode } from "react";

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <HeaderBar />
      <HeaderMain />
      <div className="bg-[#F5F5FA]">
        <div className="px-2 max-w-screen-xl mx-auto py-4">{children}</div>
      </div>
      <div className="text-center">
        <Footer />
      </div>
    </div>
  );
};
