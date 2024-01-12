import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Spinner as RingLoader } from "../Other/Misc";
import ApiService from "@/services/api";
import { AiFillCamera } from "react-icons/ai";
import { toast } from "react-toastify";

export interface IUploadImage {
  id: string;
  url: string;
}

const apiService = new ApiService();
const ImageUploader = ({ onUploadFinish, initialImageCount }) => {
  const [loading, setLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  useEffect(() => {
    setUploadedCount(initialImageCount);
  }, [initialImageCount]);

  const onUpload = (info) => {
    setUploadedCount((prevCount) => prevCount + 1);
    onUploadFinish(info);
  };

  const initiateS3Upload = async (file) => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      const { data } = await apiService.UploadFile(formData);

      onUpload(data);
    } catch (error) {
      toast.error("Error uploading", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    const remainingUploads = 5 - uploadedCount;

    if (remainingUploads === 0) {
      toast.warning("You have reached the maximum number of uploads", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setLoading(true);

    const filesToUpload = acceptedFiles.slice(0, remainingUploads);

    filesToUpload.forEach((file) => {
      initiateS3Upload(file);
    });
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { image: ["image/*"] },
  });
  const getSpinner = () => <RingLoader />;
  const getDropzoneContent = () => (
    <div
      {...getRootProps()}
      className={`dropzone h-[84px] rounded-md w-full bg-[#F3F6F6] border border-gray-200 flex items-center flex-col justify-center group cursor-pointer hover:border-gray-300 ${
        loading && "box-spinner"
      }`}
    >
      <input {...getInputProps()} />
      <AiFillCamera className="group-hover:text-gray-500 transition mx-auto text-gray-400 text-4xl" />
    </div>
  );

  return <div>{getDropzoneContent()}</div>;
};

export default ImageUploader;
