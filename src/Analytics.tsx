import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Chart from 'chart.js/auto';
import Papa from 'papaparse';
import {
  sampleCorrelation,
  linearRegression,
  linearRegressionLine,
  mean,
  standardDeviation,
  min,
  max,
} from 'simple-statistics';

import './App.css';

// Type definitions
interface StatusMessage {
  text: string;
  isSuccess: boolean;
  isWarning: boolean;
}

interface GasStatistics {
  min: number;
  max: number;
  avg: number;
  stdDev: number;
  trend: string;
  trendPercentage: string;
}

interface GasPredictions {
  [key: string]: number[];
}

interface GasStatisticsMap {
  [key: string]: GasStatistics;
}

interface DataRow {
  [key: string]: any;
}

interface AnalyticsProps {
  data?: DataRow[];
  qualityIndexField?: string;
  dateField?: string;
}

const rowsPerPage = 100;

// 1. Make chart containers larger and consistent
const chartContainerStyle = {
  width: '100%',
  height: '480px', // Increased height for all main charts
  maxWidth: '100%',
  margin: '0 auto',
};

// 2. AQI Classification Legend with colors
const AQI_CLASSES = [
  { label: 'Good', color: '#4caf50' },
  { label: 'Moderate', color: '#cddc39' },
  { label: 'Unhealthy for Sensitive Groups', color: '#ffeb3b' },
  { label: 'Unhealthy', color: '#ff9800' },
  { label: 'Very Unhealthy', color: '#f44336' },
  { label: 'Hazardous', color: '#6a1b9a' },
];

