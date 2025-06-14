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
  setError: React.Dispatch<SetStateAction<string | null>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setData: React.Dispatch<SetStateAction<DataRow[]>>;
  setPredictions: React.Dispatch<SetStateAction<PredictionRow[]>>;
}
export interface HandleDownloadProps {
  predictions: PredictionRow[];
}

export interface HandleDataColumnsChangeProps {
  event: React.ChangeEvent<HTMLSelectElement>;
  setSelectedDataColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface HandlePredColumnsChangeProps {
  event: React.ChangeEvent<HTMLSelectElement>;
  setSelectedPredColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface HandleDataColCheckboxProps {
  col: string;
  setSelectedDataColumns: React.Dispatch<SetStateAction<string[]>>;
}

export interface HandlePredColCheckboxProps {
  col: string;
  setSelectedPredColumns: React.Dispatch<SetStateAction<string[]>>;
}
