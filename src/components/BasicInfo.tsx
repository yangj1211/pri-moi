import React from 'react';

const BasicInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            工作流名称
          </label>
          <div className="text-sm text-gray-900">这个是测试流名称</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            创建人
          </label>
          <div className="text-sm text-gray-900">admin</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            创建时间
          </label>
          <div className="text-sm text-gray-900">2024-08-19 17:52:24</div>
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          描述备注信息
        </label>
        <div className="text-sm text-gray-900">2024-08-19 17:52:24</div>
      </div>
    </div>
  );
};

export default BasicInfo; 