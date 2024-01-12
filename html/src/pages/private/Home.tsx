import Card from "@/components/Ad/Card";
import Category from "@/components/Category/Category";
import Hero from "@/components/Hero/Hero";
import { Empty } from "@/components/Other/Misc";
import SEO from "@/components/Seo/Seo";
import useStore from "@/store";
import { Select, Pagination, PaginationProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import * as BiIcons from "react-icons/bi";

const HomePage = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [sort, setSort] = useState<string>("latest");
  const {
    productStore: { getProducts, products, productsPagination, loading },
    miscStore: { setSpinner },
  } = useStore();

  const handleSearch = useCallback(() => {
    getProducts({ pageCount: pageSize, sort, page: current });
  }, [getProducts, sort, current, pageSize]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch, sort, current]);

  useEffect(() => {
    setSpinner(loading);
  }, [loading]);

  const onPaginationChange: PaginationProps["onChange"] = (page) => {
    setCurrent(page);
  };

  return (
    <>
      <SEO
        title={`${
          import.meta.env.VITE_APP_NAME
        } - Buy and Sell Agricultural Products`}
        description={`${
          import.meta.env.VITE_APP_NAME
        } is the best place to buy and sell high-quality agricultural products. Find a wide range of fresh produce, seeds, livestock, and farming equipment. Join now and connect with farmers and buyers in Ogun state.`}
        name={`${
          import.meta.env.VITE_APP_NAME
        } - Buy and Sell Agricultural Products`}
        type="article"
        image="people.svg"
      />
      <Hero />
      <div className="flex w-full">
        <Category />
        <div className="w-full lg:max-w-[calc(100%-290px)] flex-1 p-6 flex flex-col gap-y-8">
          <div className="flex items-center gap-x-2 text-base place-self-end">
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
          {products?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {products?.map((product) => (
                  <Card key={product._id} product={product} />
                ))}
              </div>
              {productsPagination.total > pageSize && (
                <Pagination
                  current={current}
                  onChange={onPaginationChange}
                  total={productsPagination.total}
                  className="mx-auto my-6"
                  pageSize={pageSize}
                  showSizeChanger={false}
                />
              )}
            </>
          ) : (
            <Empty message={`No result, kindly check back later`} />
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
