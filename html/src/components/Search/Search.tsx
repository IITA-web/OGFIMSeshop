import { Select } from "antd";
import NaijaStates from "naija-state-local-government";
import { useForm, Controller } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import * as _ from "lodash";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useOutsideClick from "@/hooks/useClickAway";

const Search: React.FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { control, watch, formState, register, setValue } = useForm<{
    search: string;
    location: string;
  }>();

  const debouncedSearch = useRef(
    _.debounce(async (params) => {
      const cleanParams = Object.keys(params)
        .filter(
          (key) =>
            params[key] !== null &&
            params[key] !== undefined &&
            params[key] !== ""
        )
        .reduce((acc, key) => {
          acc[key] = params[key];
          return acc;
        }, {});

      const queryString = Object.keys(cleanParams)
        .map((key) => `${key}=${encodeURIComponent(cleanParams[key])}`)
        .join("&");

      if (location.pathname !== "/search") {
        navigate("/search?" + queryString);
      } else {
        setSearchParams(cleanParams);
      }
    }, 500)
  ).current;

  useEffect(() => {
    if (location.pathname === "/search") {
      setValue("search", searchParams.get("search") || "");
      setValue("location", searchParams.get("location"));
    }
  }, [searchParams, location, setValue]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const subscription = watch((value) => {
      debouncedSearch(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [formState, watch]);

  return (
    <form
      className={`flex flex-col  items-center lg:flex lg:flex-row gap-2 w-full p-4 lg:p-0 md:w-2/4 grouped transition duration-300 ease-linear`}
    >
      <input
        type="search"
        autoComplete="off"
        placeholder="I'm looking for..."
        className="flex-1 form-input w-full lg:w-2/3 border-0 p-6"
        {...register("search")}
      />

      <Controller
        name={"location"}
        control={control}
        render={({ field }) => {
          return (
            <Select
              id="location"
              allowClear
              placeholder="Select a location"
              className={`antd-select w-full lg:w-1/3`}
              showSearch
              options={NaijaStates.lgas("Ogun")?.lgas.map((lga) => ({
                label: lga,
                value: lga,
              }))}
              {...field}
            />
          );
        }}
      />
    </form>
  );
};

export const HeroSearch: React.FC<{
  onClose: () => void;
  isOpen: boolean;
}> = ({ onClose, isOpen }) => {
  const ref = useOutsideClick(() => {
    onClose();
  });

  return (
    <div
      ref={ref}
      className={`h-72 w-full bg-[#67A961] flex flex-col justify-center items-center bg-[url('/header-bg.svg')] bg-no-repeat bg-cover bg-center transition-all ease-in-out duration-500 fixed top-0 left-0 right-0 z-50 slide transform ${
        !isOpen ? "-translate-y-96" : "translate-y-0"
      }`}
    >
      <button
        onClick={onClose}
        className="bg-transparent text-gray-100 hover:text-white absolute top-4 right-4 text-sm font-semibold"
      >
        <AiOutlineClose className="text-2xl" />
      </button>
      <Search />
    </div>
  );
};

export default Search;
