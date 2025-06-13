import { SetStateAction } from 'react';

export interface HandleFileChangeProps {
  event: React.ChangeEvent<HTMLInputElement>;
  setFile: React.Dispatch<SetStateAction<File | null>>;
}

export interface HandleUploadProps {
  file: File | null;
  setError: React.Dispatch<SetStateAction<string | null>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setData; // TODO: Someone Make this Datatype
  setPredictions; // TODO: Someone Make this Datatype
}

export interface HandleDownloadProps {
  predictions; // TODO: Someone Make this Datatype
}

export interface HandleDataColumnsChangeProps {
  event: React.ChangeEvent<HTMLOptionElement>;
  setSelectedDataColumns: React.Dispatch<SetStateAction<boolean>>;
}

export interface HandlePredColumnsChangeProps {
  event: React.ChangeEvent<HTMLOptionElement>;
  setSelectedPredColumns: React.Dispatch<SetStateAction<boolean>>;
}

export interface HandleDataColCheckboxProps {
  col; // TODO: Someone Make this Datatype
  setSelectedDataColumns : React.Dispatch<SetStateAction<>>; // TODO: Someone Make this Datatype
}

export interface HandlePredColCheckboxProps {
  col; // TODO: Someone Make this Datatype
  setSelectedPredColumns : React.Dispatch<SetStateAction<>>; // TODO: Someone Make this Datatype
}
