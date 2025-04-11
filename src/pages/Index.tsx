
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 p-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-blue-800">
          Medical Code Gateway
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive solution for selecting medical codes and mapping them to labs, physical exams, treatments, and medications.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/code-selector")}
            className="w-64 py-6 text-lg bg-blue-600 hover:bg-blue-700"
          >
            Start Code Selection
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Efficient Workflow</h3>
            <p className="text-gray-600">
              Streamline your coding process with our intuitive interface designed for healthcare professionals.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Comprehensive Mapping</h3>
            <p className="text-gray-600">
              Easily map codes to labs, physical exams, treatments, and medications in one unified system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
