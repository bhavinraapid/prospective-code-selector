import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataItem, TextToCUI } from "@/types";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { addMasterValue, fetchMasterItems, deleteMasterValue } from "@/services/masterApi";
import { fetchTextToCuis } from "@/services/textToCuiApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash } from "lucide-react";

interface AddMasterItemSectionProps {
  title: string;
  type: string;
}

export const AddMasterItemSection = ({ title, type }: AddMasterItemSectionProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<DataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [newItemText, setNewItemText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // New states
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [textToCuis, setTextToCuis] = useState<TextToCUI[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchMasterItems(type);
        setItems(data);
      } catch (error) {
        console.error(`Failed to fetch ${type} items:`, error);
        toast.error(`Failed to load ${title} items`);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [type, title]);

  const handleAddItem = async () => {
    if (!newItemText.trim()) {
      toast.error("Please enter text for the new item");
      return;
    }

    try {
      await addMasterValue(type, newItemText);
      toast.success(`${title} item added successfully`);
      setNewItemText("");
      
      // Refresh the page after successful addition
      navigate(0);
    } catch (error) {
      console.error(`Failed to add ${type} item:`, error);
      toast.error(`Failed to add ${title} item`);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) {
      toast.error("Please select an item to delete");
      return;
    }

    try {
      await deleteMasterValue({
        type,
        id: selectedItem.id,
        text: selectedItem.text
      });
      toast.success(`${title} item deleted successfully`);
      setSelectedItem(null);
      
      // Refresh the page after successful deletion
      navigate(0);
    } catch (error) {
      console.error(`Failed to delete ${type} item:`, error);
      toast.error(`Failed to delete ${title} item`);
    }
  };

  const handleViewDetails = async () => {
    if (!selectedItem) {
      toast.error("Please select an item to view details");
      return;
    }

    setIsLoadingDetails(true);
    setIsDetailsDialogOpen(true);

    try {
      const data = await fetchTextToCuis(type, selectedItem);
      setTextToCuis(data);
    } catch (error) {
      console.error(`Failed to fetch details for ${type} item:`, error);
      toast.error(`Failed to load details for ${title} item`);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Existing Item
        </label>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <SearchableDropdown
              items={items}
              displayProperty="text"
              valueProperty="id"
              placeholder={`Search for ${title.toLowerCase()}...`}
              onSelect={(item: DataItem | null) => setSelectedItem(item)}
              selectedItem={selectedItem}
              isLoading={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleViewDetails}
              disabled={!selectedItem}
              className="h-10"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedItem) {
                  setIsDeleteDialogOpen(true);
                } else {
                  toast.error("Please select an item to delete");
                }
              }}
              // disabled={!selectedItem} // uncomment this when you want to enable delete button 
              disabled={true}
              className="h-10"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Item Text
          </label>
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder={`Enter new ${title.toLowerCase()} text`}
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={handleAddItem}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Add {title}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.text}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Details for {selectedItem?.text}</DialogTitle>
          </DialogHeader>
          
          {isLoadingDetails ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-auto">
              {textToCuis.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Master ID</TableHead>
                      <TableHead>CUI</TableHead>
                      <TableHead>Text</TableHead>
                      <TableHead>CUI Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {textToCuis.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.cui}</TableCell>
                        <TableCell>{item.text}</TableCell>
                        <TableCell>{item.cui_type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4 text-gray-500">No details found</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
