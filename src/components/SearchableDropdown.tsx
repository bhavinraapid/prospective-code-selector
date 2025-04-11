
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableDropdownProps<T> {
  items: T[];
  displayProperty: keyof T;
  valueProperty: keyof T;
  placeholder: string;
  onSelect: (item: T) => void;
  selectedItem?: T | null;
  isLoading?: boolean;
}

export function SearchableDropdown<T>({
  items,
  displayProperty,
  valueProperty,
  placeholder,
  onSelect,
  selectedItem,
  isLoading = false,
}: SearchableDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredItems = items.filter((item) =>
    String(item[displayProperty])
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={
            selectedItem
              ? String(selectedItem[displayProperty])
              : searchTerm
          }
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (selectedItem) {
              onSelect(null as unknown as T);
            }
          }}
          onClick={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">Loading...</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={String(item[valueProperty])}
                className={cn(
                  "p-2 cursor-pointer hover:bg-blue-50",
                  index !== filteredItems.length - 1 && "border-b border-gray-100"
                )}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                {String(item[displayProperty])}
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
