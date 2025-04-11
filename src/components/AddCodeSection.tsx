
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeMaster } from "@/types";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { fetchCodes } from "@/services/api";
import { addCodeToMaster } from "@/services/masterApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AddCodeSection = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState<CodeMaster[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeMaster | null>(null);
  const [newCodeText, setNewCodeText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCodes = async () => {
      try {
        const data = await fetchCodes();
        setCodes(data);
      } catch (error) {
        console.error("Failed to fetch codes:", error);
        toast.error("Failed to load codes");
      } finally {
        setIsLoading(false);
      }
    };

    loadCodes();
  }, []);

  const handleAddCode = async () => {
    if (!newCodeText.trim()) {
      toast.error("Please enter text for the new code");
      return;
    }

    try {
      await addCodeToMaster(newCodeText);
      toast.success("Code added successfully");
      setNewCodeText("");
      
      // Refresh the page after successful addition
      navigate(0);
    } catch (error) {
      console.error("Failed to add code:", error);
      toast.error("Failed to add code");
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Add Code to Master</h2>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Existing Code
        </label>
        <SearchableDropdown
          items={codes}
          displayProperty="code"
          valueProperty="id"
          placeholder="Search for a code..."
          onSelect={(code: CodeMaster | null) => setSelectedCode(code)}
          selectedItem={selectedCode}
          isLoading={isLoading}
        />
      </div>
      
      <div className="flex space-x-2">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Code Text
          </label>
          <Input
            value={newCodeText}
            onChange={(e) => setNewCodeText(e.target.value)}
            placeholder="Enter new code"
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={handleAddCode}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Add Code
          </Button>
        </div>
      </div>
    </div>
  );
};
