import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataSection } from "@/components/DataSection";
import { SelectedItemsList } from "@/components/SelectedItemsList";
import { DataItem, SelectedItem, DataCategory, CodeMaster } from "@/types";
import { 
  fetchDataForCode, 
  submitSelectedItems, 
  fetchCodeById, 
  fetchCodes,
  fetchClientList
} from "@/services/api";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function DataMapping() {
  const { codeId } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<SelectedItem[]>([]);
  const [codeDetails, setCodeDetails] = useState<CodeMaster | null>(null);
  const [allCodes, setAllCodes] = useState<CodeMaster[]>([]);
  const [clientList, setClientList] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  
  const [labsData, setLabsData] = useState<DataItem[]>([]);
  const [physicalExamData, setPhysicalExamData] = useState<DataItem[]>([]);
  const [treatmentData, setTreatmentData] = useState<DataItem[]>([]);
  const [medicationsData, setMedicationsData] = useState<DataItem[]>([]);
  const [mustRequiredConditionData, setMustRequiredConditionData] = useState<DataItem[]>([]);
  
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const getSelectedIdsForCategory = (category: DataCategory): number[] => {
    return selectedItems
      .filter(item => item.sourceTable === category)
      .map(item => item.id);
  };

  useEffect(() => {
    if (!codeId) {
      navigate("/");
      return;
    }

    const loadCodes = async () => {
      try {
        const codesData = await fetchCodes();
        setAllCodes(codesData);
      } catch (error) {
        console.error("Failed to fetch codes:", error);
      }
    };

    const loadClients = async () => {
      try {
        const clients = await fetchClientList();
        setClientList(clients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    loadCodes();
    loadClients();
    loadDataForCode(Number(codeId));
  }, [codeId, navigate]);

  const loadDataForCode = async (id: number) => {
    setIsLoading(true);
    try {
      const codeDetailsData = await fetchCodeById(id);
      setCodeDetails(codeDetailsData);

      const [labs, physicalExam, treatment, medications, mustRequiredCondition] = await Promise.all([
        fetchDataForCode(id, "labs"),
        fetchDataForCode(id, "physicalExam"),
        fetchDataForCode(id, "treatment"),
        fetchDataForCode(id, "medications"),
        fetchDataForCode(id, "mustRequiredCondition"),
      ]);

      setLabsData(labs);
      setPhysicalExamData(physicalExam);
      setTreatmentData(treatment);
      setMedicationsData(medications);
      setMustRequiredConditionData(mustRequiredCondition);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (item: DataItem, frequency: number, category: DataCategory) => {
    const isAlreadySelected = selectedItems.some(
      (selectedItem) => 
        selectedItem.id === item.id && 
        selectedItem.sourceTable === category
    );

    if (isAlreadySelected) {
      handleRemoveItem({
        id: item.id,
        text: item.text,
        sourceTable: category,
        frequency: frequency
      });
      return;
    }

    const newItem: SelectedItem = {
      id: item.id,
      text: item.text,
      sourceTable: category,
      frequency: frequency
    };

    setSelectedItems([...selectedItems, newItem]);
    toast.success(`Added ${item.text} to selections`);
  };

  const handleRemoveItem = (item: SelectedItem) => {
    setSelectedItems(
      selectedItems.filter(
        (selectedItem) => 
          !(selectedItem.id === item.id && 
            selectedItem.sourceTable === item.sourceTable)
      )
    );
  };

  const handleApplySelections = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsWithClient = selectedItems.map(item => ({
        ...item,
        client: selectedClient
      }));

      const result = await submitSelectedItems(
        Number(codeId),
        itemsWithClient,
        selectedClient
      );

      if (result.success) {
        setSubmittedItems([...itemsWithClient]);
        setShowSuccessSheet(true);
        toast.success(result.message || "Selections submitted successfully");
        setSelectedItems([]);
      } else {
        toast.error(result.message || "Failed to submit selections");
      }
    } catch (error) {
      console.error("Error submitting selections:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSelectedItems([]);
    }
  };

  const handleCodeChange = (code: CodeMaster) => {
    if (code) {
      navigate(`/data-mapping/${code.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-blue-800">
            Data Mapping for Code ID: {codeId} {codeDetails && `(${codeDetails.code})`}
          </h1>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-64">
              <SearchableDropdown
                items={allCodes}
                displayProperty="code"
                valueProperty="id"
                placeholder="Change code..."
                onSelect={handleCodeChange}
                selectedItem={codeDetails}
                isLoading={false}
              />
            </div>
            <Button
              onClick={() => navigate(`/code-groups/${codeId}`)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Check Groups
            </Button>
            <button
              onClick={() => navigate("/code-selector")}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Back to Code Selection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <DataSection
            title="Labs"
            items={labsData}
            onSelect={(item, frequency) => handleSelectItem(item, frequency, "labs")}
            isLoading={isLoading}
            sourceTable="labs"
            selectedItemIds={getSelectedIdsForCategory("labs")}
          />
          <DataSection
            title="Physical Exam"
            items={physicalExamData}
            onSelect={(item, frequency) => handleSelectItem(item, frequency, "physicalExam")}
            isLoading={isLoading}
            sourceTable="physicalExam"
            selectedItemIds={getSelectedIdsForCategory("physicalExam")}
          />
          <DataSection
            title="Treatment"
            items={treatmentData}
            onSelect={(item, frequency) => handleSelectItem(item, frequency, "treatment")}
            isLoading={isLoading}
            sourceTable="treatment"
            selectedItemIds={getSelectedIdsForCategory("treatment")}
          />
          <DataSection
            title="Medications"
            items={medicationsData}
            onSelect={(item, frequency) => handleSelectItem(item, frequency, "medications")}
            isLoading={isLoading}
            sourceTable="medications"
            selectedItemIds={getSelectedIdsForCategory("medications")}
          />
          <DataSection
            title="Must Required Condition"
            items={mustRequiredConditionData}
            onSelect={(item, frequency) => handleSelectItem(item, frequency, "mustRequiredCondition")}
            isLoading={isLoading}
            sourceTable="mustRequiredCondition"
            selectedItemIds={getSelectedIdsForCategory("mustRequiredCondition")}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Client Selection</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Client*
            </label>
            <Select
              value={selectedClient}
              onValueChange={setSelectedClient}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clientList.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-sm text-gray-500">
              *Client selection is required before submitting selections
            </p>
          </div>
        </div>

        <div className="mb-8">
          <SelectedItemsList
            items={selectedItems}
            onRemove={handleRemoveItem}
            onApply={handleApplySelections}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <Sheet open={showSuccessSheet} onOpenChange={setShowSuccessSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-green-600 flex items-center gap-2">
              <Check className="h-6 w-6" /> Submission Successful
            </SheetTitle>
            <SheetDescription>
              Your selected items have been successfully saved.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle className="text-green-700">Saved Data</AlertTitle>
              <AlertDescription>
                <p className="mb-2">The following items were saved to the database:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {submittedItems.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item.text} ({getCategoryTitle(item.sourceTable)}) - Frequency: {item.frequency}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-medium">Client: {selectedClient}</p>
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => setShowSuccessSheet(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function getCategoryTitle(key: string): string {
  switch (key) {
    case 'labs': return 'Labs';
    case 'physicalExam': return 'Physical Exam';
    case 'treatment': return 'Treatment';
    case 'medications': return 'Medications';
    case 'mustRequiredCondition': return 'Must Required Condition';
    default: return key;
  }
}
