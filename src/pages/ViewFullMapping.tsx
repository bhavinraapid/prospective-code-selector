
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ViewFullMappingSection } from "@/components/ViewFullMappingSection";

export default function ViewFullMapping() {
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
          <h1 className="text-2xl font-bold text-blue-800">View Full Mapping</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => navigate("/common-indicators")}
            className="bg-green-600 hover:bg-green-700"
          >
            Go to Common Indicators
          </Button>
          
          <Button
            onClick={() => navigate("/code-mapping")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Code Mapping
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ViewFullMappingSection 
          title="Labs" 
          type="labs" 
        />
        <ViewFullMappingSection 
          title="Physical Exam" 
          type="physicalExam" 
        />
        <ViewFullMappingSection 
          title="Treatment" 
          type="treatment" 
        />
        <ViewFullMappingSection 
          title="Medications" 
          type="medications" 
        />
      </div>
    </div>
  );
}
