import { TextToCUI, DataItem } from "@/types";

// Base API URL - in a real app, this would be your backend URL
const API_BASE_URL = 'https://prospectivetool.raapidinc.com/research';

export async function fetchTextToCuis(type: string, item: DataItem): Promise<TextToCUI[]> {
  try {
    console.log(item);
    console.log(type);
    
    
    const response = await fetch(`${API_BASE_URL}/fetch/text-to-cuis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, masterDataItem: item })
    });

    if (!response.ok) {
      throw new Error(`Error fetching text-to-CUI details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch text-to-CUI details:", error);
    throw error;
  }
}
