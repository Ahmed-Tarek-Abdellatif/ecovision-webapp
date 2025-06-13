import { HandleFileChangeProps, HandleUploadProps } from "../Interface/Interface";
import Papa from "papaparse";

export const handleFileChange = ({event, setFile} : HandleFileChangeProps ) => {
  if (event.target.files) {
    setFile(event.target.files[0]);
  }
};

export const handleUpload = ({file, setData} : HandleUploadProps) => {
  if (file) {
    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data;
        if (rows.length > 19) {
          setData(rows.slice(0, 20));
        } else {
          setData(rows);
        }
      },
      header: true,
    });
  } else {
    alert("Please select a file first.");
  }
};
