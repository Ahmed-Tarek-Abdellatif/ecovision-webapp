export function HandleOnDragLeave(event: React.DragEvent<HTMLLabelElement>) {
  event.preventDefault();
  event.currentTarget.style.borderColor = '#d1d5db';
  event.currentTarget.style.background = '#fff';
}
