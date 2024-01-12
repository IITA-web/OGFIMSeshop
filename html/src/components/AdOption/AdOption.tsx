import { AiFillCrown } from "react-icons/ai";

export const AdSelectOption: React.FC<{
  days: number;
  price: number;
  selected: number;
  onSelect: (days: number) => void;
}> = ({ days, price, selected, onSelect }) => {
  return (
    <div>
      <input
        className="hidden"
        type="radio"
        name="selectedPlan"
        id={`radio_${days}`}
        value={days}
        checked={selected === days}
        onChange={() => onSelect(days)}
      />
      <label
        className={`flex flex-col p-4 gap-2 border-2 border-gray-200 cursor-pointer rounded-lg  lofi`}
        htmlFor={`radio_${days}`}
      >
        <h1 className="flex items-center text-xl gap-2 font-semibold uppercase">
          <AiFillCrown className="text-orange-500 text-3xl" />
          TOP
        </h1>
        <p className="text-sm font-normal text-gray-400">
          Your ad will appear first
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-400 bg-gray-200 rounded-md py-2 px-4 ptag">
            {days} Days
          </p>
          <p className="text-xl text-[#67A961] font-semibold">
            N{price.toLocaleString()}
          </p>
        </div>
      </label>
    </div>
  );
};

export const AdOption: React.FC<{
  days: number;
  price: number;
  onClick: () => void;
}> = ({ days, price, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col p-4 gap-2 border-2 border-[#67a961] cursor-pointer rounded-lg w-full`}
    >
      <h1 className="flex items-center text-xl gap-2 font-semibold uppercase">
        <AiFillCrown className="text-orange-500 text-3xl" />
        TOP
      </h1>
      <p className="text-sm font-normal text-gray-400">
        {/* Your ad will appear first */}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#67a961] bg-green-200 rounded-md py-2 px-4 ptag">
          {days} Days
        </p>
        <p className="text-xl text-[#67A961] font-semibold">
          N{price.toLocaleString()}
        </p>
      </div>
    </button>
  );
};
