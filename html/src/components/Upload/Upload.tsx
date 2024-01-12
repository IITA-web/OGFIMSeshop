import { AiFillCamera } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import { BsTrash } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
import ApiService from "@/services/api";
import * as uuid from "uuid";
import { Spin } from "antd";
import { Spinner } from "../Other/Misc";
import { toast } from "react-toastify";

const apiService = new ApiService();

export interface IUploadImage {
  id: string;
  tempId?: string;
  url: string;
  status?: string;
}

interface UploaderProps {
  onChange: (value: IUploadImage[]) => void;
  value: IUploadImage[];
}

const Uploader: React.FC<UploaderProps> = ({ onChange, value = [] }) => {
  const [deletingStatuses, setDeletingStatuses] = useState<{
    [key: string]: string;
  }>({});

  const uploadFile = async (file) => {
    const uniqueId: string = uuid.v4();
    const newUploadStatus: IUploadImage = {
      tempId: uniqueId,
      id: "", // Make sure to set the id property
      status: "uploading",
      url: "",
    };

    onChange([...value, newUploadStatus]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await apiService.UploadFile(formData);

      const newValue: IUploadImage[] = value.map((status) =>
        status.tempId === uniqueId
          ? { ...status, id: data.id, status: "uploaded", ...data }
          : status
      );

      onChange(newValue);
    } catch (error) {
      const errorValue: IUploadImage[] = value.map((status) =>
        status.tempId === uniqueId ? { ...status, status: "failed" } : status
      );

      onChange(errorValue);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      if (value.length >= 5) {
        toast.warning("You can upload up to 5 files.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        acceptedFiles.slice(0, 5 - value.length).forEach(uploadFile);
      }
    },
  });

  const handleDelete = async (id: string) => {
    console.log(value);
    setDeletingStatuses((prevDeletingStatuses) => ({
      ...prevDeletingStatuses,
      [id]: "deleting",
    }));

    try {
      const { data } = await apiService.DeleteFile(id);

      if (data) {
        console.log(
          id,
          value,
          value.filter((status) => status.id !== id)
        );

        onChange(value.filter((status) => status.id !== id));
        toast.success("File deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setDeletingStatuses((prevDeletingStatuses) => {
        const newDeletingStatuses = { ...prevDeletingStatuses };
        delete newDeletingStatuses[id];
        return newDeletingStatuses;
      });
    }
  };

  return (
    <>
      <div
        {...getRootProps({
          className:
            "dropzone h-[84px] rounded-md w-full bg-[#F3F6F6] border border-gray-200 flex items-center flex-col justify-center group cursor-pointer hover:border-gray-300 ",
        })}
      >
        <input {...getInputProps()} />
        <AiFillCamera className="group-hover:text-gray-500 transition mx-auto text-gray-400 text-4xl my-8" />
      </div>
      <div className="scroll-smooth flex flex-nowrap gap-2 overflow-x-auto">
        {value.map((uploadStatus) => (
          <LoaderOrThumbnail
            key={uploadStatus.id}
            uploadStatus={uploadStatus}
            onDelete={handleDelete}
            deletingStatuses={deletingStatuses}
          />
        ))}
      </div>
    </>
  );
};

const LoaderOrThumbnail: React.FC<{
  uploadStatus: IUploadImage;
  onDelete: (id: string) => void;
  deletingStatuses: { [key: string]: string };
}> = ({ uploadStatus, onDelete, deletingStatuses }) => {
  if (uploadStatus.status === "uploading") {
    return <Loader />;
  } else if (uploadStatus.status === "uploaded") {
    return (
      <Thumbnail
        url={uploadStatus.url}
        id={uploadStatus.id}
        onDelete={onDelete}
        deletingStatus={deletingStatuses[uploadStatus.id]}
      />
    );
  } else {
    return null; // Handle other status if needed
  }
};

const Loader: React.FC = () => {
  return (
    <div className="w-28 h-28 lg:h-40 lg:w-40 border rounded-lg relative group overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-20">
        <Spin className="text-black" indicator={<Spinner />} />
      </div>
    </div>
  );
};

const Thumbnail: React.FC<{
  url: string;
  id: string;
  onDelete: (id: string) => void;
  deletingStatus: string | undefined;
}> = ({ url, id, onDelete, deletingStatus }) => {
  const isDeleting = !!deletingStatus;

  return (
    <div className="w-28 h-28 min-w-28 min-w-28 max-w-28 max-w-28 lg:min-w-40 lg:min-w-40 lg:max-w-40 lg:max-w-40 lg:h-40 lg:w-40 border rounded-lg relative group overflow-hidden shrink-0">
      {!isDeleting && (
        <button
          type="button"
          className="absolute top-2 right-2 hidden group-hover:inline bg-red-600 p-2 rounded-full z-20"
          onClick={() => {
            onDelete(id);
          }}
        >
          <BsTrash className="text-white" />
        </button>
      )}

      <div
        className={`!h-full !w-full z-10 absolute top-0 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-40 ${
          !isDeleting
            ? "group-hover:inline hidden"
            : "flex justify-center items-center"
        }`}
      >
        {isDeleting && <Spin className="text-black" />}
      </div>

      <img
        src={url}
        className="object-cover w-full h-full"
        alt={id}
        onLoad={() => {
          URL.revokeObjectURL(url);
        }}
      />
    </div>
  );
};

export default Uploader;
