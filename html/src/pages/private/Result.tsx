import Card from "@/components/Ad/Card";
import { GoBack } from "@/components/Other/Back";
import { Empty } from "@/components/Other/Misc";
import SEO from "@/components/Seo/Seo";
import useStore from "@/store";
import { Pagination, PaginationProps, Select } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as BiIcons from "react-icons/bi";
import { useParams, useSearchParams } from "react-router-dom";

const ResultPage = () => {
  let [searchParams] = useSearchParams();
  const [pageSize] = useState<number>(12);
  const [sort, setSort] = useState<string>("latest");
  const [category, setCategory] = useState<string>(null);
  const [current, setCurrent] = useState<number>(1);
  const params = useParams();
  const {
    productStore: { searchProducts, search, loading, searchPagination },
    catStore: { getCatById },
    miscStore: { setSpinner },
  } = useStore();

  const searchParam = useMemo(() => searchParams.get("search"), [searchParams]);
  const locationParam = useMemo(
    () => searchParams.get("location"),
    [searchParams]
  );

  useEffect(() => {
    if (searchParam !== undefined || locationParam !== undefined) {
      setCurrent(1);
    }
  }, [searchParam, locationParam, sort]);

  const param = useMemo(() => {
    const queryParams: Record<string, unknown> = {};

    searchParams.forEach((value, key) => {
      if (value && value !== "undefined") {
        queryParams[key] = value;
      }
    });

    if (params["cat"]) {
      queryParams["category"] = params["cat"];
      getCatById(params.cat).then((cat) => setCategory(cat?.name));

      if (params["sub"]) {
        queryParams["subcategory"] = params["sub"];
      }
    }

    return queryParams;
  }, [searchParams, params]);

  const handleSearch = useCallback(() => {
    search({ ...param, sort, page: current, pageCount: pageSize });
  }, [search, param, sort, current, pageSize]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    setSpinner(loading);
  }, [loading]);

  const onPaginationChange: PaginationProps["onChange"] = useCallback(
    (page) => {
      setCurrent(page);
    },
    []
  );

  return (
    <>
      <SEO
        title={`${import.meta.env.VITE_APP_NAME} - ${
          category ? category : searchParam
        }`}
        description={`${
          import.meta.env.VITE_APP_NAME
        } is the best place to buy and sell high-quality agricultural products. Find a wide range of fresh produce, seeds, livestock, and farming equipment. Join now and connect with farmers and buyers in Ogun state.`}
        name={`${import.meta.env.VITE_APP_NAME} - ${
          category ? category : searchParam
        }`}
        type="article"
        image="people.svg"
      />
      <div className="w-full flex justify-center min-h-[600px]">
        <div className="w-full xl:max-w-[calc(100%-190px)] 2xl:max-w-[calc(100%-290px)] flex-1 p-6 flex flex-col gap-y-8">
          <div className="place-self-start">
            <GoBack />
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-x-2 text-base justify-between">
            {category ? (
              <h2 className="md:text-2xl font-medium my-4">{category}</h2>
            ) : (
              <h2 className="lg:text-2xl font-medium my-4">
                {searchParam
                  ? `Search result for "${searchParam}"`
                  : locationParam
                  ? `Search result for location "${locationParam}"`
                  : "Search result"}
              </h2>
            )}

            {searchProducts.length > 0 && (
              <div className="flex items-center gap-x-2 lg:place-self-end">
                <BiIcons.BiFilter className="text-2xl" />
                <p>Filter By</p>
                <Select
                  defaultValue={sort}
                  style={{ width: 100 }}
                  popupClassName={"w-full !lg:w-56 rounded-none"}
                  bordered={false}
                  onChange={(value) => setSort(value as string)}
                  options={[
                    { value: "latest", label: "Latest" },
                    { value: "price", label: "Price" },
                  ]}
                />
              </div>
            )}
          </div>

          {searchProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {searchProducts.map((product) => (
                  <Card key={product._id} product={product} />
                ))}
              </div>
              {searchPagination.total > pageSize && (
                <Pagination
                  current={current}
                  onChange={onPaginationChange}
                  total={searchPagination.total}
                  className="mx-auto my-6"
                  pageSize={pageSize}
                  showSizeChanger={false}
                />
              )}
            </>
          ) : (
            <Empty message="Sorry, we couldn't find any results. Please try a different search, category or location." />
          )}
        </div>
      </div>
    </>
  );
};

export default ResultPage;
