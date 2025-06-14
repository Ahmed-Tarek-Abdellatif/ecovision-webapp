import { HandleFileChangeProps, HandleFilePreview, HandleUploadProps } from '../Interface/Interface';
import Papa from 'papaparse';

export const handleUpload = ({ file, setData }: HandleUploadProps) => {
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
    alert('Please select a file first.');
  }
};

export const handleFileChange = ({ event, setFile }: HandleFileChangeProps) => {
  if (event.target.files) {
    setFile(event.target.files[0]);
  }
};


export const handleFilePreview = ({file, setShowPreview, setData}: HandleFilePreview) => {
    if (!file) return;
    setShowPreview((prev) => {
      if (!prev) {
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
      }
      return !prev;
    });
  };