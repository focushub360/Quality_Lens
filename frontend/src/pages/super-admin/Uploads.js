import React from 'react';
import NewAnalysis from '../dealer-admin/NewAnalysis';
import BulkUpload from '../dealer-admin/BulkUpload';

export default function Uploads() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <NewAnalysis />
      <BulkUpload />
    </div>
  );
}
