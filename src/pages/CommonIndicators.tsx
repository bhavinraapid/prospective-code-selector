import { AddCodeSection } from "@/components/AddCodeSection";
import { AddMasterItemSection } from "@/components/AddMasterItemSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Eye } from "lucide-react";

export default function CommonIndicators() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/code-selector")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-blue-800">Common Indicators</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => navigate("/view-full-mapping")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Full Mapping
          </Button>
          
          <Button
            onClick={() => navigate("/code-mapping")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Code className="h-4 w-4 mr-1" />
            Add Code Mapping
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <AddCodeSection />
        
        <AddMasterItemSection title="Labs" type="labs" />
        <AddMasterItemSection title="Physical Exam" type="physicalExam" />
        <AddMasterItemSection title="Treatment" type="treatment" />
        <AddMasterItemSection title="Medications" type="medications" />
      </div>
    </div>
  );
}