const Analytics: React.FC<AnalyticsProps> = ({ data, qualityIndexField: propQualityIndexField, dateField: propDateField }) => {
  // State variables
  const [fullDataset, setFullDataset] = useState<DataRow[]>(data || []);
  const [displayDataset, setDisplayDataset] = useState<DataRow[]>(data || []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numericFields, setNumericFields] = useState<string[]>([]);
  const [dateFields, setDateFields] = useState<string[]>([]);
  const [excludedDateFields, setExcludedDateFields] = useState<string[]>([]);
  const [qualityIndexField, setQualityIndexField] = useState<string | null>(propQualityIndexField || null);
  const [dateField, setDateField] = useState<string | null>(propDateField || null);
  const [indexType, setIndexType] = useState<'AQI' | 'WQI' | string>('AQI');
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ text: '', isSuccess: false, isWarning: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [gasPredictions, setGasPredictions] = useState<GasPredictions>({});
  const [gasStatistics, setGasStatistics] = useState<GasStatisticsMap>({});
  const [filename, setFilename] = useState<string>('No file selected');
  const [avgValue, setAvgValue] = useState<number>(0);
  const [selectedGas, setSelectedGas] = useState<string | null>(null);

  // Refs
  const mainChartRef = useRef<HTMLCanvasElement | null>(null);
  const correlationChartRef = useRef<HTMLCanvasElement | null>(null);
  const predictionChartRef = useRef<HTMLCanvasElement | null>(null);
  const gasChartRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Chart instances
  const mainChartInstance = useRef<Chart | null>(null);
  const correlationChartInstance = useRef<Chart | null>(null);
  const predictionChartInstance = useRef<Chart | null>(null);
  const gasChartInstance = useRef<Chart | null>(null);

  // Status message effect
  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => {
        setStatusMessage({ text: '', isSuccess: false, isWarning: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Show status helper
  const showStatus = (message: string, isSuccess: boolean, isWarning = false) => {
    setStatusMessage({ text: message, isSuccess, isWarning });
  };

  // File upload handler
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFullDataset([]);
    setDisplayDataset([]);
    setDateFields([]);
    setExcludedDateFields([]);
    setQualityIndexField(null);
    setDateField(null);
    setPredictionData(null);
    setGasPredictions({});
    setGasStatistics({});
    setSelectedGas(null);
    setFilename(file.name);
    setIsLoading(true);

    // === Send file to backend for prediction ===
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('start_date', new Date().toISOString().slice(0, 10)); // Use today as default
      formData.append('standard', 'us');
      const response = await fetch('http://localhost:8080/predict-from-csv', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result && result.results) {
        // Use the predicted data as the dataset
        setFullDataset(result.results);
        setDisplayDataset(result.results);
        // Set the AQI column as the quality index field
        setQualityIndexField('max_aqi');
        // Set date field if present
        setDateField('timestamp');
        // Identify numeric fields
        const numFields = Object.keys(result.results[0] || {}).filter(
          key => key !== 'timestamp' && typeof result.results[0][key] === 'number'
        );
        setNumericFields(numFields);
        setIndexType('AQI');
        showStatus(`Successfully loaded ${result.results.length} predicted records from backend`, true);
      } else {
        showStatus('No predictions returned from backend.', false);
      }
    } catch (error: any) {
      showStatus('Error uploading or predicting: ' + error.message, false);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse JSON data
  const parseJSON = (content: string) => {
    try {
      const data = JSON.parse(content);
      setFullDataset(data);
      processData(data);
      showStatus(`Successfully loaded ${data.length} records from JSON file`, true);
      setIsLoading(false);
    } catch (error: any) {
      showStatus('Error parsing JSON: ' + error.message, false);
      setIsLoading(false);
    }
  };

  // Parse CSV data
  const parseCSV = (content: string) => {
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results: any) => {
        if (results.errors.length > 0) {
          showStatus('CSV parsing errors: ' + results.errors.map(e => e.message).join(', '), false);
        }
        const data = results.data.filter(row => Object.keys(row).length > 0);
        setFullDataset(data);
        processData(data);
        showStatus(`Successfully loaded ${data.length} records from CSV file`, true);
        setIsLoading(false);
      },
      error: (error: any) => {
        showStatus('CSV parsing error: ' + error.message, false);
        setIsLoading(false);
      }
    });
  };

  // Process data after loading
  const processData = (data: DataRow[]) => {
    if (data.length === 0) {
      showStatus('No valid data found in the file', false);
      return;
    }
    let displayData: DataRow[] = [];
    if (data.length > 10000) {
      const sampleSize = Math.min(5000, data.length);
      const step = Math.floor(data.length / sampleSize);
      for (let i = 0; i < data.length; i += step) {
        displayData.push(data[i]);
        if (displayData.length >= 5000) break;
      }
      showStatus(`Using representative sample of ${displayData.length} records from ${data.length} total records`, true);
    } else {
      displayData = [...data];
    }
    setDisplayDataset(displayData);
    // Detect date fields
    const detectedDateFields = detectDateFields(displayData);
    setDateFields(detectedDateFields);
    setExcludedDateFields([...detectedDateFields]);
    // Detect quality index field
    const qualityField = detectQualityIndexField(displayData);
    setQualityIndexField(qualityField);
    // Set date field for time series
    setDateField(detectedDateFields.length > 0 ? detectedDateFields[0] : null);
    // Identify numeric fields
    const numFields = findNumericFields(displayData, detectedDateFields);
    setNumericFields(numFields);
    // Set index type
    if (qualityField) {
      const fieldLower = qualityField.toLowerCase();
      setIndexType(fieldLower.includes('aqi') ? 'AQI' : 'WQI');
    }
  };

  // Function to detect date fields
  const detectDateFields = (data: DataRow[]): string[] => {
    if (data.length === 0) return [];
    const dateKeywords = ['date', 'time', 'year', 'month', 'day', 'timestamp', 'dob', 'birth', 'created', 'modified'];
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{4}\/\d{2}\/\d{2}$/,
      /^\d{2}-\d{2}-\d{4}$/,
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      /^\d{1,2}-\d{1,2}-\d{4}$/
    ];
    const fields = Object.keys(data[0]);
    const detectedDateFields: string[] = [];
    fields.forEach(field => {
      const fieldLower = field.toLowerCase();
      if (dateKeywords.some(keyword => fieldLower.includes(keyword))) {
        detectedDateFields.push(field);
        return;
      }
      const sampleValues: string[] = [];
      const maxSamples = Math.min(20, data.length);
      for (let i = 0; i < maxSamples; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const value = data[randomIndex][field];
        if (value !== null && value !== undefined && value !== '') {
          sampleValues.push(String(value));
        }
      }
      if (sampleValues.length > 0) {
        const dateMatches = sampleValues.filter(val =>
          dateFormats.some(format => format.test(val))
        );
        if (dateMatches.length / sampleValues.length > 0.5) {
          detectedDateFields.push(field);
        }
      }
    });
    return detectedDateFields;
  };

  // Function to detect quality index field (AQI or WQI)
  const detectQualityIndexField = (data: DataRow[]): string | null => {
    if (data.length === 0) return null;
    const aqiKeywords = ['aqi', 'air quality', 'index', 'quality index', 'pollution'];
    const wqiKeywords = ['wqi', 'water quality', 'water index', 'water quality index'];
    const fields = Object.keys(data[0]);
    for (let field of fields) {
      const fieldLower = field.toLowerCase();
      if (aqiKeywords.some(keyword => fieldLower.includes(keyword))) {
        return field;
      }
    }
    for (let field of fields) {
      const fieldLower = field.toLowerCase();
      if (wqiKeywords.some(keyword => fieldLower.includes(keyword))) {
        return field;
      }
    }
    for (let field of fields) {
      const fieldLower = field.toLowerCase();
      if (fieldLower.includes('index') || fieldLower.includes('quality')) {
        return field;
      }
    }
    return null;
  };

  const findNumericFields = (data: DataRow[], dateFields: string[]): string[] => {
    if (data.length === 0) return [];
    const fields: string[] = [];
    const sampleItem = data[0];
    for (let field in sampleItem) {
      if (dateFields.includes(field)) continue;
      let isNumeric = true;
      let numericCount = 0;
      for (let i = 0; i < Math.min(20, data.length); i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const value = data[randomIndex][field];
        if (value === null || value === undefined || value === '') continue;
        if (isNaN(parseFloat(value)) || !isFinite(value)) {
          isNumeric = false;
          break;
        } else {
          numericCount++;
        }
      }
      if (isNumeric && numericCount > 0) {
        fields.push(field);
      }
    }
    return fields;
  };

  // Update dashboard with current data
  useEffect(() => {
    if (displayDataset.length > 0 && qualityIndexField) {
      const values = displayDataset.map(item => parseFloat(item[qualityIndexField!])).filter(v => !isNaN(v));
      const total = values.length;
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = total > 0 ? sum / total : 0;
      setAvgValue(avg);
    }
    if (displayDataset.length > 0) {
      updateCharts();
    } else {
      createEmptyCharts();
    }
    // Automatically run predictions when data is available
    if (dateField && numericFields.length > 0 && Object.keys(gasPredictions).length === 0) {
      runGasPredictions();
    }
    // Automatically run main prediction
    if (dateField && qualityIndexField) {
      runPrediction();
    }
    // eslint-disable-next-line
  }, [displayDataset, qualityIndexField, dateField, numericFields]);

  // Sync props to state when they change (for embedding)
  useEffect(() => {
    if (data && data.length > 0) {
      setFullDataset(data);
      setDisplayDataset(data);
      // Only update qualityIndexField/dateField if provided as props
      if (propQualityIndexField) setQualityIndexField(propQualityIndexField);
      if (propDateField) setDateField(propDateField);
      // Recompute numeric fields
      const detectedDateFields = detectDateFields(data);
      setDateFields(detectedDateFields);
      setExcludedDateFields([...detectedDateFields]);
      const numFields = findNumericFields(data, detectedDateFields);
      setNumericFields(numFields);
    }
  }, [data, propQualityIndexField, propDateField]);

  // Create empty placeholder charts
  const createEmptyCharts = () => {
    if (mainChartRef.current && correlationChartRef.current && predictionChartRef.current && gasChartRef.current) {
      const emptyConfig = {
        type: 'bar' as const,
        data: {
          labels: ['No Data'],
          datasets: [{
            label: 'No Data',
            data: [0],
            backgroundColor: 'rgba(200, 200, 200, 0.6)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Upload data to see visualization',
              font: { size: 16 }
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      };
      if (mainChartInstance.current) mainChartInstance.current.destroy();
      if (correlationChartInstance.current) correlationChartInstance.current.destroy();
      if (predictionChartInstance.current) predictionChartInstance.current.destroy();
      if (gasChartInstance.current) gasChartInstance.current.destroy();
      mainChartInstance.current = new Chart(mainChartRef.current, emptyConfig);
      correlationChartInstance.current = new Chart(correlationChartRef.current, emptyConfig);
      const predictionConfig = {
        type: 'line' as const,
        data: {
          labels: ['No Data'],
          datasets: [{
            label: 'No Data',
            data: [0],
            backgroundColor: 'rgba(200, 200, 200, 0.1)',
            borderColor: 'rgba(200, 200, 200, 0.6)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Upload data to see visualization'
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      };
      predictionChartInstance.current = new Chart(predictionChartRef.current, predictionConfig);
      gasChartInstance.current = new Chart(gasChartRef.current, predictionConfig);
    }
  };

  // Update charts with current data
  const updateCharts = () => {
    if (displayDataset.length > 0) {
      createCharts();
    } else {
      createEmptyCharts();
    }
  };

  // Create charts with actual data
  const createCharts = () => {
    if (mainChartInstance.current) mainChartInstance.current.destroy();
    if (correlationChartInstance.current) correlationChartInstance.current.destroy();
    if (predictionChartInstance.current) predictionChartInstance.current.destroy();
    if (gasChartInstance.current) gasChartInstance.current.destroy();
    createMainChart();
    createCorrelationChart();
    createPredictionChart();
    createGasChart(); // <-- Add this line
  };

  // Main chart (distribution)
  const createMainChart = () => {
    if (!mainChartRef.current || !qualityIndexField) return;
    const values = displayDataset.map(item => parseFloat(item[qualityIndexField])).filter(v => !isNaN(v));
    if (values.length === 0) return;
    const minValue = min(values);
    const maxValue = max(values);
    const range = maxValue - minValue;
    const binCount = 10;
    const binSize = range / binCount;
    const bins = Array.from({ length: binCount }, (_, i) => {
      const start = minValue + i * binSize;
      const end = start + binSize;
      return `${start.toFixed(1)}-${end.toFixed(1)}`;
    });
    const frequencies = Array(binCount).fill(0);
    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - minValue) / binSize), binCount - 1);
      frequencies[binIndex]++;
    });
    mainChartInstance.current = new Chart(mainChartRef.current, {
      type: 'bar',
      data: {
        labels: bins,
        datasets: [{
          label: `${indexType} Distribution`,
          data: frequencies,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${indexType} Distribution`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency'
            }
          },
          x: {
            title: {
              display: true,
              text: indexType
            }
          }
        }
      }
    });
  };

  // Correlation chart
  const createCorrelationChart = () => {
    if (!correlationChartRef.current || !qualityIndexField || numericFields.length === 0) return;
    const correlations = numericFields.map(field => {
      const fieldValues = displayDataset.map(item => parseFloat(item[field])).filter(v => !isNaN(v));
      const qualityValues = displayDataset.map(item => parseFloat(item[qualityIndexField])).filter(v => !isNaN(v));
      const alignedField: number[] = [];
      const alignedQuality: number[] = [];
      displayDataset.forEach(item => {
        const fVal = parseFloat(item[field]);
        const qVal = parseFloat(item[qualityIndexField]);
        if (!isNaN(fVal) && !isNaN(qVal)) {
          alignedField.push(fVal);
          alignedQuality.push(qVal);
        }
      });
      return {
        field,
        correlation: alignedField.length > 1 ? sampleCorrelation(alignedField, alignedQuality) : 0
      };
    });
    correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
    const topCorrelations = correlations.slice(0, 10);
    correlationChartInstance.current = new Chart(correlationChartRef.current, {
      type: 'bar',
      data: {
        labels: topCorrelations.map(c => c.field),
        datasets: [{
          label: 'Correlation',
          data: topCorrelations.map(c => c.correlation),
          backgroundColor: topCorrelations.map(c => c.correlation > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
          borderColor: topCorrelations.map(c => c.correlation > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top Correlations'
          }
        },
        scales: {
          y: {
            min: -1,
            max: 1,
            title: {
              display: true,
              text: 'Correlation Coefficient'
            }
          }
        }
      }
    });
  };

  // Prediction chart
  const createPredictionChart = () => {
    if (!predictionChartRef.current || !dateField || !qualityIndexField) return;
    const sortedData = [...displayDataset].sort((a, b) => {
      return new Date(a[dateField!]).getTime() - new Date(b[dateField!]).getTime();
    });
    const previewData = sortedData.slice(-30);
    const labels = previewData.map(item => {
      const date = new Date(item[dateField]);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const values = previewData.map(item => parseFloat(item[qualityIndexField]));
    predictionChartInstance.current = new Chart(predictionChartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${indexType} Values`,
          data: values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${indexType} Over Time`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: indexType
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });
  };

  // Gas concentration prediction chart
  const createGasChart = () => {
    if (!gasChartRef.current || !selectedGas || !gasPredictions[selectedGas] || gasPredictions[selectedGas].length === 0) return;
    const labels = Array.from({ length: gasPredictions[selectedGas].length }, (_, i) => `Day ${i + 1}`);
    const values = gasPredictions[selectedGas];
    gasChartInstance.current = new Chart(gasChartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${selectedGas} Prediction`,
          data: values,
          fill: false,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${selectedGas} Concentration Prediction (15 Days)`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: selectedGas
            }
          },
          x: {
            title: {
              display: true,
              text: 'Day'
            }
          }
        }
      }
    });
  };

  // Update gas chart when selectedGas or gasPredictions changes
  useEffect(() => {
    if (gasChartInstance.current) gasChartInstance.current.destroy();
    createGasChart();
    // eslint-disable-next-line
  }, [selectedGas, gasPredictions]);

  // Run gas predictions automatically
  const runGasPredictions = () => {
    if (!dateField || numericFields.length === 0) return;
    try {
      const gasFields = numericFields.filter(field =>
        field !== qualityIndexField &&
        field !== dateField &&
        !dateFields.includes(field)
      );
      if (gasFields.length === 0) return;
      const gasPredictionsObj: GasPredictions = {};
      const statistics: GasStatisticsMap = {};
      gasFields.forEach(gas => {
        const sortedData = [...displayDataset].sort((a, b) => {
          return new Date(a[dateField!]).getTime() - new Date(b[dateField!]).getTime();
        });
        const dates = sortedData.map(item => new Date(item[dateField!]).getTime());
        const values = sortedData.map(item => parseFloat(item[gas]));
        const validData = dates.map((date, i) => [date, values[i]]).filter(([_, value]) => !isNaN(value));
        if (validData.length < 2) return;
        const regression = linearRegression(validData as [number, number][]);
        const predict = linearRegressionLine(regression);
        const lastDate = new Date(dates[dates.length - 1]);
        const predictionValues: number[] = [];
        for (let i = 1; i <= 15; i++) {
          const nextDate = new Date(lastDate);
          nextDate.setDate(lastDate.getDate() + i);
          predictionValues.push(predict(nextDate.getTime()));
        }
        gasPredictionsObj[gas] = predictionValues;
        if (predictionValues.length > 0) {
          const initialValue = predictionValues[0];
          let trendPercentage = 0;
          if (Math.abs(initialValue) > 0.0001) {
            trendPercentage = ((predictionValues[14] - initialValue) / Math.abs(initialValue) * 100);
          }
          statistics[gas] = {
            min: min(predictionValues),
            max: max(predictionValues),
            avg: mean(predictionValues),
            stdDev: standardDeviation(predictionValues),
            trend: predictionValues[14] > predictionValues[0] ? 'Increasing' : 'Decreasing',
            trendPercentage: trendPercentage.toFixed(2)
          };
        }
      });
      setGasStatistics(statistics);
      setGasPredictions(gasPredictionsObj);
      if (Object.keys(gasPredictionsObj).length > 0 && !selectedGas) {
        setSelectedGas(Object.keys(gasPredictionsObj)[0]);
      }
    } catch (error: any) {
      showStatus('Error generating gas predictions: ' + error.message, false);
    }
  };

  // Run prediction for quality index
  const runPrediction = () => {
    if (!dateField || !qualityIndexField) return;
    try {
      const sortedData = [...displayDataset].sort((a, b) => {
        return new Date(a[dateField!]).getTime() - new Date(b[dateField!]).getTime();
      });
      const dates = sortedData.map(item => new Date(item[dateField!]).getTime());
      const values = sortedData.map(item => parseFloat(item[qualityIndexField!]));
      const timeSeries = dates.map((date, index) => [date, values[index]]);
      const regression = linearRegression(timeSeries as [number, number][]);
      const predict = linearRegressionLine(regression);
      const lastDate = new Date(dates[dates.length - 1]);
      const predictionDates: Date[] = [];
      const predictionValues: number[] = [];
      for (let i = 1; i <= 15; i++) {
        const nextDate = new Date(lastDate);
        nextDate.setDate(lastDate.getDate() + i);
        predictionDates.push(nextDate);
        predictionValues.push(predict(nextDate.getTime()));
      }
      // Optionally update prediction chart here if needed
    } catch (error: any) {
      showStatus('Error generating predictions: ' + error.message, false);
    }
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(displayDataset.length / rowsPerPage);

  // Render data table with auto-adjusting columns
  const renderDataTable = () => {
    if (displayDataset.length === 0) {
      return <p>No data available. Please upload a dataset.</p>;
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, displayDataset.length);
    const pageData = displayDataset.slice(startIndex, endIndex);
    if (pageData.length === 0) return null;
    const properties = Object.keys(pageData[0]);
    return (
      <table className="data-table">
        <thead>
          <tr>
            {properties.map(prop => (
              <th key={prop}>{prop}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, index) => (
            <tr key={index}>
              {properties.map(prop => (
                <td key={prop}>{row[prop]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="app-container">
      <header>
        {/* Navigation would be here */}
      </header>
      <main className="content">
        <div className="container">
          <header className="dashboard-header">
            <h1><i className="fas fa-wind"></i> Air and Water Quality Index Prediction Dashboard</h1>
            <p className="dashboard-subtitle">Analyze air and water quality data and predict future trends. Date fields are automatically excluded from numeric analysis.</p>
          </header>
          {/* Status Message */}
          {statusMessage.text && (
            <div id="status-message" className={statusMessage.isWarning ? 'warning' : statusMessage.isSuccess ? 'success' : 'error'}>
              {statusMessage.text}
            </div>
          )}
          {/* Loading Spinner */}
          {isLoading && (
            <div className="loading" id="loading">
              <div className="spinner"></div>
              <p>Processing your dataset...</p>
            </div>
          )}
          <section className="upload-section">
            
          </section>
          <div className="stats-container">
            <div className="stat-box">
              <h3>Total Records</h3>
              <p id="totalItems">{displayDataset.length}</p>
            </div>
            <div className="stat-box">
              <h3>Average <span id="indexTypeLabel">{indexType}</span></h3>
              <p id="avgValue">{avgValue.toFixed(2)}</p>
            </div>
            <div className="stat-box">
              <h3>Numeric Fields</h3>
              <p id="numericFields">{numericFields.length}</p>
              <div id="dateRemovedInfo" className="date-removed">
                {excludedDateFields.length > 0 ? `${excludedDateFields.length} date fields excluded` : ''}
              </div>
            </div>
          </div>
          <div className="dashboard">
            <div className="card">
              <h2><i className="fas fa-bars"></i> <span id="distTitle">{indexType} Distribution</span></h2>
              <div className="chart-container">
                <canvas ref={mainChartRef} id="mainChart"></canvas>
              </div>
            </div>
            <div className="card">
              <h2><i className="fas fa-project-diagram"></i> Correlation Matrix</h2>
              <div className="chart-container">
                <canvas ref={correlationChartRef} id="correlationChart"></canvas>
              </div>
            </div>
          </div>
          <div className="prediction-row">
            <div className="card prediction-card">
              <h2><i className="fas fa-chart-line"></i> <span id="predTitle">{indexType} Prediction</span> (15 Days)</h2>
              <div className="chart-container">
                <canvas ref={predictionChartRef} id="predictionChart"></canvas>
              </div>
              {/* AQI Prediction Classification Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', margin: '18px 0' }}>
                {AQI_CLASSES.map((cls) => (
                  <span
                    key={cls.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      color: '#222',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: cls.color,
                        border: '2px solid #eee',
                        marginRight: 6,
                      }}
                    />
                    {cls.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Gas Concentration Prediction Graph (smaller container, styled dropdown) */}
          <div className="card prediction-card gas-prediction-card">
            <h2><i className="fas fa-flask"></i> Gas Concentration Predictions</h2>
            <div className="chart-container">
              <canvas ref={gasChartRef} id="gasChart"></canvas>
            </div>
            <div className="gas-selector">
              <label>Select Gas:</label>
              <select
                value={selectedGas || ''}
                onChange={e => setSelectedGas(e.target.value)}
              >
                {Object.keys(gasPredictions).map(gas => (
                  <option key={gas} value={gas}>{gas}</option>
                ))}
              </select>
            </div>
            {/* Enhanced Gas Statistics Section */}
            {selectedGas && gasStatistics[selectedGas] && (
              <div className="gas-stats-section">
                <h3><i className="fas fa-chart-bar"></i> Prediction Statistics: {selectedGas}</h3>
                <div className="stat-cards-container">
                  <div className="stat-card">
                    <div className="stat-icon-bg bg-blue">
                      <i className="fas fa-arrow-down"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Minimum</div>
                      <div className="stat-value">{gasStatistics[selectedGas].min.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-bg bg-red">
                      <i className="fas fa-arrow-up"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Maximum</div>
                      <div className="stat-value">{gasStatistics[selectedGas].max.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-bg bg-purple">
                      <i className="fas fa-calculator"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Average</div>
                      <div className="stat-value">{gasStatistics[selectedGas].avg.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-bg bg-orange">
                      <i className="fas fa-wave-square"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Deviation</div>
                      <div className="stat-value">{gasStatistics[selectedGas].stdDev.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-bg bg-green">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Trend</div>
                      <div className={`stat-value ${gasStatistics[selectedGas].trend === 'Increasing' ? 'trend-up' : 'trend-down'}`}>
                        {gasStatistics[selectedGas].trend}
                        {gasStatistics[selectedGas].trendPercentage && (
                          <span className="trend-percentage">
                            ({gasStatistics[selectedGas].trendPercentage}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Data Table */}
          
          
        </div>
      </main>
      <footer>
        {/* Footer content would be here */}
      </footer>
    </div>
  );
};

export default Analytics;
