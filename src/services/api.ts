import { CodeMaster, DataItem, SelectedItem, CodeGroups } from '@/types';
// import the base URL from config
import { API_BASE_URL } from '@/config';



export const fetchCodes = async (): Promise<CodeMaster[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/codes`);
    if (!response.ok) {
      throw new Error(`Error fetching codes: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch codes:", error);
    // Return mock data as fallback for development
    return [
      { id: 1, code: "A00.1" },
      { id: 2, code: "A01.2" },
      { id: 3, code: "B20.3" },
      { id: 4, code: "C10.4" },
      { id: 5, code: "D30.5" },
      { id: 6, code: "E50.6" },
      { id: 7, code: "F70.7" },
      { id: 8, code: "G80.8" },
      { id: 9, code: "H90.9" }
    ];
  }
};

export const fetchCodeById = async (codeId: number): Promise<CodeMaster> => {
  try {
    const response = await fetch(`${API_BASE_URL}/codes/${codeId}`);
    if (!response.ok) {
      throw new Error(`Error fetching code: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch code details:", error);
    // Return mock data as fallback for development
    const codeMocks: Record<number, string> = {
      1: "A00.1",
      2: "A01.2",
      3: "B20.3",
      4: "C10.4",
      5: "D30.5",
      6: "E50.6",
      7: "F70.7",
      8: "G80.8",
      9: "H90.9"
    };
    
    return { 
      id: codeId, 
      code: codeMocks[codeId] || `Code-${codeId}` 
    };
  }
};

export const fetchDataForCode = async (
  codeId: number, 
  category: string
): Promise<DataItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/codes/${codeId}/${category}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${category} data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${category} data:`, error);
    // Return mock data as fallback for development
    return [];
    
  }
};

export const fetchClientList = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`);
    if (!response.ok) {
      throw new Error(`Error fetching clients: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    // Return mock data as fallback for development
    return [
      "ABC Healthcare", 
      "MNC Medical", 
      "XYZ Hospital", 
      "Global Health", 
      "City Clinic"
    ];
  }
};

export const submitSelectedItems = async (
  codeId: number,
  selectedItems: SelectedItem[],
  client: string
): Promise<{ success: boolean; message?: string }> => {
  console.log("Submitting selected items:", {
    codeId,
    selectedItems,
    client
  });
  
  try {
    // Send full details of selected items including text, category, frequency and client
    const response = await fetch(`${API_BASE_URL}/addGroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codeId,
        selectedItems,
        client
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error submitting data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to submit data:", error);
    // Return success response for development
    return { 
      success: true,
      message: "Selections saved successfully (mock response)" 
    };
  }
};

export const fetchCodeGroups = async (codeId: number): Promise<CodeGroups> => {
  try {
    const response = await fetch(`${API_BASE_URL}/codes/groups/${codeId}`);
    if (!response.ok) {
      throw new Error(`Error fetching code groups: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch code groups:", error);
    // Return mock data as fallback for development
    return [
      
    ];
  }
};

export const deleteCodeGroup = async (
  codeId: number,
  groupId: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/codes/groups/delete/${codeId}/${groupId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting code group: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to delete code group:", error);
    // Return success response for development
    return { 
      success: true, 
      message: "Group deleted successfully (mock response)" 
    };
  }
};
