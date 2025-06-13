import React, { useState } from 'react';
import '../../App.css';

import Table from '../../Public Components/Table';
import Header from '../../Public Components/Header';
import Grid from '../../Public Components/Grid';
import Upload from '../../Public Components/Upload';

function AQI() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<string | null>(null); // TODO: Someone Make this Datatype
  const ranges = ['0-50', '51-100', '101-150', '151-200', '201-300', '301-500'];

  const classification = [
    'Good',
    'Moderate',
    'Unhealthy for Sensitive Groups',
    'Unhealthy',
    'Very Unhealthy',
    'Very Hazardous',
  ];
  const columns = ['Date', 'PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO', 'O₃'];
  return (
    <div className="home-container">
      <Header
        header={'Clean Air, Healthy Lives'}
        details={
          'Join us in building sustainable cities where clean air powers healthier communities. Together, we can create   a future where everyone breathes easy and thrives in harmony with nature.'
        }
      ></Header>
      <Table fullName={'Air Quality Index'} name={'AQI'} ranges={ranges} classification={classification}></Table>
      <Grid columns={columns}></Grid>
      <Upload file={file} setFile={setFile} setData={setData}></Upload>
    </div>
  );
}

export default AQI;
