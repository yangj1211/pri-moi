import React from 'react';

const ExecutionInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">执行信息</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            文件类型
          </label>
          <div className="text-sm text-gray-900">txt, doc/docx</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            源数据量
          </label>
          <div className="text-sm text-gray-900">这个是源数据量的名字</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            目标数据量
          </label>
          <div className="text-sm text-gray-900">XXXXXX</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            状态
          </label>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              数据完成
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            数据量
          </label>
          <div className="text-sm text-gray-900">50/100</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            开始时间
          </label>
          <div className="text-sm text-gray-900">2024-08-19 17:22:24</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            结束时间
          </label>
          <div className="text-sm text-gray-900">2024-08-19 17:22:24</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            计算时长
          </label>
          <div className="text-sm text-gray-900">30分钟</div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionInfo; 