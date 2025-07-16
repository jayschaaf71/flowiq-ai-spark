
import React from 'react';

console.log('PatientManagement: Module loading...');

const PatientManagement = () => {
  console.log('PatientManagement: Component is rendering!');
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Patient Management - TEST</h1>
      <p>This is a test to see if the component renders at all.</p>
    </div>
  );
};

console.log('PatientManagement: About to export component');

export default PatientManagement;
