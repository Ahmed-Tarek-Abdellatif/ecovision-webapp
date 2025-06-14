import React, { SetStateAction } from 'react';
import { DataRow, HandleFilePreview } from '../Pages/AQI/Interface/Interface';

export interface CardProps {
  width: string;
  height: string;
  position: string;
  path: string;
  alt: string;
  style?: React.CSSProperties;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
}

export interface HeaderProps {
  details: string;
  header: string;
}

export interface GridProps {
  columns: string[];
}

export interface UploadProps {
  file: File | null;
  setFile: React.Dispatch<SetStateAction<File | null>>;
  data: DataRow[],
  setData: React.Dispatch<SetStateAction<DataRow[]>>,
  startDate: string,
  endDate: string,
  setStartDate:  React.Dispatch<SetStateAction<string>>,
  setEndDate:  React.Dispatch<SetStateAction<string>>,
  previewHover: boolean,
  setPreviewHover: React.Dispatch<SetStateAction<boolean>>,
  showPreview: boolean,
  setShowPreview: React.Dispatch<SetStateAction<boolean>>,
  showPreviewColDropdown: boolean,
  setShowPreviewColDropdown: React.Dispatch<SetStateAction<boolean>>,
  selectedPreviewColumns:string[],
  setSelectedPreviewColumns: React.Dispatch<SetStateAction<string[]>>,
  handleFilePreview?: (args: HandleFilePreview) => void;
  handleUpload?: () => void;
}

export interface HandleOnDropProps {
  event: React.DragEvent<HTMLLabelElement>;
  setFile: React.Dispatch<SetStateAction<File | null>>;
}
