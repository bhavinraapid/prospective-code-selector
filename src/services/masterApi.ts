
import { CodeMaster, DataItem, DeleteItemRequest } from "@/types";

// Base API URL - in a real app, this would be your backend URL
const API_BASE_URL = 'http://localhost:8081/research';

export async function addCodeToMaster(text: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/codes/addCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add code: ${response.status}`);
    }

    const message = await response.text(); // 👈 instead of response.json()
    console.log("Response:", message);
  } catch (error) {
    console.error("Failed to add code to master:", error);
    throw error;
  }
}


export async function fetchMasterItems(type: string): Promise<DataItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/master-items/${type}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching ${type} items: ${response.status}`);
    }

    const data: DataItem[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${type} items:`, error);
    throw error;
  }
}

export async function addMasterValue(type: string, text: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/master/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, text }), // sending object with type and text
    });

    if (!response.ok) {
      throw new Error(`Failed to add ${type} master value: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to add ${type} master value:`, error);
    throw error;
  }
}

export async function deleteMasterValue(request: DeleteItemRequest): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/master/delete-master-value`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting master value: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete item:`, error);
    throw error;
  }
}
