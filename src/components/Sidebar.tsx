import React from 'react';
import { 
  Home, 
  Database, 
  Settings, 
  BarChart3, 
  FileText, 
  Brain, 
  Users,
  Zap
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'SONGSONG', active: false },
    { icon: FileText, label: '仪表板', active: false },
    { icon: Database, label: '数据输入', active: false },
    { icon: BarChart3, label: '数据处理', active: false },
    { icon: Zap, label: '工作流', active: false },
    { icon: FileText, label: '作业', active: true },
    { icon: BarChart3, label: '数据探索', active: false },
    { icon: Brain, label: 'AI 应用', active: false },
    { icon: Users, label: '用户管理', active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">MatrixOne</div>
            <div className="text-xs text-gray-500">Intelligence</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 