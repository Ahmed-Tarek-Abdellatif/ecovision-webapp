import { CalculateGreenAreaProps } from "../Interface/Interface";

export const calculateGreenArea = ({area, mixingHeight, setRequiredGreenArea} : CalculateGreenAreaProps) => {
  if (area && mixingHeight) {
    const result = (parseFloat(area) * parseFloat(mixingHeight)) / 10000; // Convert to hectares
    setRequiredGreenArea(result.toFixed(2));
  } else {
    alert('Please fill in both fields.');
  }
};
