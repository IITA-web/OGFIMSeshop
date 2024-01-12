import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useState } from "react";
import Search from "../Search/Search";

const Hero = () => {
  const [hideOnScroll, setHideOnScroll] = useState(true);

  useScrollPosition(
    ({ currPos }) => {
      const isShow = currPos.y > -40;

      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  return (
    <div className="h-72 w-full bg-[#67A961] flex flex-col relative justify-center items-center bg-[url('/header-bg.svg')] bg-no-repeat bg-cover bg-center">
      <img
        src="people.svg"
        className="absolute left-[10%] bottom-0 hidden lg:inline w-64 h-48"
      />
      <div className="text-white mb-4 text-center font-poppins">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">OGFIMS eShop</h1>
        <p className="text-sm lg:text-base font-semibold">
          Connect with our farmers
        </p>
      </div>
      {hideOnScroll && <Search />}
    </div>
  );
};

export default Hero;
