import ScrollToTop from "@/components/Other/ScrollToTop";
import { useMediaQuery } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Footer, Header, MobileNav, MobileOverlay } from "../private/Layout";

const PublicLayout: React.FC<any> = ({ children }) => {
  const [openMobile, setOpenMobile] = useState<boolean>(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    if (!isSmallDevice && openMobile) {
      setOpenMobile(false);
    }
  }, [isSmallDevice, openMobile]);

  useEffect(() => {
    setOpenMobile(false);
  }, [location]);

  return (
    <>
      <Header openMobile={() => setOpenMobile(true)} />
      <MobileOverlay visible={openMobile} />
      <MobileNav
        open={openMobile}
        onClose={() => {
          setOpenMobile(false);
        }}
      />

      <div className="relative mt-20 lg:mt-32 flex justify-center">
        <div className="bg-[#006310] h-64 w-full absolute"></div>
        <div className="transition-all duration-300 z-10 ease-linear bg-white md:min-h-[calc(100vh-200px)] mb-6 w-full md:w-[80%]">
          <ScrollToTop>{children ? children : <Outlet />}</ScrollToTop>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PublicLayout;
