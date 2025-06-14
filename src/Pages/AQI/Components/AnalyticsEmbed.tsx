import React from 'react';
import Analytics from '../../../Analytics';

interface AnalyticsEmbedProps {
  data: any[];
  qualityIndexField?: string;
  dateField?: string;
}

const AnalyticsEmbed: React.FC<AnalyticsEmbedProps> = ({ data, qualityIndexField, dateField }) => {
  // This component will render the Analytics dashboard using the provided data
  // You may need to update Analytics.tsx to accept props for data, qualityIndexField, and dateField
  // For now, just render the Analytics component
  return <Analytics data={data} qualityIndexField={qualityIndexField} dateField={dateField} />;
};

export default AnalyticsEmbed;
