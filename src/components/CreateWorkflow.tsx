import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Maximize2, Bug } from 'lucide-react';

interface CreateWorkflowProps {
  onBack: () => void;
}

interface WorkflowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'start-end' | 'python' | 'text-parse' | 'image-parse' | 'audio-parse' | 'video-parse' | 'data-clean' | 'data-enhance';
}

const CreateWorkflow: React.FC<CreateWorkflowProps> = ({ onBack }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [sourceVolume, setSourceVolume] = useState('source_vol1');
  const [targetVolume, setTargetVolume] = useState('target_vol1');
  const [priority, setPriority] = useState('中');
  const [processingMode, setProcessingMode] = useState('一次处理');
  const [dataTypes, setDataTypes] = useState(['PDF', 'JPEG']);
  const [branchName, setBranchName] = useState('主要');
  const [description, setDescription] = useState('');
  const [zoom, setZoom] = useState(90);

  // 调试相关状态
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [debugProgress, setDebugProgress] = useState<Record<string, 'pending' | 'running' | 'completed' | 'error'>>({});

  // 连线调试状态管理
  const [connectionStates, setConnectionStates] = useState<Record<string, 'enabled' | 'disabled'>>({});
  const [runningConnections, setRunningConnections] = useState<Set<string>>(new Set());

  // 定义工作流节点
  const [nodes] = useState<WorkflowNode[]>([
    { id: 'start', label: '开始节点', x: 80, y: 250, type: 'start-end' },
    { id: 'python-preprocess', label: 'python自定义节点', x: 280, y: 250, type: 'python' },
    { id: 'text-parse', label: '文本解析节点', x: 520, y: 120, type: 'text-parse' },
    { id: 'text-python', label: 'python自定义节点', x: 760, y: 120, type: 'python' },
    { id: 'image-parse', label: '图片解析节点', x: 520, y: 220, type: 'image-parse' },
    { id: 'audio-parse', label: '音频解析节点', x: 520, y: 320, type: 'audio-parse' },
    { id: 'python-custom', label: 'python自定义节点', x: 1000, y: 250, type: 'python' },
    { id: 'clean', label: '数据清洗节点', x: 1240, y: 250, type: 'data-clean' },
    { id: 'enhance', label: '数据增强节点', x: 1480, y: 250, type: 'data-enhance' },
    { id: 'end', label: '结束节点', x: 1720, y: 250, type: 'start-end' }
  ]);

  // 定义连接关系
  const connections = [
    { from: 'start', to: 'python-preprocess' },
    { from: 'python-preprocess', to: 'text-parse' },
    { from: 'python-preprocess', to: 'image-parse' },
    { from: 'python-preprocess', to: 'audio-parse' },
    { from: 'text-parse', to: 'text-python' },
    { from: 'text-python', to: 'python-custom' },
    { from: 'image-parse', to: 'python-custom' },
    { from: 'audio-parse', to: 'python-custom' },
    { from: 'python-custom', to: 'clean' },
    { from: 'clean', to: 'enhance' },
    { from: 'enhance', to: 'end' }
  ];

  // 定义节点类型和对应的颜色
  const nodeTypeColors: Record<string, string> = {
    'start-end': 'bg-green-100 border-green-300 text-green-800',
    'python': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'text-parse': 'bg-blue-100 border-blue-300 text-blue-800',
    'image-parse': 'bg-purple-100 border-purple-300 text-purple-800',
    'audio-parse': 'bg-orange-100 border-orange-300 text-orange-800',
    'video-parse': 'bg-pink-100 border-pink-300 text-pink-800',
    'data-clean': 'bg-indigo-100 border-indigo-300 text-indigo-800',
    'data-enhance': 'bg-teal-100 border-teal-300 text-teal-800'
  };

  // 获取调试状态下的节点样式
  const getDebugNodeStyle = (nodeId: string) => {
    if (!isDebugMode) return nodeTypeColors[nodes.find(n => n.id === nodeId)?.type || 'start-end'];
    
    const baseStyle = nodeTypeColors[nodes.find(n => n.id === nodeId)?.type || 'start-end'];
    
    const status = debugProgress[nodeId];
    switch (status) {
      case 'running':
        return `${baseStyle} ring-2 ring-yellow-500 ring-offset-1 animate-pulse`;
      case 'completed':
        return `${baseStyle} ring-2 ring-green-500 ring-offset-1`;
      case 'error':
        return `${baseStyle} ring-2 ring-red-500 ring-offset-1`;
      default:
        return baseStyle;
    }
  };

  // 检查节点是否可以启用（前置节点是否已完成）
  const isNodeEnabled = (nodeId: string) => {
    if (!isDebugMode) return true;
    
    // 开始节点总是可以启用
    if (nodeId === 'start') return true;
    
    // 查找所有指向该节点的连接
    const incomingConnections = connections.filter(conn => conn.to === nodeId);
    
    // 如果没有前置连接，则可以启用
    if (incomingConnections.length === 0) return true;
    
    // 检查所有前置节点是否都已完成
    return incomingConnections.every(conn => {
      const connectionId = getConnectionId(conn.from, conn.to);
      return connectionStates[connectionId] === 'enabled' && debugProgress[conn.from] === 'completed';
    });
  };

  // 获取连接的唯一标识
  const getConnectionId = (from: string, to: string) => `${from}->${to}`;

  // 初始化调试模式时启用所有连线
  const initializeDebugMode = () => {
    const allConnections: Record<string, 'enabled' | 'disabled'> = {};
    connections.forEach(conn => {
      const connectionId = getConnectionId(conn.from, conn.to);
      allConnections[connectionId] = 'enabled';
    });
    setConnectionStates(allConnections);
    
    // 设置开始节点为已完成状态
    setDebugProgress({ start: 'completed' });
  };

  // 启动特定连线的调试
  const startConnectionDebug = async (connectionId: string) => {
    const [fromNode, toNode] = connectionId.split('->');
    
    setRunningConnections(prev => {
      const newSet = new Set(prev);
      newSet.add(connectionId);
      return newSet;
    });
    setDebugProgress(prev => ({ 
      ...prev, 
      [fromNode]: 'completed',
      [toNode]: 'running' 
    }));

    // 模拟节点执行时间
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 随机决定是否成功（90%成功率）
    const isSuccess = Math.random() > 0.1;
    setDebugProgress(prev => ({ 
      ...prev, 
      [toNode]: isSuccess ? 'completed' : 'error' 
    }));

    setRunningConnections(prev => {
      const newSet = new Set(prev);
      newSet.delete(connectionId);
      return newSet;
    });
  };

  // 停止特定连线的调试
  const stopConnectionDebug = (connectionId: string) => {
    setRunningConnections(prev => {
      const newSet = new Set(prev);
      newSet.delete(connectionId);
      return newSet;
    });
  };

  // 切换连线状态
  const toggleConnectionState = (connectionId: string) => {
    setConnectionStates(prev => ({
      ...prev,
      [connectionId]: prev[connectionId] === 'enabled' ? 'disabled' : 'enabled'
    }));
  };

  // 清除所有调试状态
  const clearAllDebugStates = () => {
    setConnectionStates({});
    setRunningConnections(new Set());
    setDebugProgress({});
  };

  const handleRemoveDataType = (index: number) => {
    setDataTypes(dataTypes.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    onBack();
  };

  const handleCreate = () => {
    // 创建工作流的逻辑
    console.log('创建工作流', {
      workflowName,
      sourceVolume,
      targetVolume,
      priority,
      processingMode,
      dataTypes,
      branchName,
      description
    });
  };

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const renderConnections = () => {
    return (
      <g>
        {connections.map((connection, index) => {
          const fromPos = getNodePosition(connection.from);
          const toPos = getNodePosition(connection.to);
          const connectionId = getConnectionId(connection.from, connection.to);
          const isConnectionEnabled = connectionStates[connectionId] === 'enabled';
          const isConnectionRunning = runningConnections.has(connectionId);
          
          // 计算连接线的路径和中点位置
          let pathD = '';
          let midPoint = { x: 0, y: 0 };
          
          // 节点宽度
          const nodeWidth = 120;
          const fromX = fromPos.x + nodeWidth;
          const fromY = fromPos.y + 15;
          const toX = toPos.x;
          const toY = toPos.y + 15;
          
          // 特殊处理从python-preprocess到解析节点的分叉连接
          if (connection.from === 'python-preprocess' && 
              ['text-parse', 'image-parse', 'audio-parse'].includes(connection.to)) {
            // 使用贝塞尔曲线让连线更平滑
            const controlX1 = fromX + 60;
            const controlX2 = toX - 60;
            pathD = `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
            midPoint = { x: (fromX + toX) / 2, y: (fromY + toY) / 2 };
          }
          // 特殊处理从解析节点到python-custom的汇聚连接（除了text-parse）
          else if (['image-parse', 'audio-parse'].includes(connection.from) && 
                   connection.to === 'python-custom') {
            const controlX1 = fromX + 60;
            const controlX2 = toX - 60;
            pathD = `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
            midPoint = { x: (fromX + toX) / 2, y: (fromY + toY) / 2 };
          }
          // 特殊处理从text-python到python-custom的连接
          else if (connection.from === 'text-python' && connection.to === 'python-custom') {
            const controlX1 = fromX + 60;
            const controlX2 = toX - 60;
            pathD = `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
            midPoint = { x: (fromX + toX) / 2, y: (fromY + toY) / 2 };
          }
          // 其他连接使用平滑的贝塞尔曲线
          else {
            const controlX1 = fromX + 80;
            const controlX2 = toX - 80;
            pathD = `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
            midPoint = { x: (fromX + toX) / 2, y: fromY };
          }
          
          // 确定连线颜色和样式
          let strokeColor = "#94a3b8"; // 默认灰色
          let strokeWidth = "2";
          
          if (isDebugMode) {
            if (isConnectionRunning) {
              strokeColor = "#f59e0b"; // 运行中为橙色
              strokeWidth = "3";
            } else if (isConnectionEnabled) {
              strokeColor = "#10b981"; // 启用为绿色
              strokeWidth = "3";
            } else if (connectionStates[connectionId] === 'disabled') {
              strokeColor = "#ef4444"; // 禁用为红色
              strokeWidth = "2";
            }
          }
          
          return (
            <g key={`connection-${index}`}>
              <path
                d={pathD}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={connectionStates[connectionId] === 'disabled' ? "5,5" : "none"}
              />
              {/* 在目标节点处添加小圆点 */}
              <circle
                cx={toPos.x}
                cy={toPos.y + 15}
                r="3"
                fill={strokeColor}
              />
              
              {/* 在调试模式下，在连线中点添加控制按钮 */}
              {isDebugMode && (
                <g>
                  {/* 按钮背景圆圈 */}
                  <circle
                    cx={midPoint.x}
                    cy={midPoint.y}
                    r="18"
                    fill="white"
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="cursor-pointer drop-shadow-md"
                    onClick={() => {
                      if (isConnectionRunning) {
                        stopConnectionDebug(connectionId);
                      } else if (isConnectionEnabled) {
                        startConnectionDebug(connectionId);
                      } else {
                        toggleConnectionState(connectionId);
                      }
                    }}
                  />
                  
                  {/* 按钮图标 */}
                  {isConnectionRunning ? (
                    // 运行中 - 暂停图标
                    <g className="cursor-pointer">
                      <rect
                        x={midPoint.x - 5}
                        y={midPoint.y - 6}
                        width="4"
                        height="12"
                        fill={strokeColor}
                      />
                      <rect
                        x={midPoint.x + 1}
                        y={midPoint.y - 6}
                        width="4"
                        height="12"
                        fill={strokeColor}
                      />
                    </g>
                  ) : isConnectionEnabled ? (
                    // 已启用 - 播放图标
                    <polygon
                      points={`${midPoint.x - 5},${midPoint.y - 6} ${midPoint.x - 5},${midPoint.y + 6} ${midPoint.x + 6},${midPoint.y}`}
                      fill={strokeColor}
                      className="cursor-pointer"
                    />
                  ) : connectionStates[connectionId] === 'disabled' ? (
                    // 已禁用 - X图标
                    <g className="cursor-pointer">
                      <line
                        x1={midPoint.x - 5}
                        y1={midPoint.y - 5}
                        x2={midPoint.x + 5}
                        y2={midPoint.y + 5}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />
                      <line
                        x1={midPoint.x - 5}
                        y1={midPoint.y + 5}
                        x2={midPoint.x + 5}
                        y2={midPoint.y - 5}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />
                    </g>
                  ) : (
                    // 默认状态 - 加号图标
                    <g className="cursor-pointer">
                      <line
                        x1={midPoint.x - 6}
                        y1={midPoint.y}
                        x2={midPoint.x + 6}
                        y2={midPoint.y}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />
                      <line
                        x1={midPoint.x}
                        y1={midPoint.y - 6}
                        x2={midPoint.x}
                        y2={midPoint.y + 6}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />
                    </g>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>创建工作流</span>
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* 左侧配置面板 */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* 工作流名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工作流名称
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="请输入工作流名称"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                maxLength={100}
                disabled={isDebugMode}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {workflowName.length}/100
              </div>
            </div>

            {/* 数据源卷 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                数据源卷 <span className="text-blue-500">ⓘ</span>
              </label>
              <select
                value={sourceVolume}
                onChange={(e) => setSourceVolume(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isDebugMode}
              >
                <option value="">请选择源数据卷</option>
                <option value="source_vol1">source_vol1</option>
                <option value="source_vol2">source_vol2</option>
              </select>
            </div>

            {/* 目标数据卷 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目标数据卷 <span className="text-blue-500">ⓘ</span>
              </label>
              <select
                value={targetVolume}
                onChange={(e) => setTargetVolume(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isDebugMode}
              >
                <option value="">请选择或创建目标数据卷</option>
                <option value="target_vol1">target_vol1</option>
                <option value="target_vol2">target_vol2</option>
              </select>
            </div>

            {/* 优先级 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级 <span className="text-blue-500">ⓘ</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isDebugMode}
              >
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </div>

            {/* 处理模式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                处理模式
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="processingMode"
                    value="一次处理"
                    checked={processingMode === '一次处理'}
                    onChange={(e) => setProcessingMode(e.target.value)}
                    className="mr-2"
                    disabled={isDebugMode}
                  />
                  <span className={`text-sm ${isDebugMode ? 'text-gray-400' : 'text-gray-700'}`}>一次处理</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="processingMode"
                    value="增量处理"
                    checked={processingMode === '增量处理'}
                    onChange={(e) => setProcessingMode(e.target.value)}
                    className="mr-2"
                    disabled={isDebugMode}
                  />
                  <span className={`text-sm ${isDebugMode ? 'text-gray-400' : 'text-gray-700'}`}>增量处理</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="processingMode"
                    value="实时处理"
                    checked={processingMode === '实时处理'}
                    onChange={(e) => setProcessingMode(e.target.value)}
                    className="mr-2"
                    disabled={isDebugMode}
                  />
                  <span className={`text-sm ${isDebugMode ? 'text-gray-400' : 'text-gray-700'}`}>实时处理</span>
                </label>
              </div>
            </div>

            {/* 处理数据类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                处理数据类型
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {dataTypes.map((type, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {type}
                    <button
                      onClick={() => handleRemoveDataType(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      disabled={isDebugMode}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value && !dataTypes.includes(e.target.value)) {
                    setDataTypes([...dataTypes, e.target.value]);
                  }
                  e.target.value = '';
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isDebugMode}
              >
                <option value="">选择数据类型</option>
                <option value="PDF">PDF</option>
                <option value="JPEG">JPEG</option>
                <option value="PNG">PNG</option>
                <option value="MP3">MP3</option>
                <option value="MP4">MP4</option>
                <option value="TXT">TXT</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>

            {/* 工作流配置与拓扑结构 */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                工作流配置与拓扑结构
              </h3>
              
              {/* 分支名称 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分支名称
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  maxLength={100}
                  disabled={isDebugMode}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {branchName.length}/100
                </div>
              </div>
            </div>

            {/* 调试控制面板 */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                调试控制
              </h3>
              
              {/* 调试模式开关 */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isDebugMode}
                    onChange={(e) => {
                      setIsDebugMode(e.target.checked);
                      if (!e.target.checked) {
                        clearAllDebugStates();
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">启用调试模式</span>
                </label>
                {isDebugMode && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                    <span className="font-medium">调试模式已启用</span>
                    <br />
                    基础配置信息已锁定，无法修改。点击连线上的按钮来控制调试流程：
                    <br />
                    <span className="text-green-600">● 绿色</span> - 已启用 
                    <span className="text-orange-500 ml-2">● 橙色</span> - 运行中
                    <span className="text-red-500 ml-2">● 红色</span> - 已禁用
                  </div>
                )}
              </div>

              {/* 调试控制按钮 */}
              {isDebugMode && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs font-medium text-blue-800 mb-2">
                      连线控制说明
                    </p>
                    <div className="text-xs text-blue-600 space-y-1">
                      <div>• 点击连线上的 <span className="font-mono">+</span> 启用该连线</div>
                      <div>• 点击 <span className="font-mono">▶</span> 开始运行该连线</div>
                      <div>• 点击 <span className="font-mono">⏸</span> 暂停运行</div>
                      <div>• 点击 <span className="font-mono">✕</span> 禁用该连线</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={clearAllDebugStates}
                    className="w-full flex items-center justify-center px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                  >
                    清除所有状态
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧工作流设计区域 */}
        <div className="flex-1 flex flex-col">
          {/* 工具栏 */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                <Plus className="w-4 h-4 mr-1" />
                开始节点
              </button>
              <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                <Plus className="w-4 h-4 mr-1" />
                结束节点
              </button>
              {isDebugMode && (
                <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                  <Bug className="w-4 h-4 mr-1" />
                  调试模式
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[40px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 画布区域 */}
          <div className="flex-1 bg-gray-50 overflow-auto relative">
            <div 
              className="absolute inset-0"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              {/* 工作流图表 */}
              <div className="w-full h-full relative">
                <svg width="1900" height="500" className="absolute top-0 left-0" key="workflow-svg">
                  {renderConnections()}
                  
                  {/* 渲染节点 */}
                  {nodes.map((node) => (
                    <g key={node.id}>
                      <foreignObject x={node.x} y={node.y} width="120" height="30">
                        <div 
                          className={`px-3 py-1 rounded border text-xs font-medium text-center cursor-pointer hover:shadow-md transition-all relative ${getDebugNodeStyle(node.id)}`}
                        >
                          {node.label}
                          {debugProgress[node.id] === 'running' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
                          )}
                          {debugProgress[node.id] === 'completed' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                          )}
                          {debugProgress[node.id] === 'error' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      </foreignObject>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* 说明区域 */}
          <div className="bg-white border-t border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              说明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请在这里输入对工作流的说明"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={300}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {description.length}/300
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              创建
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkflow; 