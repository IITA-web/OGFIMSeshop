import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorPage: React.FC<any> = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-[500px] p-6 h-screen md:h-full w-full flex flex-col justify-center items-center gap-4 bg-[url('/error.svg')] bg-no-repeat bg-center">
      <div className="text-center font-poppins text-[#92A3A3] mb-6">
        <h1 className="text-6xl lg:text-[90px] font-bold">
          {error ? error?.status : "404"}
        </h1>
        <p className="text-sm lg:text-xl font-semibold">
          Sorry the page or resources you are looking for doesn't exist or has
          been moved
        </p>
      </div>
      <button
        className="btn btn-secondary-2 !min-h-[48px] !w-[200px]"
        onClick={() => navigate("/")}
      >
        <AiOutlineArrowLeft />
        Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
