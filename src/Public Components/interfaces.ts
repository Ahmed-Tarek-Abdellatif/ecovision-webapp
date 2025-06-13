import React, { SetStateAction } from 'react';

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
  setData; // TODO: Someone Make this Datatype
}

export interface HandleOnDropProps {
  event: React.DragEvent<HTMLLabelElement>;
  setFile: React.Dispatch<SetStateAction<File | null>>;
}
