import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const GoBack: React.FC<{
  text?: string;
  path?: any;
}> = ({ text = "Back", path = -1 }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="mt-2 flex items-center text-lg gap-2 text-[#457A40] hover:text-opacity-95"
    >
      <AiOutlineArrowLeft />
      {text}
    </button>
  );
};
