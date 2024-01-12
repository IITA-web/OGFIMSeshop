import useStore from "@/store";
import { useEffect, useState } from "react";
import * as PiIcon from "react-icons/pi";
import { NavLink } from "react-router-dom";

const Category = () => {
  return (
    <div className="flex-shrink-0 bg-white min-h-max hidden lg:flex flex-grow-0 basis-80 w-80 mr-4 shadow-[rgba(0,0,0,0.1)_5px_-2px_10px_0px]">
      <div className="h-full relative z-10 flex-1">
        <div className="translate-y-0 inline-table w-full static ">
          <div>
            <div className="h-[5000px] max-h-[90vh] p-0">
              <div className="h-full absolute z-[1] w-full">
                <h3 className="w-full bg-[#67A961] text-lg font-semibold text-white my-6 p-6">
                  Filter by category
                </h3>

                <div className="overflow-y-auto h-[calc(100vh-200px)] no-scrollbar">
                  <CollapsibleList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;

const Subcategories = ({ subcategories, catId }) => {
  return (
    <div className="subcategories mt-6">
      <ul className="flex flex-col gap-6 text-sm md:text-base text-gray-800 font-normal ">
        {subcategories.map((subcategory) => (
          <li
            key={subcategory.id}
            className="relative before:absolute before:content-[''] before:w-0.5 before:h-full before:bg-gray-800 hover:before:bg-[#67a961]"
          >
            <NavLink
              to={`/categories/${catId}/${subcategory.slug}`}
              className="active:text-[#67a961] hover:text-[#67a961]"
            >
              <span className="pl-2">{subcategory.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

// const generateDummyData = () => {
//   const dummyData = [];

//   for (let i = 1; i <= 50; i++) {
//     const category = {
//       id: i,
//       name: `Category ${i}`,
//       slug: `category-${i}`,
//       subcategories: [],
//     };

//     for (let j = 1; j <= 10; j++) {
//       const subcategory = {
//         id: `${i}-${j}`,
//         name: `Subcategory ${i}-${j}`,
//         slug: `subcategory-${i}-${j}`,
//       };

//       category.subcategories.push(subcategory);
//     }

//     dummyData.push(category);
//   }

//   return dummyData;
// };

// export const dummyCategories = generateDummyData();

export const CollapsibleList = () => {
  const {
    catStore: { all },
  } = useStore();
  const [visibleCategory, setVisibleCategory] = useState<string>("");
  const categories = all.map((item) => ({
    name: item.name,
    id: item._id,
    slug: item.slug,
    subcategories:
      item.subCategories?.length > 0
        ? item.subCategories.map((sub) => ({
            name: sub.name,
            id: sub._id,
            slug: sub.slug,
          }))
        : [],
  }));

  const toggleSubcategory = (index) => {
    setVisibleCategory((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <ul className="collapsible-list px-6 md:p-6 mb-12 flex flex-col gap-8 text-base md:text-lg font-semibold ">
      {categories.map((category) => (
        <li
          key={category.id}
          className={`${
            category.id === visibleCategory && "show-subcategories"
          }  transition duration-300 ease-in-out cursor-pointer`}
        >
          {category.subcategories.length > 0 ? (
            <div
              onClick={() => toggleSubcategory(category.id)}
              className="active:text-[#67a961] hover:text-[#67a961] flex items-center gap-x-2"
            >
              <span>{category.name}</span>
              {visibleCategory === category.id ? (
                <PiIcon.PiCaretDown className="text-xl" />
              ) : (
                <PiIcon.PiCaretRight className="text-xl" />
              )}
            </div>
          ) : (
            <NavLink
              to={`/categories/${category.slug}`}
              className="active:text-[#67a961] hover:text-[#67a961]"
            >
              <span>{category.name}</span>
            </NavLink>
          )}

          {visibleCategory === category.id &&
            category.subcategories.length > 0 && (
              <Subcategories
                subcategories={category.subcategories}
                catId={category.slug}
              />
            )}
        </li>
      ))}
    </ul>
  );
};

export const CategorySelection: React.FC<{
  onChange: (tags: string[]) => void;
  value: string[];
}> = ({ value, onChange }) => {
  const agribusinessCategories = [
    "Crop Farming",
    "Grain Farming",
    "Fruit Farming",
    "Vegetable Farming",
    "Livestock Farming",
    "Cattle Farming",
    "Poultry Farming",
    "Sheep and Goat Farming",
    "Aquaculture",
    "Fish Farming",
    "Shrimp Farming",
    "Oyster and Mussel Farming",
    "Horticulture",
    "Floriculture",
    "Nursery Operations",
  ];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    value || []
  );

  useEffect(() => {
    setSelectedCategories(value || []);
  }, [value]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    if (selectedCategories.includes(selectedCategory)) {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((category) => category !== selectedCategory)
      );
    } else {
      if (
        selectedCategories.length <
        +import.meta.env.VITE_CATEGORY_SELECTION_LIMIT
      ) {
        setSelectedCategories((prevCategories) => [
          ...prevCategories,
          selectedCategory,
        ]);

        onChange([...selectedCategories, selectedCategory]);
      }
    }
  };

  return (
    <div className="flex flex-row gap-4 pb-6 flex-wrap">
      {agribusinessCategories.map((item, i) => (
        <div key={i}>
          <input
            className="!hidden"
            id={`radio_${i}`}
            type="checkbox"
            name="radio"
            value={item.trim()}
            onChange={handleCategoryChange}
            checked={selectedCategories?.includes(item)}
          />
          <label htmlFor={`radio_${i}`} className="cursor-pointer lofi">
            <p className="tag">{item}</p>
          </label>
        </div>
      ))}
    </div>
  );
};
