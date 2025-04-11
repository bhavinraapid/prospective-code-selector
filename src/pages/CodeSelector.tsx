
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCodes } from "@/services/api";
import { CodeMaster } from "@/types";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function CodeSelector() {
  const [codes, setCodes] = useState<CodeMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<CodeMaster | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCodes = async () => {
      try {
        const data = await fetchCodes();
        setCodes(data);
      } catch (error) {
        console.error("Failed to fetch codes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCodes();
  }, []);

  const handleCodeSelect = (code: CodeMaster) => {
    setSelectedCode(code);
  };

  const handleContinue = () => {
    if (selectedCode) {
      navigate(`/data-mapping/${selectedCode.id}`);
    }
  };

  const handleViewGroups = () => {
    if (selectedCode) {
      navigate(`/code-groups/${selectedCode.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
          Medical Code Selector
        </h1>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">
            Medical Code Selector
          </h1>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a Code
          </label>
          <SearchableDropdown
            items={codes}
            displayProperty="code"
            valueProperty="id"
            placeholder="Search for a code..."
            onSelect={handleCodeSelect}
            selectedItem={selectedCode}
            isLoading={isLoading}
          />
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            disabled={!selectedCode}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              selectedCode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            Continue to Data Mapping
          </Button>
          
          <Button
            onClick={handleViewGroups}
            disabled={!selectedCode}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              selectedCode
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            View Code Groups
          </Button>
        </div>
        
        {/* Add Common Indicators Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={() => navigate("/common-indicators")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add Common Indicators
          </Button>
        </div>
      </div>
    </div>
  );
}
