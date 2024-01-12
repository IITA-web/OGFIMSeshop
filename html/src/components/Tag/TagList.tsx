import React, { useState } from "react";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";

const TagList: React.FC<{
  tags: string[];
  maximize?: boolean;
}> = ({ tags = [], maximize }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedTags = showAll ? tags : tags.slice(0, 3);

  return (
    <div className="flex gap-2 items-center">
      <ul className="flex gap-2 items-center flex-wrap lg:flex-nowrap">
        {(maximize ? tags : displayedTags).map((item, index) => (
          <li className="tag text-sm whitespace-nowrap" key={index}>
            {item}
          </li>
        ))}
      </ul>

      {tags.length > 3 && !maximize && (
        <button className="tag text-sm" onClick={() => setShowAll(!showAll)}>
          {showAll ? (
            <AiOutlineCaretLeft className="text-gray-500" />
          ) : (
            <AiOutlineCaretRight className="text-gray-500" />
          )}
        </button>
      )}
    </div>
  );
};

export default TagList;
