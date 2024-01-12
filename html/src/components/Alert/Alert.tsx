import { confirmAlert } from "react-confirm-alert";

export const confirm = (
  message: string = "You want to delete this file?",
  onApprove: () => void
): void => {
  return confirmAlert({
    overlayClassName: "bg-gray-800 bg-opacity-80",
    customUI: ({ onClose }) => {
      return (
        <div className="bg-gray-100 p-4 min-h-[300px]  min-w-[300px] rounded-lg text-center flex flex-col items-center">
          <div className="my-6">
            <h1 className="text-lg font-semibold">Are you sure?</h1>
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 mt-auto">
            <button
              className="btn flex-1 btn-secondary rounded-2xl !w-full !min-h-[48px]"
              onClick={() => {
                onApprove();
                onClose();
              }}
            >
              Yes, Delete it!
            </button>
            <button
              className="btn flex-1 rounded-2xl !w-full btn-light-grey !min-h-[48px]"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      );
    },
  });
};
