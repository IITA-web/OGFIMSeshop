import EmptySvg from "@/assets/empty.svg";

export const Empty: React.FC<{
  message: string;
  showButton?: boolean;
  buttonAction?: () => void;
  buttonText?: string;
}> = ({ message, showButton, buttonAction, buttonText = "Add New" }) => {
  return (
    <div className="flex justify-center flex-col items-center w-full min-h-[400px] gap-14">
      <img src={EmptySvg} alt="empty" className="w-[196px] h-[191px]" />

      <div className="text-center">
        <p className="text-[#868686] text-base font-normal">{message}</p>
        {showButton && (
          <button
            onClick={() => buttonAction?.()}
            className="btn btn-secondary-2 mt-4 mx-auto"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export const Spinner = () => {
  return (
    <div className="w-16 h-16 border-t-4 mx-auto border-[#05AD57] border-solid rounded-full animate-spin"></div>
  );
};
