
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, View } from "lucide-react";
import { CodeMasterMappingSection } from "@/components/CodeMasterMappingSection";

export default function CodeMapping() {
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
          <h1 className="text-2xl font-bold text-blue-800">Code Mapping</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => navigate("/common-indicators")}
            className="bg-green-600 hover:bg-green-700"
          >
            Go to Common Indicators
          </Button>
          
          <Button
            onClick={() => navigate("/view-full-mapping")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <View className="h-4 w-4 mr-1" />
            View Full Mapping
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <CodeMasterMappingSection 
          title="Labs" 
          type="labs" 
          showAdditionalFields={true} 
        />
        <CodeMasterMappingSection 
          title="Physical Exam" 
          type="physicalExam" 
          showAdditionalFields={false} 
        />
        <CodeMasterMappingSection 
          title="Treatment" 
          type="treatment" 
          showAdditionalFields={false} 
        />
        <CodeMasterMappingSection 
          title="Medications" 
          type="medications" 
          showAdditionalFields={false} 
        />
      </div>
    </div>
  );
}
