import { SetStateAction } from "react";

export interface CalculateGreenAreaProps{
  area: string;
  mixingHeight: string;
  setRequiredGreenArea: React.Dispatch<SetStateAction<string>>;
}