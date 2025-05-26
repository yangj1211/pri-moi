import React from 'react';
import BasicInfo from './BasicInfo';
import ExecutionInfo from './ExecutionInfo';
import WorkflowDiagram from './WorkflowDiagram';
import ExecutionDetails from './ExecutionDetails';

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Basic Information */}
        <BasicInfo />
        
        {/* Execution Information */}
        <ExecutionInfo />
        
        {/* Workflow Diagram */}
        <WorkflowDiagram />
        
        {/* Execution Details */}
        <ExecutionDetails />
      </div>
    </main>
  );
};

export default MainContent; 