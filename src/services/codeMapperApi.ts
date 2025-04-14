
import { CodeMaster, DataItem, CUIDetails } from "@/types";

import { API_BASE_URL } from '@/config';

export async function fetchCuis(masterItem: DataItem, code: CodeMaster, type:string): Promise<CUIDetails[]> {
  try {
     const response = await fetch(`${API_BASE_URL}/api/cuis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ masterItem, code, type })
    });

    if (!response.ok) {
      throw new Error(`Error fetching CUIs: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch CUIs:", error);
    throw error;
  }
}

export async function addCodeMapping(type: string, payload: any): Promise<void> {
  try {
    console.log(type)
    console.log(payload);
    
     const response = await fetch(`${API_BASE_URL}/add/add-code-mapping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload })
    });

    if (!response.ok) {
      throw new Error(`Error adding code mapping: ${response.status}`);
    }

    const message = await response.text();
    console.log(message); 
  } catch (error) {
    console.error(`Failed to add code mapping for ${type}:`, error);
    throw error;
  }
}


export async function deleteCodeMapping(type: string, masterItem: DataItem, code: CodeMaster): Promise<void> {
  try {
    const response = await fetch('/api/delete-code-mapping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type, 
        masterItem,
        code
      })
    });

    if (!response.ok) {
      throw new Error(`Error deleting code mapping: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to delete code mapping for ${type}:`, error);
    throw error;
  }
}