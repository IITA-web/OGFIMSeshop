export const Tag: React.FC<{
  tag: string;
}> = ({ tag }) => {
  return (
    <span className="text-xs font-normal text-gray-400 bg-[#F3F6F6] py-1 px-2 ">
      {tag}
    </span>
  );
};
