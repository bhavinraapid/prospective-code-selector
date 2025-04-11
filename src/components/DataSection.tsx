
import { useState } from "react";
import { DataItem } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Minus } from "lucide-react";

interface DataSectionProps {
  title: string;
  items: DataItem[];
  onSelect: (item: DataItem, frequency: number) => void;
  isLoading: boolean;
  sourceTable: string;
  selectedItemIds?: number[];
}

export function DataSection({ 
  title, 
  items, 
  onSelect, 
  isLoading,
  sourceTable,
  selectedItemIds = []
}: DataSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencies, setFrequencies] = useState<Record<number, number>>({});
  
  const showFrequencyCounter = sourceTable !== "mustRequiredCondition";

  const handleSelect = (item: DataItem) => {
    // If item is already selected, this will be a deselection
    // For mustRequiredCondition, always use frequency of 1
    const frequency = sourceTable === "mustRequiredCondition" ? 1 : (frequencies[item.id] || 1);
    onSelect(item, frequency);
  };

  const updateFrequency = (itemId: number, delta: number) => {
    setFrequencies(prev => {
      const currentFreq = prev[itemId] || 1;
      const newFreq = Math.max(1, Math.min(20, currentFreq + delta));
      return { ...prev, [itemId]: newFreq };
    });
  };

  const getFrequency = (itemId: number) => {
    return frequencies[itemId] || 1;
  };

  const filteredItems = items.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[350px] overflow-y-auto flex flex-col">
      <h3 className="text-lg font-medium mb-3 text-blue-700">{title}</h3>
      
      <div className="relative mb-3">
        <Input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-8"
        />
        <Search className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : items.length > 0 ? (
        <ScrollArea className="flex-1 h-[250px]">
          <ul className="space-y-2 pr-3">
            {filteredItems.map((item) => (
              <li 
                key={item.id} 
                className={cn(
                  "p-2 rounded cursor-pointer transition-colors",
                  selectedItemIds.includes(item.id) 
                    ? "bg-blue-100 text-blue-800 border border-blue-200" 
                    : "hover:bg-gray-50 border border-gray-100"
                )}
              >
                <div className="flex justify-between items-center">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    {item.text}
                  </div>
                  {showFrequencyCounter && (
                    <div className="flex items-center space-x-1">
                      <button 
                        type="button"
                        onClick={() => updateFrequency(item.id, -1)}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
                        aria-label="Decrease frequency"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-medium text-blue-600">
                        {getFrequency(item.id)}
                      </span>
                      <button 
                        type="button"
                        onClick={() => updateFrequency(item.id, 1)}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
                        aria-label="Increase frequency"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {filteredItems.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              No matching {title.toLowerCase()} found
            </div>
          )}
        </ScrollArea>
      ) : (
        <div className="flex justify-center items-center h-32 text-gray-500">
          Select a code to view {title.toLowerCase()}
        </div>
      )}
    </div>
  );
}
