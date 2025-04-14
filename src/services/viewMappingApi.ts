
import { CodeMappingObject, CodeMaster, DataItem } from "@/types";

import { API_BASE_URL } from '@/config';


export async function fetchCodeMappingData(item: DataItem, code: CodeMaster, type: string): Promise<CodeMappingObject[]> {
  try {
     const response = await fetch(`${API_BASE_URL}/get/code-mapping-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ masterDataItem: item, codeMaster: code, type }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching code mapping data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch code mapping data:", error);
    throw error;
  }
}



export async function deleteCodeMapping(
  masterDataItem: DataItem,
  codeMaster: CodeMaster,
  type: string
): Promise<String> {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/code-mapping-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        masterDataItem,
        codeMaster
      })
    });

    if (!response.ok) {
      throw new Error(`Error deleting code mapping: ${response.status}`);
    }

    const message =  await response.text();
    console.log(message);
    return message;    
  } catch (error) {
    console.error("Failed to delete code mapping:", error);
    throw error;
  }
}