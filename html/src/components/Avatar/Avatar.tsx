import ApiService from "@/services/api";
import { useEffect, useState } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import { Spinner } from "../Other/Misc";

const apiService = new ApiService();
const Avatar: React.FC<{
  image: string;
  onChange: (event: any) => void;
}> = ({ image, onChange }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImageSrc(image);
  }, [image]);

  const handleImageChange = (event) => {
    setLoading(true);

    const selectedImage = event.target.files[0];
    const formData = new FormData();

    formData.append("file", selectedImage);
    apiService
      .UploadFile(formData)
      .then(({ data }) => {
        setImageSrc(data.url);
        onChange(data.url);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="relative max-w-fit mx-auto mb-6">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center rounded-full">
          <Spinner />
        </div>
      )}
      <div className="absolute bottom-2 right-2">
        <input
          type="file"
          id="imageUpload"
          accept=".png, .jpg, .jpeg"
          className="hidden"
          onChange={handleImageChange}
        />

        <label
          htmlFor="imageUpload"
          className="flex flex-col justify-center items-center w-8 h-8 rounded-full bg-[#31A05F] cursor-pointer transition-all ease-in-out hover:bg-opacity-90 "
        >
          <BsFillCameraFill className="text-lg text-white" />
        </label>
      </div>
      <img
        className="w-36 h-36 rounded-full shadow border-4 border-white object-cover"
        src={imageSrc}
        alt="User profile picture"
      />
    </div>
  );
};

export default Avatar;
