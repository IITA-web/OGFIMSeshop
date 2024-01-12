import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const WYSIWYGEditor = ({ onChange, value, placeholder }) => {
  const [count, setCount] = useState<number>(0);

  const handleChange = (value, _delta, _source, editor) => {
    onChange(value);
    setCount(editor?.getLength() - 1);
  };

  return (
    <div className="relative h-fit">
      <ReactQuill
        theme="snow"
        defaultValue={value}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />

      <span className="absolute -bottom-8 right-0 text-xs  bg-green-50 py-0.5 px-2.5 rounded-full text-[#457a40]">
        {count} Character
      </span>
    </div>
  );
};

export default WYSIWYGEditor;
