import React, { useState, useRef } from "react";
import { ChevronDown, Check } from 'lucide-react';
const Select = ({
  value,
  placeholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative w-[180px]">
      <div
        className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 cursor-pointer bg-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-sm text-gray-700">
          {value || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md z-10">
          <ul className="list-none m-0 p-0">{children}</ul>
        </div>
      )}
    </div>
  );
};

const SelectItem = ({
  value,
  children,
  onClick,
  selected,
}: {
  value: string;
  children: React.ReactNode;
  onClick: (value: string) => void;
  selected: boolean;
}) => (
  <li
    className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${
      selected ? "bg-gray-200" : ""
    }`}
    onClick={() => onClick(value)}
  >
    {children}
    {selected && <Check className="h-4 w-4 inline text-indigo-600" />}
  </li>
);

export { Select, SelectItem };
