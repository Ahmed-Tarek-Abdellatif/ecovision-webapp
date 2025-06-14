import { SetStateAction } from 'react';

export interface DataRow {
  [column: string]: string | number;
}
export interface PredictionRow {
  [column: string]: string | number;
}


export interface HandleFileChangeProps {
  event: React.ChangeEvent<HTMLInputElement>;
  setFile: React.Dispatch<SetStateAction<File | null>>;
}

export interface HandleUploadProps {
  file: File | null;
  setData: React.Dispatch<SetStateAction<DataRow[]>> ;
}
export interface DataTableProps {
  columns: string[];
  rows: Record<string, string | number>[];
  maxRows?: number;
}

export interface ColumnDropDownProps{
  columns, selectedColumns, setSelectedColumns, showDropdown, setShowDropdown, label ;
}


export interface HandleFilePreview{
  file: File | null;
  setShowPreview: React.Dispatch<SetStateAction<boolean>>,
   setData: React.Dispatch<SetStateAction<DataRow[]>> ;
}

export interface GreenAreaResult {
  greenArea: number;
  unit: string;
  gsf: number;
  factor: number;
}