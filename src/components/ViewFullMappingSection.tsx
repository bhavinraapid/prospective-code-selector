import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CodeMaster, DataItem, CodeMappingObject } from "@/types";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { fetchMasterItems } from "@/services/masterApi";
import { fetchCodes } from "@/services/api";
import { fetchCodeMappingData, deleteCodeMapping } from "@/services/viewMappingApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash } from "lucide-react";

interface ViewFullMappingSectionProps {
  title: string;
  type: string;
}

export const ViewFullMappingSection = ({ 
  title, 
  type 
}: ViewFullMappingSectionProps) => {
  const [masterItems, setMasterItems] = useState<DataItem[]>([]);
  const [codes, setCodes] = useState<CodeMaster[]>([]);
  const [selectedMasterItem, setSelectedMasterItem] = useState<DataItem | null>(null);
  const [selectedCode, setSelectedCode] = useState<CodeMaster | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCodeLoading, setIsCodeLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mappingData, setMappingData] = useState<CodeMappingObject[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  const handleViewDataMapping = async () => {
    if (!selectedMasterItem || !selectedCode) {
      toast.error("Please select both a master item and a code");
      return;
    }

    setIsDataLoading(true);
    try {
      const data = await fetchCodeMappingData(selectedMasterItem, selectedCode, type);
      setMappingData(data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch mapping data:", error);
      toast.error("Failed to fetch mapping data");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleDeleteMapping = async () => {
    if (!selectedMasterItem || !selectedCode) {
      toast.error("Please select both a master item and a code");
      return;
    }
    
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCodeMapping(selectedMasterItem!, selectedCode!, type);
      toast.success("Mapping deleted successfully");
      // Refresh data if needed
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete mapping:", error);
      toast.error("Failed to delete mapping");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
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

      <div className="mb-4 flex justify-center gap-4">
        <Button 
          onClick={handleViewDataMapping}
          disabled={!selectedMasterItem || !selectedCode || isDataLoading}
          className="bg-blue-600 hover:bg-blue-700 w-1/3"
        >
          {isDataLoading ? "Loading..." : "View Data Mapping"}
        </Button>

        <Button 
          onClick={handleDeleteMapping}
          disabled={!selectedMasterItem || !selectedCode || isDeleting}
          variant="destructive"
          className="w-1/3"
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete Mapping
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Code Mapping Data</DialogTitle>
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
                  <TableHead>Code</TableHead>
                  <TableHead>CUI</TableHead>
                  <TableHead>Text</TableHead>
                  <TableHead>Type</TableHead>
                  {type === 'labs' && (
                    <>
                      <TableHead>Unit</TableHead>
                      <TableHead>Value 1</TableHead>
                      <TableHead>Value 2</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappingData.length > 0 ? (
                  mappingData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.cui}</TableCell>
                      <TableCell>{item.text}</TableCell>
                      <TableCell>{item.cuiType}</TableCell>
                      {type === 'labs' && (
                        <>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.value1}</TableCell>
                          <TableCell>{item.value2}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={type === 'labs' ? 7 : 4} className="text-center">
                      No mapping data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mapping between{' '}
              <strong>{selectedMasterItem?.text}</strong> and code{' '}
              <strong>{selectedCode?.code}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting} 
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
