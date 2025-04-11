
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeMaster, DataItem, CUIDetails } from "@/types";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { fetchMasterItems } from "@/services/masterApi";
import { fetchCodes } from "@/services/api";
import { fetchCuis, addCodeMapping } from "@/services/codeMapperApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeMasterMappingSectionProps {
  title: string;
  type: string;
  showAdditionalFields: boolean;
}

const RELATIONSHIP_OPTIONS = ["<", ">", "<=", ">=", "between","N/A"];

export const CodeMasterMappingSection = ({ 
  title, 
  type, 
  showAdditionalFields 
}: CodeMasterMappingSectionProps) => {
  const [masterItems, setMasterItems] = useState<DataItem[]>([]);
  const [codes, setCodes] = useState<CodeMaster[]>([]);
  const [selectedMasterItem, setSelectedMasterItem] = useState<DataItem | null>(null);
  const [selectedCode, setSelectedCode] = useState<CodeMaster | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCodeLoading, setIsCodeLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [isCuiDialogOpen, setIsCuiDialogOpen] = useState(false);
  const [cuiList, setCuiList] = useState<CUIDetails[]>([]);
  const [isCuiLoading, setIsCuiLoading] = useState(false);
  
  // Additional fields for Labs
  const [relationship, setRelationship] = useState<string>("N/A");
  const [value1, setValue1] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [exceptValue, setExceptValue] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchMasterItems(type);
        setMasterItems(data);
      } catch (error) {
        console.error(`Failed to fetch ${type} items:`, error);
        toast.error(`Failed to load ${title} items`);
      } finally {
        setIsLoading(false);
      }
    };

    const loadCodes = async () => {
      try {
        const data = await fetchCodes();
        setCodes(data);
      } catch (error) {
        console.error("Failed to fetch codes:", error);
        toast.error("Failed to load codes");
      } finally {
        setIsCodeLoading(false);
      }
    };

    loadItems();
    loadCodes();
  }, [type, title]);

  useEffect(() => {
    // Expand section when both items are selected
    if (selectedMasterItem && selectedCode) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [selectedMasterItem, selectedCode]);

  const handleFetchCuis = async () => {
    if (!selectedMasterItem || !selectedCode) {
      toast.error("Please select both a master item and a code");
      return;
    }

    setIsCuiLoading(true);
    try {
      const data = await fetchCuis(selectedMasterItem, selectedCode,type);
      setCuiList(data);
      setIsCuiDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch CUIs:", error);
      toast.error("Failed to fetch CUI details");
    } finally {
      setIsCuiLoading(false);
    }
  };

  const handleAddCodeMapping = async () => {
    if (!selectedMasterItem || !selectedCode) {
      toast.error("Please select both a master item and a code");
      return;
    }

    try {
      const payload = {
        masterDataItem: selectedMasterItem,
        codeMaster: selectedCode,
        relationship: showAdditionalFields ? relationship : null,
        value1: showAdditionalFields ? value1 : null,
        value2: showAdditionalFields ? value2 : null,
        unit: showAdditionalFields ? unit : null,
        exceptValue: showAdditionalFields ? exceptValue : null,
        comment: showAdditionalFields ? comment : null
      };
      
      await addCodeMapping(type, payload);
      toast.success("Code mapping added successfully");
      
      // Reset form
      setSelectedMasterItem(null);
      setSelectedCode(null);
      setRelationship("between");
      setValue1("");
      setValue2("");
      setUnit("");
      setExceptValue("");
      setComment("");
    } catch (error) {
      console.error("Failed to add code mapping:", error);
      toast.error("Failed to add code mapping");
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">{title} + CodeMaster Mapping</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select {title} Item
          </label>
          <SearchableDropdown
            items={masterItems}
            displayProperty="text"
            valueProperty="id"
            placeholder={`Search for ${title.toLowerCase()}...`}
            onSelect={(item: DataItem | null) => setSelectedMasterItem(item)}
            selectedItem={selectedMasterItem}
            isLoading={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Code
          </label>
          <SearchableDropdown
            items={codes}
            displayProperty="code"
            valueProperty="id"
            placeholder="Search for a code..."
            onSelect={(code: CodeMaster | null) => setSelectedCode(code)}
            selectedItem={selectedCode}
            isLoading={isCodeLoading}
          />
        </div>
      </div>

      {/* <div className="mb-4 flex justify-center">
        <Button 
          onClick={handleFetchCuis}
          disabled={!selectedMasterItem || !selectedCode || isCuiLoading}
          className="bg-blue-600 hover:bg-blue-700 w-1/2"
        >
          {isCuiLoading ? "Loading..." : "Fetch CUIs"}
        </Button>
      </div> */}

      {expanded && (
        <div className="mt-4 border-t pt-4">
          {showAdditionalFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <Select 
                  value={relationship} 
                  onValueChange={setRelationship}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value 1
                </label>
                <Input
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  placeholder="Enter value 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value 2
                </label>
                <Input
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  placeholder="Enter value 2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Enter unit"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Except Value
                </label>
                <Input
                  value={exceptValue}
                  onChange={(e) => setExceptValue(e.target.value)}
                  placeholder="Enter except value"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter comment"
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleAddCodeMapping}
              className="bg-green-600 hover:bg-green-700 w-1/2"
            >
              Add Code Mapping
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isCuiDialogOpen} onOpenChange={setIsCuiDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>CUI Details</DialogTitle>
          </DialogHeader>
          
          <div className="mb-2">
            <p className="text-sm">
              <strong>{title}:</strong> {selectedMasterItem?.text} 
              <br />
              <strong>Code:</strong> {selectedCode?.code}
            </p>
          </div>
          
          <ScrollArea className="h-[400px] rounded border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CUI</TableHead>
                  <TableHead>Text</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cuiList.length > 0 ? (
                  cuiList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.cui}</TableCell>
                      <TableCell>{item.text}</TableCell>
                      <TableCell>{item.cui_type}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No CUI details found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          
          <DialogFooter>
            <Button onClick={() => setIsCuiDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
