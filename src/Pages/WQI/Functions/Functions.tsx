import Papa from 'papaparse';
import axios from 'axios';
import { HandleDataColCheckboxProps, HandleDataColumnsChangeProps, HandleDownloadProps, HandlePredColCheckboxProps, HandlePredColumnsChangeProps, HandleUploadProps } from '../Interface/Interface';


export const handleUpload = async ({ file, setLoading, setError, setData, setPredictions } : HandleUploadProps) => {
  if (!file) {
    alert('Please select a file first.');
    return;
  }

  setLoading(true);
  setError(null);

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

  const token = localStorage.getItem('accessToken');

  if (!token) {
    setError('Authentication required. Please log in.');
    setLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3000/api/predict/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    setPredictions(response.data.predictions);
  } catch (err) {
    setError('Failed to upload or predict. Please try again.');
    console.error('Error response:', err.response);
  } finally {
    setLoading(false);
  }
};

export const handleDownload = ({ predictions } : HandleDownloadProps) => {
  const predictionData: (string | number)[][] = [];

  const headers = Object.keys(predictions[0] || {});
  predictionData.push(headers);

  predictions.forEach((row) => {
    const rowData = headers.map((header) => row[header]);
    predictionData.push(rowData);
  });

  const csv = Papa.unparse(predictionData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'predictions.csv');
  link.click();
};

export const handleDataColumnsChange = ({ event, setSelectedDataColumns } : HandleDataColumnsChangeProps) => {
  const options = Array.from(event.target.selectedOptions).map((o) => o.value);
  setSelectedDataColumns(options.slice(0, 5));
};
export const handlePredColumnsChange = ({ event, setSelectedPredColumns } : HandlePredColumnsChangeProps) => {
  const options = Array.from(event.target.selectedOptions).map((o) => o.value);
  setSelectedPredColumns(options.slice(0, 5));
};

export const handleDataColCheckbox = ({ col, setSelectedDataColumns } : HandleDataColCheckboxProps) => {
  setSelectedDataColumns((prev) => {
    if (prev.includes(col)) return prev.filter((c) => c !== col);
    if (prev.length < 5) return [...prev, col];
    return prev;
  });
};
export const handlePredColCheckbox = ({ col, setSelectedPredColumns } : HandlePredColCheckboxProps) => {
  setSelectedPredColumns((prev) => {
    if (prev.includes(col)) return prev.filter((c) => c !== col);
    if (prev.length < 5) return [...prev, col];
    return prev;
  });
};


