export interface CodeMaster {
  id: number;
  code: string;
}

export interface DataItem {
  id: number;
  text: string;
}

export interface SelectedItem {
  id: number;
  text: string;
  sourceTable: string;
  frequency: number;
  client?: string;
}

export interface DeleteItemRequest {
  type: string;
  id: number;
  text: string;
}

export type DataCategory = 'labs' | 'physicalExam' | 'treatment' | 'medications' | 'mustRequiredCondition';

export interface MajorMaster {
  id: number;
  groupId: number;
  categoryType: string;
  categoryId: number;
  codeId: number;
  frequency: number;
  text?: string;
}

export interface CodeGroup {
  groupId: number;
  client?: string;
  majorMasters: MajorMaster[];
}

export type CodeGroups = CodeGroup[];

export interface CUIDetails {
  cui: string;
  text: string;
  cui_type: string;
}

export interface CodeMappingObject {
  code: string;
  cui: string;
  text: string;
  cuiType: string;
  unit: string;
  value1: string;
  value2: string;
  codeId: number;
  masterId: number;
  relationship: string
}


// New type for text-to-CUI mapping data
export interface TextToCUI {
  cui: string;
  text: string;
  cui_type: string;
  id: number;
}
