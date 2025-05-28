import React, { useState } from 'react';
import { 
  Home, 
  Database, 
  BarChart3, 
  FileText, 
  Brain, 
  Users,
  Zap,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen
} from 'lucide-react';

type CurrentPage = 'job-details' | 'catalog' | 'workflow' | 'create-workflow';

interface SidebarProps {
  currentPage: CurrentPage;
  onPageChange: (page: CurrentPage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (menuLabel: string) => {
    if (menuLabel === '作业') {
      onPageChange('job-details');
    } else if (menuLabel === '工作流') {
      onPageChange('workflow');
    }
  };

  const handleSubmenuClick = (submenuLabel: string) => {
    if (submenuLabel === 'Catalog') {
      onPageChange('catalog');
    }
  };

  const menuItems = [
    { icon: Home, label: 'SONGSONG', active: false, hasSubmenu: false },
    { icon: FileText, label: '仪表板', active: false, hasSubmenu: false },
    { icon: Database, label: '数据输入', active: false, hasSubmenu: false },
    { icon: BarChart3, label: '数据处理', active: false, hasSubmenu: false },
    { icon: Zap, label: '工作流', active: currentPage === 'workflow', hasSubmenu: false },
    { icon: FileText, label: '作业', active: currentPage === 'job-details', hasSubmenu: false },
    { 
      icon: BarChart3, 
      label: '数据管理', 
      active: currentPage === 'catalog', 
      hasSubmenu: true,
      submenu: [
        { label: 'Catalog', active: currentPage === 'catalog' }
      ]
    },
    { icon: Brain, label: 'AI 应用', active: false, hasSubmenu: false },
    { icon: Users, label: '用户管理', active: false, hasSubmenu: false },
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
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              {/* 主菜单项 */}
              <div
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleMenu(item.label);
                  } else {
                    handleMenuClick(item.label);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <div className="ml-auto">
                    {expandedMenus.includes(item.label) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
              
              {/* 子菜单 */}
              {item.hasSubmenu && expandedMenus.includes(item.label) && item.submenu && (
                <ul className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <button
                        onClick={() => handleSubmenuClick(subItem.label)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          subItem.active 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {subItem.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          © 2024 MatrixOne Intelligence
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 