import { HandleFileChangeProps } from "../Pages/WQI/Interface/Interface";

export const handleFileChange = ({ event, setFile }: HandleFileChangeProps) => {
  if (event.target.files) {
    setFile(event.target.files[0]);
  }
};
