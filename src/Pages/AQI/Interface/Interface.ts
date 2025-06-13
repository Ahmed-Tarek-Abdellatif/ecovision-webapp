import { SetStateAction } from 'react';

export interface HandleFileChangeProps {
  event: React.ChangeEvent<HTMLInputElement>;
  setFile: React.Dispatch<SetStateAction<File | null>>;
}

export interface HandleUploadProps {
  file: File | null;
  setData: React.Dispatch<SetStateAction<string | null>> ; // TODO: Someone Make this Datatype
}
