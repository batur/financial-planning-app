import { useGetTableData } from "@/hooks";
import React from "react";

const FormulaInput = () => {
  const suggestions = useGetTableData();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", event.target.value);
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        onChange={handleChange}
        onKeyPress={(e) => {
          if (e.key === "Backspace") {
            console.log("Backspace pressed, new formula:");
          }
        }}
        className="border border-gray-300 p-2 rounded-md"
      />
      {suggestions.isLoading && <div>Loading...</div>}
      {suggestions.isSuccess && (
        <div>
          {suggestions.data.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <input
                type="text"
                value={tag.value}
                readOnly
                className="border border-gray-300 p-1 rounded-md"
              />
              <select className="border border-gray-300 p-1 rounded-md">
                {/* Add dropdown options here */}
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulaInput;
