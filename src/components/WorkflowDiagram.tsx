import React, { useState } from 'react';
import { ArrowRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const WorkflowDiagram: React.FC = () => {
  const [zoom, setZoom] = useState(100);

  const nodes = [
    { id: 'start', label: '开始节点', x: 50, y: 200, color: 'bg-green-100 border-green-300 text-green-800' },
    { id: 'text-parse', label: '文本解析节点', x: 200, y: 120, color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { id: 'image-parse', label: '图片解析节点', x: 200, y: 160, color: 'bg-purple-100 border-purple-300 text-purple-800' },
    { id: 'audio-parse', label: '音频解析节点', x: 200, y: 200, color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { id: 'video-parse', label: '视频解析节点', x: 200, y: 240, color: 'bg-pink-100 border-pink-300 text-pink-800' },
    { id: 'python-custom', label: 'Python自定义节点', x: 350, y: 200, color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { id: 'clean', label: '数据清洗', x: 500, y: 200, color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
    { id: 'enhance', label: '数据增强', x: 650, y: 200, color: 'bg-teal-100 border-teal-300 text-teal-800' },
    { id: 'end', label: '结束节点', x: 800, y: 200, color: 'bg-green-100 border-green-300 text-green-800' }
  ];

  const connections = [
    { from: 'start', to: 'text-parse' },
    { from: 'start', to: 'image-parse' },
    { from: 'start', to: 'audio-parse' },
    { from: 'start', to: 'video-parse' },
    { from: 'text-parse', to: 'python-custom' },
    { from: 'image-parse', to: 'python-custom' },
    { from: 'audio-parse', to: 'python-custom' },
    { from: 'video-parse', to: 'python-custom' },
    { from: 'python-custom', to: 'clean' },
    { from: 'clean', to: 'enhance' },
    { from: 'enhance', to: 'end' }
  ];

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const renderConnection = (connection: any, index: number) => {
    const fromPos = getNodePosition(connection.from);
    const toPos = getNodePosition(connection.to);
    
    // 计算连接线的路径
    const midX = (fromPos.x + toPos.x) / 2;
    const pathData = `M ${fromPos.x + 60} ${fromPos.y + 15} 
                      L ${midX} ${fromPos.y + 15} 
                      L ${midX} ${toPos.y + 15} 
                      L ${toPos.x} ${toPos.y + 15}`;

    return (
      <g key={index}>
        <path
          d={pathData}
          stroke="#94a3b8"
          strokeWidth="2"
          fill="none"
          strokeDasharray="0"
        />
        <circle
          cx={toPos.x}
          cy={toPos.y + 15}
          r="3"
          fill="#94a3b8"
        />
      </g>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">工作流图</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            -
          </button>
          <span className="text-sm text-gray-600">{zoom}%</span>
          <button 
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="overflow-auto border border-gray-200 rounded-lg" style={{ height: '350px' }}>
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
          <svg width="900" height="350" className="bg-gray-50">
            {/* 渲染连接线 */}
            {connections.map((connection, index) => renderConnection(connection, index))}
            
            {/* 渲染节点 */}
            {nodes.map((node) => (
              <g key={node.id}>
                <foreignObject x={node.x} y={node.y} width="120" height="30">
                  <div className={`px-3 py-1 rounded border text-xs font-medium text-center ${node.color}`}>
                    {node.label}
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>开始/结束</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>文本解析</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
            <span>图片解析</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
            <span>音频解析</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-pink-100 border border-pink-300 rounded"></div>
            <span>视频解析</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>Python自定义</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded"></div>
            <span>数据清洗</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-teal-100 border border-teal-300 rounded"></div>
            <span>数据增强</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram; 