
import { X } from "lucide-react";
import { SelectedItem } from "@/types";
import { Button } from "@/components/ui/button";

interface SelectedItemsListProps {
  items: SelectedItem[];
  onRemove: (item: SelectedItem) => void;
  onApply: () => void;
  isSubmitting: boolean;
}

export function SelectedItemsList({ 
  items, 
  onRemove, 
  onApply,
  isSubmitting
}: SelectedItemsListProps) {
  // Group items by source table
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.sourceTable]) {
      acc[item.sourceTable] = [];
    }
    acc[item.sourceTable].push(item);
    return acc;
  }, {} as Record<string, SelectedItem[]>);

  const getCategoryTitle = (key: string) => {
    switch (key) {
      case 'labs': return 'Labs';
      case 'physicalExam': return 'Physical Exam';
      case 'treatment': return 'Treatment';
      case 'medications': return 'Medications';
      case 'mustRequiredCondition': return 'Must Required Condition';
      default: return key;
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No items selected. Select items from the sections above.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Selected Items</h2>
      
      {Object.keys(groupedItems).map((category) => (
        <div key={category} className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">{getCategoryTitle(category)}</h3>
          <ul className="space-y-2">
            {groupedItems[category].map((item) => (
              <li 
                key={`${item.sourceTable}-${item.id}`} 
                className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-700">{item.text}</span>
                  <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Frequency: {item.frequency}
                  </span>
                </div>
                <button 
                  onClick={() => onRemove(item)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={onApply} 
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isSubmitting ? 'Processing...' : 'Apply Selections'}
        </Button>
      </div>
    </div>
  );
}
