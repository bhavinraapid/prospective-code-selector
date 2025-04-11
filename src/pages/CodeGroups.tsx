
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CodeMaster, CodeGroups as CodeGroupsType } from "@/types";
import { fetchCodes, fetchCodeGroups } from "@/services/api";
import { toast } from "sonner";
import { CodeGroupItem } from "@/components/CodeGroupItem";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { Button } from "@/components/ui/button";

export default function CodeGroups() {
  const { codeId } = useParams();
  const navigate = useNavigate();
  
  const [codes, setCodes] = useState<CodeMaster[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeMaster | null>(null);
  const [codeGroups, setCodeGroups] = useState<CodeGroupsType>([]);
  const [isLoadingCodes, setIsLoadingCodes] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Fetch code list on first load
  useEffect(() => {
    const fetchCodesList = async () => {
      try {
        const data = await fetchCodes();
        setCodes(data);
        
        // If there's a codeId in the URL, find and select that code
        if (codeId) {
          const found = data.find(code => code.id === Number(codeId));
          if (found) {
            setSelectedCode(found);
            fetchCodeGroupsData(Number(codeId));
          }
        }
      } catch (error) {
        console.error("Failed to fetch codes:", error);
        toast.error("Failed to load codes. Please try again.");
      } finally {
        setIsLoadingCodes(false);
      }
    };

    fetchCodesList();
  }, [codeId]);

  const fetchCodeGroupsData = async (id: number) => {
    setIsLoadingGroups(true);
    try {
      const data = await fetchCodeGroups(id);
      setCodeGroups(data);
    } catch (error) {
      console.error("Failed to fetch code groups:", error);
      toast.error("Failed to load code groups. Please try again.");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleCodeSelect = (code: CodeMaster) => {
    setSelectedCode(code);
    // Update URL to reflect selected code
    navigate(`/code-groups/${code.id}`);
    // Fetch code groups for selected code
    fetchCodeGroupsData(code.id);
  };

  const handleGroupDeleted = () => {
    // Refresh the code groups data after deletion
    if (selectedCode) {
      fetchCodeGroupsData(selectedCode.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Code Groups</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate(`/data-mapping/${codeId}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!codeId}
            >
              View Data Mapping
            </Button>
            <button
              onClick={() => navigate("/code-selector")}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Back to Code Selection
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
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
              isLoading={isLoadingCodes}
            />
          </div>
        </div>

        {selectedCode && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Code: {selectedCode.code} (ID: {selectedCode.id})
            </h2>
            
            {isLoadingGroups ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : codeGroups.length > 0 ? (
              codeGroups.map((group) => (
                <CodeGroupItem 
                  key={group.groupId} 
                  codeGroup={group} 
                  codeId={selectedCode.id}
                  onDelete={handleGroupDeleted}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No major indicator for this particular code.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
