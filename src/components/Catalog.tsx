import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Download, 
  Eye, 
  Trash2,
  FileText,
  Image,
  Music,
  Video,
  File
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadUser: string;
  uploadTime: string;
  updateTime: string;
  status: string;
}

const Catalog: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['原始数据卷', '处理数据卷']);
  const [expandedVolumes, setExpandedVolumes] = useState<string[]>([]);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const toggleVolume = (volumeName: string) => {
    setExpandedVolumes(prev => 
      prev.includes(volumeName) 
        ? prev.filter(name => name !== volumeName)
        : [...prev, volumeName]
    );
  };

  const selectVolume = (volumeName: string) => {
    setSelectedVolume(volumeName);
  };

  // 原始数据卷文件列表
  const originalDataFiles: FileItem[] = [
    {
      id: 'source_vol1_1',
      name: 'test.txt',
      type: 'txt',
      size: '9B',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:05:00',
      updateTime: '2025-05-09 10:05:00',
      status: '解析完成'
    },
    {
      id: 'source_vol1_2',
      name: 'v24.2.0.0.md',
      type: 'markdown',
      size: '9.1KiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:05:00',
      updateTime: '2025-05-09 10:05:00',
      status: '解析完成'
    },
    {
      id: 'source_vol1_3',
      name: 'MatrixOne Intelligence演示操作...',
      type: 'docx',
      size: '3.0MiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:05:00',
      updateTime: '2025-05-09 10:05:00',
      status: '解析完成'
    },
    {
      id: 'source_vol1_4',
      name: 'cat_jpg-5.jpg',
      type: 'jpg',
      size: '787.9KiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:05:00',
      updateTime: '2025-05-09 10:05:00',
      status: '解析完成'
    },
    {
      id: 'source_vol1_5',
      name: 'MatrixOne Intelligence多模态AI数...',
      type: 'pdf',
      size: '1.1MiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:05:00',
      updateTime: '2025-05-09 10:05:00',
      status: '解析完成'
    },
    {
      id: 'source_vol1_6',
      name: 'MatrixOne一站式saas解决方案v1...',
      type: 'pptx',
      size: '16.4MiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:05:00',
      updateTime: '2025-05-09 10:05:00',
      status: '解析完成'
    }
  ];

  // 处理数据卷文件列表
  const processedDataFiles: FileItem[] = [
    {
      id: '0196b2e4-9c35-76...',
      name: 'MatrixOne Intelligence多模态...',
      type: 'pdf',
      size: '1.1MiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:34:35',
      updateTime: '2025-05-09 10:35:20',
      status: '解析完成'
    },
    {
      id: '0196b2e4-9c35-76...',
      name: 'cat_jpg-5.jpg',
      type: 'jpg',
      size: '787.9KiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:34:32',
      updateTime: '2025-05-09 10:34:35',
      status: '解析完成'
    },
    {
      id: '0196b2e4-9c35-76...',
      name: 'MatrixOne Intelligence演示操...',
      type: 'docx',
      size: '3.0MiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:34:27',
      updateTime: '2025-05-09 10:41:01',
      status: '解析完成'
    },
    {
      id: '0196b2e4-9c35-76...',
      name: 'v24.2.0.0.md',
      type: 'markdown',
      size: '9.1KiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:34:27',
      updateTime: '2025-05-09 10:34:27',
      status: '解析完成'
    },
    {
      id: '0196b2e4-9c35-76...',
      name: 'test.txt',
      type: 'txt',
      size: '9B',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:34:26',
      updateTime: '2025-05-09 10:34:27',
      status: '解析完成'
    },
    {
      id: '0196b2e4-9c35-76...',
      name: 'MatrixOne一站式saas解决方...',
      type: 'pptx',
      size: '16.4MiB',
      uploadUser: 'admin',
      uploadTime: '2025-05-09 10:34:22',
      updateTime: '2025-05-09 10:43:03',
      status: '解析完成'
    }
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'txt':
      case 'md':
      case 'markdown':
      case 'docx':
      case 'pdf':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music className="w-4 h-4 text-purple-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-4 h-4 text-red-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredOriginalFiles = originalDataFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProcessedFiles = processedDataFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderFileTable = (files: FileItem[], volumeTitle: string) => (
    <div className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{volumeTitle}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                文件 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                文件名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                文件类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                文件大小
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                开始处理时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最近处理时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {file.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {file.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {file.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {file.uploadTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {file.updateTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {file.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" title="复制">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800" title="下载">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800" title="预览">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* 左侧文件树 */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">数据目录</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* 原始数据卷 */}
          <div className="mb-4">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => toggleSection('原始数据卷')}
            >
              {expandedSections.includes('原始数据卷') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-medium text-gray-900">原始数据卷</span>
            </div>
            {expandedSections.includes('原始数据卷') && (
              <div className="ml-6 mt-2">
                <div 
                  className={`flex items-center space-x-2 text-sm p-2 rounded cursor-pointer transition-colors ${
                    selectedVolume === 'source_vol1' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => selectVolume('source_vol1')}
                >
                  <span>source_vol1</span>
                </div>
              </div>
            )}
          </div>

          {/* 处理数据卷 */}
          <div className="mb-4">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => toggleSection('处理数据卷')}
            >
              {expandedSections.includes('处理数据卷') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-medium text-gray-900">处理数据卷</span>
            </div>
            {expandedSections.includes('处理数据卷') && (
              <div className="ml-6 mt-2">
                {/* target_vol1 */}
                <div className="mb-2">
                  <div
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onClick={() => toggleVolume('target_vol1')}
                  >
                    {expandedVolumes.includes('target_vol1') ? (
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700">target_vol1</span>
                  </div>
                  {expandedVolumes.includes('target_vol1') && (
                    <div className="ml-5 mt-1">
                      <div 
                        className={`flex items-center space-x-2 text-sm p-1 rounded cursor-pointer transition-colors ${
                          selectedVolume === 'target_vol1_分支一' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => selectVolume('target_vol1_分支一')}
                      >
                        <span>分支一</span>
                      </div>
                      <div 
                        className={`flex items-center space-x-2 text-sm p-1 rounded cursor-pointer transition-colors ${
                          selectedVolume === 'target_vol1_主要' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => selectVolume('target_vol1_主要')}
                      >
                        <span>主要</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* target_vol2 */}
                <div 
                  className={`flex items-center space-x-2 text-sm p-2 rounded cursor-pointer transition-colors ${
                    selectedVolume === 'target_vol2' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => selectVolume('target_vol2')}
                >
                  <span>target_vol2</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右侧文件列表 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {/* 根据选中的数据卷显示对应的文件列表 */}
          {selectedVolume === 'source_vol1' && renderFileTable(filteredOriginalFiles, '原始数据卷 - source_vol1')}
          {(selectedVolume === 'target_vol1_分支一' || selectedVolume === 'target_vol1_主要') && renderFileTable(filteredProcessedFiles, `处理数据卷 - target_vol1 - ${selectedVolume.split('_')[2]}`)}
          {selectedVolume === 'target_vol2' && (
            <div className="bg-white">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">处理数据卷 - target_vol2</h3>
              </div>
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">暂无文件</p>
              </div>
            </div>
          )}
          {!selectedVolume && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">请选择左侧的数据卷查看文件列表</p>
            </div>
          )}
        </div>

        {/* 分页 */}
        {selectedVolume && (
          <div className="bg-white border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog; 