import React, { useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import * as AiIcon from "react-icons/ai";
import { HeroSearch } from "@/components/Search/Search";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useMediaQuery } from "@uidotdev/usehooks";
import { CollapsibleList } from "@/components/Category/Category";
import useStore from "@/store";
import { Dropdown, MenuProps, Spin } from "antd";
import { Spinner } from "@/components/Other/Misc";
import { AiOutlineSearch } from "react-icons/ai";
import useOutsideClick from "@/hooks/useClickAway";
import { ChangePasswordModal } from "@/components/CustomInput/ChangePassword";
import ScrollToTop from "@/components/Other/ScrollToTop";

const PrivateLayout: React.FC<any> = () => {
  const [openMobile, setOpenMobile] = useState<boolean>(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const {
    catStore: { getCatgoriesAndSubCategories },
    miscStore: { spinning },
  } = useStore();
  const location = useLocation();

  useEffect(() => {
    getCatgoriesAndSubCategories();
  }, []);

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

      <Spin
        spinning={spinning}
        indicator={<Spinner />}
        wrapperClassName="custom-spin-wrapper"
      >
        <div className="mt-20 md:mt-24 lg:mt-32 transition-all duration-300 ease-linear">
          <ScrollToTop>
            <Outlet />
          </ScrollToTop>
        </div>
      </Spin>

      <Footer />
    </>
  );
};

export const Header: React.FC<{
  openMobile: () => void;
}> = ({ openMobile }) => {
  const navigate = useNavigate();
  const { authStore } = useStore();
  const [hideOnScroll, setHideOnScroll] = useState<boolean>(false);
  const [showSearcher, setShowSearcher] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useScrollPosition(
    ({ currPos }) => {
      const isShow = currPos.y < -40;

      if (!showSearcher && !isShow) {
        setShowSearcher(false);
      }

      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll, isHomePage]
  );

  const items: MenuProps["items"] = [
    {
      label: <Link to="/profile">My Profile</Link>,
      key: "0",
    },
    {
      label: <a onClick={() => setChangePassword(true)}>Change Password</a>,
      key: "1",
    },
    {
      label: (
        <a
          onClick={() => {
            authStore.logout();
          }}
          className="!text-red-600"
        >
          Log out
        </a>
      ),
      key: "2",
    },
  ];

  return (
    <>
      <div className="transition-all duration-300 ease-linear w-full fixed top-0 bg-[#006310] h-20 md:h-24 lg:h-32 z-40">
        <div className="px-4 lg:px-12 py-3 lg:py-[18px] flex items-center gap-4 justify-between">
          <Link to="/" className="hidden md:inline">
            <img
              src="/logo.svg"
              alt="logo"
              className="h-16 lg:h-[72px] w-[72px] lg:w-[84px]"
            />
          </Link>
          <RxHamburgerMenu
            className="inline md:hidden text-4xl text-white cursor-pointer"
            onClick={() => openMobile()}
          />

          <div className="flex items-center gap-3">
            {isHomePage ? (
              hideOnScroll && (
                <button
                  onClick={() => setShowSearcher(true)}
                  className="text-white w-12 !min-h-[42px]"
                >
                  <AiOutlineSearch className="text-2xl" />
                </button>
              )
            ) : (
              <button
                onClick={() => {
                  setShowSearcher(true);
                }}
                className="text-white w-12 !min-h-[42px]"
              >
                <AiOutlineSearch className="text-2xl" />
              </button>
            )}

            <button
              className="btn btn-primary !min-h-[42px] !min-w-fit px-6 lg:px-0 lg:w-[150px]"
              onClick={() => {
                if (authStore.isAuthenticated) {
                  navigate("/ad/new");
                } else {
                  navigate("/auth");
                }
              }}
            >
              <AiIcon.AiOutlinePlusCircle className="text-2xl" />
              <span className="hidden lg:inline">Create Ad</span>
            </button>

            {authStore.isAuthenticated ? (
              <Dropdown trigger={["click"]} menu={{ items }}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    className="w-10 h-10 rounded-full border border-white bg-white"
                    src={
                      authStore.user?.image ||
                      "https://picsum.photos/200/200?random=313"
                    }
                    alt="Rounded avatar"
                  />
                  <h2 className="hidden lg:inline text-sm text-white font-medium capitalize">
                    {`${authStore.user?.last_name} ${authStore.user?.first_name}`}
                  </h2>
                </div>
              </Dropdown>
            ) : (
              <button
                className="btn btn-secondary-3 !min-w-fit px-6 lg:px-0 !min-h-[42px] lg:w-[150px]"
                onClick={() => {
                  navigate("/auth");
                }}
              >
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <HeroSearch
        onClose={() => {
          setShowSearcher(false);
        }}
        isOpen={showSearcher}
      />
      <ChangePasswordModal
        show={changePassword}
        onClose={() => {
          setChangePassword(false);
        }}
      />
    </>
  );
};

export const MobileOverlay = ({ visible }) => {
  return (
    <>
      {visible && (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-900 z-[49] bg-opacity-60"></div>
      )}
    </>
  );
};

export const Footer = () => {
  const {
    catStore: { categories, getCategories },
    miscStore: { social_media, getSystemSettings },
  } = useStore();

  useEffect(() => {
    getCategories();
    getSystemSettings();
  }, []);

  return (
    <div className="bg-[#1E411B]  text-white min-h-[448px] flex flex-col items-center justify-center px-12 z-50">
      <div className="grid py-6 xl:p-0 grid-cols-1 md:grid-cols-4 gap-12 w-full">
        <div>
          <img
            src="/logo.svg"
            alt="logo"
            className="md:mx-auto w-[59px] h-[69px] my-12 lg:m-0"
          />
        </div>
        <div>
          <p className="font-bold mb-10">Information</p>
          <ul className="flex flex-col gap-y-4 font-light">
            <li>
              <NavLink to="/terms-and-condition">Terms and condition</NavLink>
            </li>
            <li>
              <NavLink to="/privacy-policy">Privacy and Policy</NavLink>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-10">Explore</p>
          <ul className="flex flex-col gap-y-4 font-light">
            {categories &&
              categories.length > 0 &&
              categories?.map((item) => (
                <li key={item._id}>
                  <NavLink to={`/categories/${item.slug}`}>{item.name}</NavLink>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <p className="font-bold mb-10">Join us on</p>
          <ul className="flex flex-col gap-y-4 font-light">
            <li>
              <a
                className="hover:text-gray-100"
                href={`https://facebook.com/${social_media?.facebook || ""}`}
                target="_blank"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                className="hover:text-gray-100"
                href={`https://twitter.com/${social_media?.twitter || ""}`}
                target="_blank"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                className="hover:text-gray-100"
                href={`https://linkedin.com/in/${social_media?.linkedin || ""}`}
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                className="hover:text-gray-100"
                href={`https://instagram.com/${social_media?.instagram || ""}`}
                target="_blank"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const MobileNav: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const ref = useOutsideClick(() => {
    onClose();
  });

  return (
    <div
      ref={ref}
      id="sidebar"
      className={`bg-white w-3/4 space-y-6 pt-6 px-0 fixed inset-y-0 left-0 transform transition duration-200 ease-in-out z-50 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Link to="/">
        <img
          src="/logo.svg"
          alt="logo"
          className="h-[48px] w-[56px] ml-6 my-6"
        />
      </Link>

      <h3 className="w-full bg-[#67A961] text-base font-semibold text-white px-6 py-4">
        Categories
      </h3>

      <div className="h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
        <CollapsibleList />
      </div>
    </div>
  );
};

export default PrivateLayout;
