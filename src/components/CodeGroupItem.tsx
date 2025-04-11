
import { toast } from "sonner";
import { CodeGroup } from "@/types";
import { Button } from "@/components/ui/button";
import { deleteCodeGroup } from "@/services/api";
import { Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CodeGroupItemProps {
  codeGroup: CodeGroup;
  codeId: number;
  onDelete: () => void;
}

export function CodeGroupItem({ codeGroup, codeId, onDelete }: CodeGroupItemProps) {
  const handleDelete = async () => {
    try {
      const result = await deleteCodeGroup(codeId, codeGroup.groupId);
      
      if (result.success) {
        toast.success(result.message || "Group deleted successfully");
        onDelete();
      } else {
        toast.error(result.message || "Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const getCategoryTypeDisplay = (type: string): string => {
    switch(type) {
      case "LabData": return "Labs";
      case "PhysicalExam": return "Physical Exam";
      case "TreatmentPlan": return "Treatment";
      case "Medications": return "Medications";
      default: return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-blue-700">Group ID: {codeGroup.groupId}</h3>
          {codeGroup.client && (
            <p className="text-sm text-gray-600">Client: {codeGroup.client}</p>
          )}
        </div>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete Group
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category ID</TableHead>
            <TableHead>Code ID</TableHead>
            <TableHead>Frequency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codeGroup.majorMasters.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{getCategoryTypeDisplay(item.categoryType)}</TableCell>
              <TableCell>{item.text || "No description available"}</TableCell>
              <TableCell>{item.categoryId}</TableCell>
              <TableCell>{item.codeId}</TableCell>
              <TableCell>{item.frequency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
