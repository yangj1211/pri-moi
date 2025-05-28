import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import Catalog from './Catalog';
import WorkflowList from './WorkflowList';
import CreateWorkflow from './CreateWorkflow';

type CurrentPage = 'job-details' | 'catalog' | 'workflow' | 'create-workflow';

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('job-details');

  const renderMainContent = () => {
    switch (currentPage) {
      case 'catalog':
        return <Catalog />;
      case 'workflow':
        return <WorkflowList onCreateWorkflow={() => setCurrentPage('create-workflow')} />;
      case 'create-workflow':
        return <CreateWorkflow onBack={() => setCurrentPage('workflow')} />;
      case 'job-details':
      default:
        return <MainContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        {currentPage !== 'create-workflow' && <Header />}
        <div className="flex-1 overflow-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 