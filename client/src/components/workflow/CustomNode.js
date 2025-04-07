import React from "react";

const CustomNode = ({ data }) => {
  const getNodeColor = (type) => {
    switch (type) {
      case "start":
        return "bg-green-500";
      case "end":
        return "bg-red-500";
      case "api":
        return "bg-blue-500";
      case "email":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
      <div className="flex">
        <div
          className={`rounded-full w-4 h-4 flex-shrink-0 mt-1 ${getNodeColor(
            data.type
          )}`}
        />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomNode;
