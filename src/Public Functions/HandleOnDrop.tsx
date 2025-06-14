import { HandleOnDropProps } from '../Public Components/interfaces';

export function HandleOnDrop({ event, setFile }: HandleOnDropProps) {
  event.preventDefault();
  event.currentTarget.style.borderColor = '#d1d5db';
  event.currentTarget.style.background = '#fff';
  if (event.dataTransfer.files && event.dataTransfer.files[0]) {
    setFile(event.dataTransfer.files[0]);
  }
}
