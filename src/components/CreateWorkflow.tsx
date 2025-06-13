import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Maximize2, Bug, Play, X, Save, GripVertical, Upload } from 'lucide-react';

interface CreateWorkflowProps {
  onBack: () => void;
}

interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  itemType?: 'string' | 'number' | 'boolean' | 'object'; // 数组元素类型
  properties?: SchemaField[]; // Object类型的嵌套字段
  collapsed?: boolean; // 折叠状态
}

interface InfoExtractConfig {
  nodeName: string;
  model: string;
  schema: SchemaField[];
}

// 添加Python节点配置接口
interface PythonNodeConfig {
  nodeName: string;
  inputValue: string;
  outputValue: string;
  pythonScript: string;
}

interface WorkflowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'start-end' | 'python' | 'text-parse' | 'image-parse' | 'audio-parse' | 'video-parse' | 'data-clean' | 'data-enhance' | 'info-extract';
  config?: InfoExtractConfig;
  pythonConfig?: PythonNodeConfig; // 添加Python节点配置
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
  const [debugRange, setDebugRange] = useState<{start: string; end: string}>({start: '', end: ''});
  const [isDebugging, setIsDebugging] = useState(false);
  const [isAutoExecuting, setIsAutoExecuting] = useState(false);
  const [breakpoints, setBreakpoints] = useState<Set<string>>(new Set());

  // 连线调试状态管理
  const [connectionStates, setConnectionStates] = useState<Record<string, 'enabled' | 'disabled'>>({});
  const [runningConnections, setRunningConnections] = useState<Set<string>>(new Set());

  // 结构化提取节点配置弹窗状态
  const [showInfoExtractModal, setShowInfoExtractModal] = useState(false);
  const [currentInfoExtractConfig, setCurrentInfoExtractConfig] = useState<InfoExtractConfig>({
    nodeName: '结构化提取节点',
    model: 'gpt-4',
    schema: []
  });
  const [editingNodeId, setEditingNodeId] = useState<string>('');
  const [configMode, setConfigMode] = useState<'form' | 'json'>('form');
  const [jsonConfig, setJsonConfig] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');

  // 添加Python节点配置弹窗状态
  const [showPythonModal, setShowPythonModal] = useState(false);
  const [currentPythonConfig, setCurrentPythonConfig] = useState<PythonNodeConfig>({
    nodeName: 'Python自定义节点',
    inputValue: 'documents',
    outputValue: 'documents',
    pythonScript: ''
  });
  const [editingPythonNodeId, setEditingPythonNodeId] = useState<string>('');

  // JSON全屏编辑状态
  const [isJsonFullscreen, setIsJsonFullscreen] = useState(false);

  // Python脚本全屏编辑状态
  const [isPythonFullscreen, setIsPythonFullscreen] = useState(false);

  // 拖拽排序状态
  const [draggedFieldIndex, setDraggedFieldIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 定义工作流节点
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'start', label: '开始节点', x: 80, y: 250, type: 'start-end' },
    { id: 'python1', label: 'python1', x: 280, y: 250, type: 'python' },
    { id: 'text-parse', label: '文本解析节点', x: 520, y: 120, type: 'text-parse' },
    { id: 'info-extract', label: '结构化提取节点', x: 760, y: 120, type: 'info-extract' },
    { id: 'text-python', label: 'python自定义节点', x: 1000, y: 120, type: 'python' },
    { id: 'image-parse', label: '图片解析节点', x: 520, y: 220, type: 'image-parse' },
    { id: 'audio-parse', label: '音频解析节点', x: 520, y: 320, type: 'audio-parse' },
    { id: 'python2', label: 'python2', x: 1240, y: 250, type: 'python' },
    { id: 'clean', label: '数据清洗节点', x: 1480, y: 250, type: 'data-clean' },
    { id: 'enhance', label: '数据增强节点', x: 1720, y: 250, type: 'data-enhance' },
    { id: 'end', label: '结束节点', x: 1960, y: 250, type: 'start-end' }
  ]);

  // 定义连接关系
  const connections = [
    { from: 'start', to: 'python1' },
    { from: 'python1', to: 'text-parse' },
    { from: 'python1', to: 'image-parse' },
    { from: 'python1', to: 'audio-parse' },
    { from: 'text-parse', to: 'info-extract' },
    { from: 'info-extract', to: 'text-python' },
    { from: 'text-python', to: 'python2' },
    { from: 'image-parse', to: 'python2' },
    { from: 'audio-parse', to: 'python2' },
    { from: 'python2', to: 'clean' },
    { from: 'clean', to: 'enhance' },
    { from: 'enhance', to: 'end' }
  ];

  // 定义节点类型和对应的颜色
  const nodeTypeColors: Record<string, string> = {
    'start-end': 'bg-green-100 border-green-300 text-green-800',
    'python': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'text-parse': 'bg-blue-100 border-blue-300 text-blue-800',
    'info-extract': 'bg-cyan-100 border-cyan-300 text-cyan-800',
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
    
    // 如果设置了调试范围，检查节点是否在范围外
    if (debugRange.start && debugRange.end) {
      const nodeOrder = ['start', 'python1', 'text-parse', 'info-extract', 'image-parse', 'audio-parse', 'text-python', 'python2', 'clean', 'enhance', 'end'];
      const startIndex = nodeOrder.indexOf(debugRange.start);
      const endIndex = nodeOrder.indexOf(debugRange.end);
      const nodeIndex = nodeOrder.indexOf(nodeId);
      
      // 范围外的节点显示为灰色半透明
      if (nodeIndex < startIndex || nodeIndex > endIndex) {
        return `bg-gray-100 border-gray-300 text-gray-500 opacity-50`;
      }
    }
    
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

  // 获取节点的所有前置节点
  const getPrecedingNodes = (nodeId: string): string[] => {
    const precedingNodes = new Set<string>();
    const addPrecedingNodes = (id: string) => {
      const incomingConnections = connections.filter(conn => conn.to === id);
      incomingConnections.forEach(conn => {
        precedingNodes.add(conn.from);
        addPrecedingNodes(conn.from);
      });
    };
    addPrecedingNodes(nodeId);
    return Array.from(precedingNodes);
  };

  // 检查节点是否可以启用（前置节点是否已完成）
  const isNodeEnabled = (nodeId: string) => {
    if (!isDebugMode || !isDebugging) return true;
    
    // 如果设置了调试范围，检查节点是否在范围内
    if (debugRange.start && debugRange.end) {
      const nodeOrder = ['start', 'python1', 'text-parse', 'info-extract', 'image-parse', 'audio-parse', 'text-python', 'python2', 'clean', 'enhance', 'end'];
      const startIndex = nodeOrder.indexOf(debugRange.start);
      const endIndex = nodeOrder.indexOf(debugRange.end);
      const nodeIndex = nodeOrder.indexOf(nodeId);
      
      // 节点必须在调试范围内
      if (nodeIndex < startIndex || nodeIndex > endIndex) return false;
    }
    
    // 检查所有前置节点是否都已完成
    const precedingNodes = getPrecedingNodes(nodeId);
    return precedingNodes.length === 0 || precedingNodes.every(node => debugProgress[node] === 'completed');
  };

  // 获取下一个可执行的节点
  const getNextExecutableNode = (): string | null => {
    const nodeOrder = ['start', 'python1', 'text-parse', 'info-extract', 'image-parse', 'audio-parse', 'text-python', 'python2', 'clean', 'enhance', 'end'];
    const startIndex = nodeOrder.indexOf(debugRange.start);
    const endIndex = nodeOrder.indexOf(debugRange.end);
    
    for (let i = startIndex; i <= endIndex; i++) {
      const nodeId = nodeOrder[i];
      if (debugProgress[nodeId] !== 'completed' && isNodeEnabled(nodeId)) {
        return nodeId;
      }
    }
    return null;
  };

  // 获取节点之间的连接
  const getConnection = (fromNode: string, toNode: string) => {
    return connections.find(conn => conn.from === fromNode && conn.to === toNode);
  };

  // 执行下一个节点
  const executeNextNode = async () => {
    if (!isAutoExecuting) return;

    const nextNode = getNextExecutableNode();
    if (!nextNode) {
      setIsAutoExecuting(false);
      return;
    }

    // 找到前一个已完成的节点
    const precedingNodes = getPrecedingNodes(nextNode);
    const lastCompletedNode = precedingNodes.find(node => debugProgress[node] === 'completed');

    if (lastCompletedNode) {
      const connection = getConnection(lastCompletedNode, nextNode);
      if (connection) {
        const connectionId = getConnectionId(connection.from, connection.to);
        await startConnectionDebug(connectionId);
      }
    }
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
    setDebugRange({start: '', end: ''});
    setIsDebugging(false);
  };

  // 切换断点状态
  const toggleBreakpoint = (connectionId: string) => {
    setBreakpoints(prev => {
      const newBreakpoints = new Set(prev);
      if (newBreakpoints.has(connectionId)) {
        newBreakpoints.delete(connectionId);
      } else {
        newBreakpoints.add(connectionId);
      }
      return newBreakpoints;
    });
  };

  // 修改startConnectionDebug函数，添加断点处理
  const startConnectionDebug = async (connectionId: string) => {
    const [, toNode] = connectionId.split('->');
    
    setRunningConnections(prev => {
      const newSet = new Set(prev);
      newSet.add(connectionId);
      return newSet;
    });
    setDebugProgress(prev => ({ 
      ...prev, 
      [toNode]: 'running' 
    }));

    // 模拟节点执行时间
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 如果有断点，暂停自动执行
    if (breakpoints.has(connectionId)) {
      setIsAutoExecuting(false);
    }

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

    // 如果是自动执行模式且执行成功且没有断点，继续执行下一个节点
    if (isAutoExecuting && isSuccess && !breakpoints.has(connectionId)) {
      executeNextNode();
    } else if (!isSuccess) {
      setIsAutoExecuting(false);
    }
  };

  // 停止特定连线的调试
  const stopConnectionDebug = (connectionId: string) => {
    setRunningConnections(prev => {
      const newSet = new Set(prev);
      newSet.delete(connectionId);
      return newSet;
    });
  };

  // 判断是否是主线连接
  const isMainConnection = (fromNode: string, toNode: string) => {
    return (fromNode === 'start' && toNode === 'python1') ||
           (fromNode === 'python2' && toNode === 'clean') ||
           (fromNode === 'clean' && toNode === 'enhance') ||
           (fromNode === 'enhance' && toNode === 'end');
  };

  // 判断是否是分流主线
  const isSplitMainLine = (fromNode: string, toNode: string) => {
    return fromNode === 'python1' && toNode === 'split-point';
  };

  // 判断是否是汇合主线
  const isMergeMainLine = (fromNode: string, toNode: string) => {
    return fromNode === 'merge-point' && toNode === 'python2';
  };

  // 获取分支的所有连线
  const getBranchConnections = (mainNode: string) => {
    if (mainNode === 'python1') {
      return connections.filter(conn => 
        ['text-parse', 'image-parse', 'audio-parse'].includes(conn.to)
      );
    }
    return [];
  };

  // 切换连线状态（包括分支联动）
  const toggleConnectionState = (connectionId: string) => {
    const [fromNode, toNode] = connectionId.split('->');
    
    setConnectionStates(prev => {
      const newStates = { ...prev };
      const newState = prev[connectionId] === 'enabled' ? 'disabled' : 'enabled';
      
      // 更新当前连线状态
      newStates[connectionId] = newState;
      
      // 如果是主线，联动控制分支线
      if (isMainConnection(fromNode, toNode) || 
          isSplitMainLine(fromNode, toNode) || 
          isMergeMainLine(fromNode, toNode)) {
        // 获取相关的分支连线
        const branchConns = getBranchConnections(fromNode);
        branchConns.forEach(conn => {
          const branchId = getConnectionId(conn.from, conn.to);
          newStates[branchId] = newState;
        });
      }
      
      return newStates;
    });
  };

  // 判断连线是否可选
  const isConnectionSelectable = (connection: { from: string, to: string }) => {
    // 如果还没有选择起点，只能选择从起始节点开始的连线
    if (!debugRange.start) {
      return connection.from === 'start';
    }

    // 如果已经选择了起点，只能选择从当前节点出发的连线
    if (debugRange.start && !debugRange.end) {
      // 获取从起点到目标节点的所有可能路径
      const allPaths = getAllPossiblePaths('start', connection.to);
      // 确保连线是有效路径的一部分
      return allPaths.some(path => {
        const fromIndex = path.indexOf(connection.from);
        const toIndex = path.indexOf(connection.to);
        return fromIndex !== -1 && toIndex === fromIndex + 1;
      });
    }

    return false;
  };

  // 获取从起点到终点的所有可能路径
  const getAllPossiblePaths = (start: string, end: string): string[][] => {
    const paths: string[][] = [];
    const visited = new Set<string>();

    const dfs = (current: string, path: string[]) => {
      if (current === end) {
        paths.push([...path]);
        return;
      }

      // 获取当前节点的所有后续连接
      const nextConnections = connections.filter(conn => conn.from === current);
      for (const conn of nextConnections) {
        if (!visited.has(conn.to)) {
          visited.add(conn.to);
          dfs(conn.to, [...path, conn.to]);
          visited.delete(conn.to);
        }
      }
    };

    visited.add(start);
    dfs(start, [start]);
    return paths;
  };

  // 处理断点点击
  const handleBreakpointClick = (connection: { from: string, to: string }) => {
    if (isDebugging) return; // 调试过程中不允许修改范围

    setDebugRange(prev => {
      // 如果点击的是当前选中的起点或终点，取消选择
      if (prev.start === connection.from || prev.end === connection.to) {
        return { start: '', end: '' };
      }

      // 如果还没有选择起点
      if (!prev.start) {
        // 只允许从开始节点出发的连线作为起点
        if (connection.from === 'start') {
          return { start: 'start', end: '' };
        }
        return prev;
      }

      // 如果已经选择了起点，但还没有选择终点
      if (prev.start && !prev.end) {
        // 检查是否是有效的终点（从起点可达）
        const allPaths = getAllPossiblePaths('start', connection.to);
        if (allPaths.length > 0) {
          return { ...prev, end: connection.to };
        }
      }

      return prev;
    });
  };

  // 开始调试
  const startDebugging = () => {
    if (!debugRange.start || !debugRange.end) return;
    
    setIsDebugging(true);
    // 设置起始节点为已完成状态
    setDebugProgress({ [debugRange.start]: 'completed' });
  };

  // 开始自动执行
  const startAutoExecution = () => {
    setIsAutoExecuting(true);
    executeNextNode();
  };

  // 停止自动执行
  const stopAutoExecution = () => {
    setIsAutoExecuting(false);
  };

  // 清除所有调试状态
  const clearAllDebugStates = () => {
    setConnectionStates({});
    setRunningConnections(new Set());
    setDebugProgress({});
    setDebugRange({start: '', end: ''});
    setIsDebugging(false);
    setIsAutoExecuting(false);
  };

  // 处理结构化提取节点配置
  const handleInfoExtractNodeClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.type === 'info-extract') {
      setEditingNodeId(nodeId);
      const config = node.config || {
        nodeName: node.label,
        model: 'gpt-4',
        schema: []
      };
      setCurrentInfoExtractConfig(config);
      setConfigMode('form');
      setJsonError('');
      
      // 初始化JSON配置
      const schema = {
        type: 'object',
        properties: {} as Record<string, any>,
        required: [] as string[]
      };
      config.schema.forEach(field => {
        if (field.name) {
          if (field.type === 'array') {
            schema.properties[field.name] = {
              type: field.type,
              items: {
                type: field.itemType || 'string'
              },
              description: field.description
            };
          } else if (field.type === 'object' && field.properties && field.properties.length > 0) {
            const objectProperties: Record<string, any> = {};
            const objectRequired: string[] = [];
            
            field.properties.forEach(prop => {
              if (prop.name) {
                objectProperties[prop.name] = {
                  type: prop.type,
                  description: prop.description
                };
                if (prop.required) {
                  objectRequired.push(prop.name);
                }
              }
            });
            
            schema.properties[field.name] = {
              type: field.type,
              properties: objectProperties,
              required: objectRequired,
              description: field.description
            };
          } else {
            schema.properties[field.name] = {
              type: field.type,
              description: field.description
            };
          }
          if (field.required) {
            schema.required.push(field.name);
          }
        }
      });
      setJsonConfig(JSON.stringify(schema, null, 2));
      
      setShowInfoExtractModal(true);
    }
  };

  // 处理Python节点配置
  const handlePythonNodeClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.type === 'python') {
      setEditingPythonNodeId(nodeId);
      const config = node.pythonConfig || {
        nodeName: node.label,
        inputValue: 'documents',
        outputValue: 'documents',
        pythonScript: ''
      };
      setCurrentPythonConfig(config);
      setShowPythonModal(true);
    }
  };

  // 添加新的schema字段
  const addSchemaField = (afterIndex?: number, fieldType: SchemaField['type'] = 'string') => {
    setCurrentInfoExtractConfig(prev => {
      const newField: SchemaField = {
        name: '',
        type: fieldType,
        description: '',
        required: true,
        itemType: 'string' as SchemaField['itemType'] // 默认数组元素类型
      };
      
      // 如果是Object类型，自动添加一个默认属性
      if (fieldType === 'object') {
        newField.properties = [{
          name: '',
          type: 'string' as SchemaField['type'],
          description: '',
          required: true
        }];
      }
      
      const newSchema = [...prev.schema];
      if (afterIndex !== undefined) {
        // 在指定位置后插入
        newSchema.splice(afterIndex + 1, 0, newField);
      } else {
        // 添加到末尾
        newSchema.push(newField);
      }
      
      const newConfig = {
        ...prev,
        schema: newSchema
      };
      // 实时更新JSON配置
      updateJsonFromForm(newConfig);
      return newConfig;
    });
  };

  // 更新schema字段
  const updateSchemaField = (index: number, field: Partial<SchemaField>) => {
    setCurrentInfoExtractConfig(prev => {
      const newConfig = {
        ...prev,
        schema: prev.schema.map((item, i) => {
          if (i === index) {
            const updatedField = { ...item, ...field };
            
            // 如果类型改变为object且还没有properties，自动添加一个默认属性
            if (field.type === 'object' && !updatedField.properties) {
              updatedField.properties = [{
                name: '',
                type: 'string' as SchemaField['type'],
                description: '',
                required: true
              }];
            }
            
            // 如果类型改变为非object，清除properties
            if (field.type && field.type !== 'object') {
              delete updatedField.properties;
            }
            
            return updatedField;
          }
          return item;
        })
      };
      // 实时更新JSON配置
      updateJsonFromForm(newConfig);
      return newConfig;
    });
  };

  // 删除schema字段
  const removeSchemaField = (index: number) => {
    setCurrentInfoExtractConfig(prev => {
      const newConfig = {
        ...prev,
        schema: prev.schema.filter((_, i) => i !== index)
      };
      // 实时更新JSON配置
      updateJsonFromForm(newConfig);
      return newConfig;
    });
  };

  // 从表单配置实时更新JSON配置
  const updateJsonFromForm = (config: InfoExtractConfig) => {
    const schema = {
      type: 'object',
      properties: {} as Record<string, any>,
      required: [] as string[]
    };

    config.schema.forEach(field => {
      if (field.name) {
        if (field.type === 'array') {
          schema.properties[field.name] = {
            type: field.type,
            items: {
              type: field.itemType || 'string'
            },
            description: field.description
          };
        } else if (field.type === 'object' && field.properties && field.properties.length > 0) {
          const objectProperties: Record<string, any> = {};
          const objectRequired: string[] = [];
          
          field.properties.forEach(prop => {
            if (prop.name) {
              objectProperties[prop.name] = {
                type: prop.type,
                description: prop.description
              };
              if (prop.required) {
                objectRequired.push(prop.name);
              }
            }
          });
          
          schema.properties[field.name] = {
            type: field.type,
            properties: objectProperties,
            required: objectRequired,
            description: field.description
          };
        } else {
          schema.properties[field.name] = {
            type: field.type,
            description: field.description
          };
        }
        if (field.required) {
          schema.required.push(field.name);
        }
      }
    });

    setJsonConfig(JSON.stringify(schema, null, 2));
    setJsonError('');
  };

  // 从JSON配置实时更新表单配置
  const updateFormFromJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // 验证JSON结构
      if (!parsed.type || parsed.type !== 'object' || !parsed.properties) {
        throw new Error('JSON Schema必须包含type: "object"和properties字段');
      }

      const newSchema: SchemaField[] = [];
      const requiredFields = parsed.required || [];

      Object.entries(parsed.properties).forEach(([name, prop]: [string, any]) => {
        const schemaField: SchemaField = {
          name,
          type: prop.type || 'string',
          description: prop.description || '',
          required: requiredFields.includes(name)
        };

        // 如果是数组类型，解析items字段
        if (prop.type === 'array' && prop.items && prop.items.type) {
          schemaField.itemType = prop.items.type;
        }

        // 如果是对象类型，解析properties字段
        if (prop.type === 'object' && prop.properties) {
          const objectProperties: SchemaField[] = [];
          const objectRequired = prop.required || [];
          
          Object.entries(prop.properties).forEach(([propName, propDef]: [string, any]) => {
            objectProperties.push({
              name: propName,
              type: propDef.type || 'string',
              description: propDef.description || '',
              required: objectRequired.includes(propName)
            });
          });
          
          schemaField.properties = objectProperties;
        }

        newSchema.push(schemaField);
      });

      setCurrentInfoExtractConfig(prev => ({
        ...prev,
        schema: newSchema
      }));
      setJsonError('');
    } catch (error) {
      setJsonError(`JSON格式错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 处理JSON配置变化
  const handleJsonConfigChange = (value: string) => {
    setJsonConfig(value);
    
    // 如果JSON为空，不进行解析
    if (value.trim() === '') {
      setJsonError('');
      return;
    }
    
    // 实时更新表单配置
    updateFormFromJson(value);
  };

  // 保存结构化提取节点配置
  const saveInfoExtractConfig = () => {
    // 如果是JSON模式且有错误，不保存
    if (configMode === 'json' && jsonError) {
      return;
    }
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === editingNodeId 
          ? { 
              ...node, 
              label: currentInfoExtractConfig.nodeName,
              config: currentInfoExtractConfig 
            }
          : node
      )
    );
    setShowInfoExtractModal(false);
  };

  // 保存Python节点配置
  const savePythonConfig = () => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === editingPythonNodeId 
          ? { 
              ...node, 
              label: currentPythonConfig.nodeName,
              pythonConfig: currentPythonConfig 
            }
          : node
      )
    );
    setShowPythonModal(false);
  };

  // 生成JSON Schema预览
  const generateJsonSchema = () => {
    const schema = {
      type: 'object',
      properties: {} as Record<string, any>,
      required: [] as string[]
    };

    currentInfoExtractConfig.schema.forEach(field => {
      if (field.name) {
        if (field.type === 'array') {
          schema.properties[field.name] = {
            type: field.type,
            items: {
              type: field.itemType || 'string'
            },
            description: field.description
          };
        } else if (field.type === 'object' && field.properties && field.properties.length > 0) {
          const objectProperties: Record<string, any> = {};
          const objectRequired: string[] = [];
          
          field.properties.forEach(prop => {
            if (prop.name) {
              objectProperties[prop.name] = {
                type: prop.type,
                description: prop.description
              };
              if (prop.required) {
                objectRequired.push(prop.name);
              }
            }
          });
          
          schema.properties[field.name] = {
            type: field.type,
            properties: objectProperties,
            required: objectRequired,
            description: field.description
          };
        } else {
          schema.properties[field.name] = {
            type: field.type,
            description: field.description
          };
        }
        if (field.required) {
          schema.required.push(field.name);
        }
      }
    });

    return JSON.stringify(schema, null, 2);
  };

  // 切换配置模式
  const switchConfigMode = (mode: 'form' | 'json') => {
    setConfigMode(mode);
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
      description,
      nodes: nodes.map(node => ({
        id: node.id,
        label: node.label,
        type: node.type,
        position: { x: node.x, y: node.y },
        config: node.config
      }))
    });
  };

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  // 修改isConnectionInDebugRange函数，使其能够更准确地判断连线是否会被执行
  const isConnectionInDebugRange = (fromNode: string, toNode: string) => {
    if (!debugRange.start || !debugRange.end) {
      // 如果只选择了起点，显示所有从起点出发的可能路径
      if (debugRange.start === 'start') {
        const allPaths = getAllPossiblePaths('start', toNode);
        for (const path of allPaths) {
          const fromIndex = path.indexOf(fromNode);
          const toIndex = path.indexOf(toNode);
          if (fromIndex !== -1 && toIndex === fromIndex + 1) {
            return true;
          }
        }
        return false;
      }
      return true;
    }
    
    // 如果已经选择了起点和终点，找出所有可能的执行路径
    const executionPaths = getAllPossiblePaths(debugRange.start, debugRange.end);
    
    // 检查当前连线是否在任何一条执行路径上
    for (const path of executionPaths) {
      const fromIndex = path.indexOf(fromNode);
      const toIndex = path.indexOf(toNode);
      if (fromIndex !== -1 && toIndex === fromIndex + 1) {
        return true;
      }
    }
    
    return false;
  };

  // 获取断点样式
  const getBreakpointStyle = (connection: { from: string, to: string }) => {
    // 调试过程中显示普通断点样式
    if (isDebugging) {
      return {
        fill: breakpoints.has(getConnectionId(connection.from, connection.to)) ? "#ef4444" : "white",
        stroke: breakpoints.has(getConnectionId(connection.from, connection.to)) ? "#ef4444" : "#94a3b8"
      };
    }

    // 选择范围过程中的样式
    if (connection.from === debugRange.start && !debugRange.end) {
      // 已选择为起点
      return { fill: "#10b981", stroke: "#10b981" };
    } else if (debugRange.start && connection.to === debugRange.end) {
      // 已选择为终点
      return { fill: "#3b82f6", stroke: "#3b82f6" };
    } else if (!debugRange.start && connection.from === 'start') {
      // 可选择为起点
      return { fill: "white", stroke: "#10b981" };
    } else if (debugRange.start && !debugRange.end && getAllPossiblePaths('start', connection.to).length > 0) {
      // 可选择为终点
      return { fill: "white", stroke: "#3b82f6" };
    }

    // 默认样式
    return { fill: "white", stroke: "#94a3b8" };
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
          
          // 节点宽度和高度
          const nodeWidth = 120;
          const nodeHeight = 30;
          const fromX = fromPos.x + nodeWidth;
          const fromY = fromPos.y + nodeHeight/2;
          const toX = toPos.x;
          const toY = toPos.y + nodeHeight/2;

          // 特殊处理从start到python1的连接
          if (connection.from === 'start' && connection.to === 'python1') {
            const controlX1 = fromX + 40;
            const controlX2 = toX - 40;
            pathD = `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
            midPoint = { x: (fromX + toX) / 2, y: fromY };
          }
          // 特殊处理从python1到解析节点的分叉连接
          else if (connection.from === 'python1' && 
              ['text-parse', 'image-parse', 'audio-parse'].includes(connection.to)) {
            // 计算分流点
            const splitX = fromX + 40;
            const splitY = fromPos.y + nodeHeight/2;
            
            // 使用两段三次贝塞尔曲线，先到分流点，再到目标节点
            const controlX1 = fromX + 20;
            const controlX2 = splitX - 20;
            const controlX3 = splitX + 40;
            const controlX4 = toX - 40;
            
            pathD = `M ${fromX} ${fromY} 
                    C ${controlX1} ${fromY}, ${controlX2} ${splitY}, ${splitX} ${splitY}
                    C ${controlX3} ${splitY}, ${controlX4} ${toY}, ${toX} ${toY}`;
            
            midPoint = { 
              x: (splitX + toX) / 2, 
              y: (splitY + toY) / 2 
            };
          }
          // 特殊处理从解析节点到python2的汇聚连接
          else if (['text-parse', 'image-parse', 'audio-parse'].includes(connection.from) && 
                   connection.to === 'python2') {
            // 计算汇合点
            const mergeX = toX - 80;
            const mergeY = toPos.y + nodeHeight/2;
            
            // 使用两段三次贝塞尔曲线，先向中间汇合，再到目标节点
            const controlX1 = fromX + 40;
            const controlX2 = mergeX - 40;
            const controlX3 = mergeX + 20;
            const controlX4 = toX - 20;
            
            pathD = `M ${fromX} ${fromY} 
                    C ${controlX1} ${fromY}, ${controlX2} ${mergeY}, ${mergeX} ${mergeY}
                    C ${controlX3} ${mergeY}, ${controlX4} ${toY}, ${toX} ${toY}`;
            
            midPoint = { 
              x: (fromX + mergeX) / 2, 
              y: (fromY + mergeY) / 2 
            };
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
          let opacity = "1";
          let isInRange = isConnectionInDebugRange(connection.from, connection.to);
          
          // 检查连线是否在调试范围外
          if (debugRange.start && debugRange.end) {
            if (!isInRange) {
              strokeColor = "#d1d5db";
              opacity = "0.3";
            } else {
              // 在范围内的连线标记为绿色
              strokeColor = "#10b981";
              strokeWidth = "2.5";
            }
          }
          
          // 调试模式下的连线样式
          if (isDebugMode) {
            if (!isDebugging) {
              // 调试范围选择阶段
              if (!debugRange.start && connection.from === 'start') {
                // 可选择的起始连线
                strokeColor = "#10b981"; // 绿色
                strokeWidth = "3";
                opacity = "1";
              } else if (debugRange.start && !debugRange.end && isConnectionSelectable(connection)) {
                // 可选择的终点连线
                strokeColor = "#3b82f6"; // 蓝色
                strokeWidth = "3";
                opacity = "1";
              } else if (!isInRange) {
                // 不可选择的连线
                strokeColor = "#d1d5db";
                opacity = "0.3";
              }
            } else {
              // 调试执行阶段
              if (isInRange) {
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
            }
          }

          // 判断是否是主线或特殊连线
          const isMain = isMainConnection(connection.from, connection.to);
          const isSplitMain = isSplitMainLine(connection.from, connection.to);
          const isMergeMain = isMergeMainLine(connection.from, connection.to);
          
          // 调整控制按钮的大小和样式
          const buttonSize = isMain || isSplitMain || isMergeMain ? 22 : 18;
          const buttonStrokeWidth = isMain || isSplitMain || isMergeMain ? 2.5 : 2;
          
          // 判断是否是选择范围的候选连线
          const isSelectable = isDebugMode && !isDebugging;
          const isStartCandidate = !debugRange.start;
          const isEndCandidate = debugRange.start && !debugRange.end && connection.from !== debugRange.start;
          const isSelected = (connection.from === debugRange.start && !debugRange.end) || 
                           (debugRange.start && connection.to === debugRange.end);

          return (
            <g key={`connection-${index}`}>
              <path
                d={pathD}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={connectionStates[connectionId] === 'disabled' ? "5,5" : "none"}
                opacity={opacity}
              />
              
              {/* 在连线中点添加断点按钮 */}
              {isDebugMode && (
                <>
                  {/* 分叉连线的断点 */}
                  {connection.from === 'python1' && 
                   ['text-parse', 'image-parse', 'audio-parse'].includes(connection.to) && (
                    <>
                      {/* 主线断点 - 只在第一个分支连线上显示 */}
                      {connection.to === 'text-parse' && (
                        <g
                          transform={`translate(${(fromX + fromX + 40) / 2}, ${fromY})`}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isDebugging) {
                              toggleBreakpoint(`${connection.from}-main-split`);
                            } else {
                              handleBreakpointClick({from: connection.from, to: 'split-point'});
                            }
                          }}
                        >
                          <circle
                            r="6"
                            fill={getBreakpointStyle({from: connection.from, to: connection.to}).fill}
                            stroke={getBreakpointStyle({from: connection.from, to: connection.to}).stroke}
                            strokeWidth="2"
                            className="transition-all"
                          />
                          {(isDebugging && breakpoints.has(`${connection.from}-main-split`)) && (
                            <circle r="3" fill="white" />
                          )}
                        </g>
                      )}

                      {/* 分叉点断点 */}
                      <g
                        transform={`translate(${fromX + 40}, ${fromY})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDebugging) {
                            toggleBreakpoint(`${connection.from}-split->${connection.to}`);
                          } else {
                            handleBreakpointClick({from: connection.from, to: connection.to});
                          }
                        }}
                      >
                        <circle
                          r="6"
                          fill={getBreakpointStyle({from: connection.from, to: connection.to}).fill}
                          stroke={getBreakpointStyle({from: connection.from, to: connection.to}).stroke}
                          strokeWidth="2"
                          className="transition-all"
                        />
                        {(isDebugging && breakpoints.has(`${connection.from}-split->${connection.to}`)) && (
                          <circle r="3" fill="white" />
                        )}
                      </g>
                      
                      {/* 分叉后的断点 */}
                      <g
                        transform={`translate(${(fromX + 40 + toX) / 2}, ${(fromY + toY) / 2})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDebugging) {
                            toggleBreakpoint(`${connection.from}-branch->${connection.to}`);
                          } else {
                            handleBreakpointClick({from: connection.from, to: connection.to});
                          }
                        }}
                      >
                        <circle
                          r="6"
                          fill={getBreakpointStyle({from: connection.from, to: connection.to}).fill}
                          stroke={getBreakpointStyle({from: connection.from, to: connection.to}).stroke}
                          strokeWidth="2"
                          className="transition-all"
                        />
                        {(isDebugging && breakpoints.has(`${connection.from}-branch->${connection.to}`)) && (
                          <circle r="3" fill="white" />
                        )}
                      </g>
                    </>
                  )}

                  {/* 汇聚连线的断点 - 只针对从解析节点直接到python2的连线 */}
                  {['image-parse', 'audio-parse'].includes(connection.from) && 
                   connection.to === 'python2' && (
                    <>
                      {/* 汇聚前的断点 */}
                      <g
                        transform={`translate(${(fromX + toX - 80) / 2}, ${(fromY + toY) / 2})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDebugging) {
                            toggleBreakpoint(`${connection.from}-pre-merge->${connection.to}`);
                          } else {
                            handleBreakpointClick({from: connection.from, to: connection.to});
                          }
                        }}
                      >
                        <circle
                          r="6"
                          fill={getBreakpointStyle({from: connection.from, to: connection.to}).fill}
                          stroke={getBreakpointStyle({from: connection.from, to: connection.to}).stroke}
                          strokeWidth="2"
                          className="transition-all"
                        />
                        {(isDebugging && breakpoints.has(`${connection.from}-pre-merge->${connection.to}`)) && (
                          <circle r="3" fill="white" />
                        )}
                      </g>

                      {/* 汇聚后的断点 */}
                      <g
                        transform={`translate(${toX - 40}, ${toY})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDebugging) {
                            toggleBreakpoint(`${connection.from}-merge->${connection.to}`);
                          } else {
                            handleBreakpointClick({from: connection.from, to: connection.to});
                          }
                        }}
                      >
                        <circle
                          r="6"
                          fill={getBreakpointStyle({from: connection.from, to: connection.to}).fill}
                          stroke={getBreakpointStyle({from: connection.from, to: connection.to}).stroke}
                          strokeWidth="2"
                          className="transition-all"
                        />
                        {(isDebugging && breakpoints.has(`${connection.from}-merge->${connection.to}`)) && (
                          <circle r="3" fill="white" />
                        )}
                      </g>
                    </>
                  )}

                  {/* 普通连线的断点 - 包括所有其他连线 */}
                  {!(connection.from === 'python1' && 
                     ['text-parse', 'image-parse', 'audio-parse'].includes(connection.to)) &&
                   !(['image-parse', 'audio-parse'].includes(connection.from) && 
                     connection.to === 'python2') && (
                    <g
                      transform={`translate(${midPoint.x}, ${midPoint.y})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isDebugging) {
                          toggleBreakpoint(connectionId);
                        } else {
                          handleBreakpointClick(connection);
                        }
                      }}
                    >
                      <circle
                        r="6"
                        fill={getBreakpointStyle(connection).fill}
                        stroke={getBreakpointStyle(connection).stroke}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      {(isDebugging && breakpoints.has(connectionId)) && (
                        <circle r="3" fill="white" />
                      )}
                    </g>
                  )}
                </>
              )}
              
              {/* 在分流点添加小圆点 */}
              {connection.from === 'python1' && 
               ['text-parse', 'image-parse', 'audio-parse'].includes(connection.to) && (
                <circle
                  cx={fromX + 40}
                  cy={fromY}
                  r="4"
                  fill={strokeColor}
                  opacity={opacity}
                />
              )}
              
              {/* 在汇合点添加小圆点 */}
              {(['text-parse', 'image-parse', 'audio-parse'].includes(connection.from) || 
                connection.from === 'text-python') && 
               connection.to === 'python2' && (
                <circle
                  cx={toX - 80}
                  cy={toY}
                  r="4"
                  fill={strokeColor}
                  opacity={opacity}
                />
              )}
              
              {/* 在目标节点处添加小圆点 */}
              <circle
                cx={toPos.x}
                cy={toPos.y + nodeHeight/2}
                r="3"
                fill={strokeColor}
                opacity={opacity}
              />
              
              {/* 调试模式下的控制按钮 */}
              {isDebugMode && isDebugging && (
                <g>
                  {/* 按钮背景圆圈 */}
                  <circle
                    cx={midPoint.x}
                    cy={midPoint.y}
                    r={buttonSize}
                    fill={isConnectionEnabled ? "#10b981" : "white"}
                    stroke={isConnectionEnabled ? "#10b981" : strokeColor}
                    strokeWidth={buttonStrokeWidth}
                    className={`cursor-pointer drop-shadow-md transition-all ${
                      !isNodeEnabled(connection.to) ? 'opacity-50' : ''
                    }`}
                    onClick={() => {
                      if (!isNodeEnabled(connection.to)) return;
                      toggleConnectionState(connectionId);
                    }}
                  />
                  
                  {/* 按钮图标 */}
                  {!isNodeEnabled(connection.to) ? (
                    // 节点未启用 - 锁定图标
                    <g className="cursor-not-allowed opacity-50">
                      <rect
                        x={midPoint.x - 4}
                        y={midPoint.y - 6}
                        width="8"
                        height="8"
                        rx="2"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="1.5"
                      />
                      <rect
                        x={midPoint.x - 2}
                        y={midPoint.y - 2}
                        width="4"
                        height="4"
                        fill={strokeColor}
                      />
                    </g>
                  ) : isConnectionRunning ? (
                    // 运行中 - 暂停图标
                    <g className="cursor-pointer">
                      <rect
                        x={midPoint.x - 5}
                        y={midPoint.y - 6}
                        width="4"
                        height="12"
                        fill={isConnectionEnabled ? "white" : strokeColor}
                      />
                      <rect
                        x={midPoint.x + 1}
                        y={midPoint.y - 6}
                        width="4"
                        height="12"
                        fill={isConnectionEnabled ? "white" : strokeColor}
                      />
                    </g>
                  ) : isConnectionEnabled ? (
                    // 已启用 - 播放图标
                    <polygon
                      points={`${midPoint.x - 5},${midPoint.y - 6} ${midPoint.x - 5},${midPoint.y + 6} ${midPoint.x + 6},${midPoint.y}`}
                      fill="white"
                      className="cursor-pointer"
                      onClick={() => {
                        if (!isNodeEnabled(connection.to)) return;
                        startConnectionDebug(connectionId);
                      }}
                    />
                  ) : (
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
                  )}
                  
                  {/* 主线标识 */}
                  {(isMain || isSplitMain || isMergeMain) && (
                    <circle
                      cx={midPoint.x}
                      cy={midPoint.y - buttonSize - 5}
                      r="3"
                      fill={isConnectionEnabled ? "#10b981" : strokeColor}
                      className="animate-pulse"
                    />
                  )}
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  // 拖拽排序处理函数
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedFieldIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedFieldIndex === null || draggedFieldIndex === dropIndex) {
      setDraggedFieldIndex(null);
      setDragOverIndex(null);
      return;
    }

    // 重新排列字段
    const newSchema = [...currentInfoExtractConfig.schema];
    const draggedField = newSchema[draggedFieldIndex];
    
    // 移除被拖拽的元素
    newSchema.splice(draggedFieldIndex, 1);
    
    // 在新位置插入元素
    const insertIndex = draggedFieldIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newSchema.splice(insertIndex, 0, draggedField);

    setCurrentInfoExtractConfig(prev => ({
      ...prev,
      schema: newSchema
    }));

    // 更新JSON配置
    updateJsonFromForm({
      ...currentInfoExtractConfig,
      schema: newSchema
    });

    setDraggedFieldIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedFieldIndex(null);
    setDragOverIndex(null);
  };

  // 添加Object类型的属性
  const addObjectProperty = (fieldIndex: number) => {
    setCurrentInfoExtractConfig(prev => {
      const newConfig = {
        ...prev,
        schema: prev.schema.map((field, index) => {
          if (index === fieldIndex) {
            const properties = field.properties || [];
            return {
              ...field,
              properties: [...properties, {
                name: '',
                type: 'string' as SchemaField['type'],
                description: '',
                required: false // 新添加的属性默认为非必填
              }]
            };
          }
          return field;
        })
      };
      // 实时更新JSON配置
      updateJsonFromForm(newConfig);
      return newConfig;
    });
  };

  // 删除Object类型的属性
  const removeObjectProperty = (fieldIndex: number, propertyIndex: number) => {
    setCurrentInfoExtractConfig(prev => {
      const newConfig = {
        ...prev,
        schema: prev.schema.map((field, index) => {
          if (index === fieldIndex && field.properties) {
            return {
              ...field,
              properties: field.properties.filter((_, i) => i !== propertyIndex)
            };
          }
          return field;
        })
      };
      // 实时更新JSON配置
      updateJsonFromForm(newConfig);
      return newConfig;
    });
  };

  // 更新Object类型的属性
  const updateObjectProperty = (fieldIndex: number, propertyIndex: number, updates: Partial<SchemaField>) => {
    setCurrentInfoExtractConfig(prev => {
      const newConfig = {
        ...prev,
        schema: prev.schema.map((field, index) => {
          if (index === fieldIndex && field.properties) {
            return {
              ...field,
              properties: field.properties.map((property, i) => 
                i === propertyIndex ? { ...property, ...updates } : property
              )
            };
          }
          return field;
        })
      };
      // 实时更新JSON配置
      updateJsonFromForm(newConfig);
      return newConfig;
    });
  };

  // 处理Python脚本上传
  const handlePythonScriptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.py')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCurrentPythonConfig(prev => ({
          ...prev,
          pythonScript: content
        }));
      };
      reader.readAsText(file);
    } else {
      alert('请选择.py文件');
    }
    // 清空input值，允许重复上传同一文件
    event.target.value = '';
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
                      if (e.target.checked) {
                        initializeDebugMode();
                      } else {
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
                    基础配置信息已锁定，无法修改。
                    <br />
                    {!isDebugging ? (
                      <>
                        请选择调试范围：
                        <br />
                        {!debugRange.start && (
                          <div className="text-green-600">
                            1. 点击连线上的圆点选择起点（绿色边框表示可选）
                          </div>
                        )}
                        {debugRange.start && !debugRange.end && (
                          <div className="text-blue-600">
                            2. 点击连线上的圆点选择终点（蓝色边框表示可选）
                            <br />
                            <span className="text-xs text-gray-500">
                              提示：只能选择从起点可达的连线
                            </span>
                          </div>
                        )}
                        {debugRange.start && debugRange.end && (
                          <>
                            已选择范围：从 {nodes.find(n => n.id === debugRange.start)?.label} 到 {nodes.find(n => n.id === debugRange.end)?.label}
                            <div className="mt-2">
                              <button
                                onClick={startDebugging}
                                className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                开始调试
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        调试范围：从 {nodes.find(n => n.id === debugRange.start)?.label} 到 {nodes.find(n => n.id === debugRange.end)?.label}
                        <br />
                        <span className="text-green-600">● 绿色</span> - 可执行 
                        <span className="text-orange-500 ml-2">● 橙色</span> - 运行中
                        <span className="text-gray-500 ml-2">● 灰色</span> - 等待前置节点
                        <div className="mt-2 space-y-2">
                          {!isAutoExecuting ? (
                            <button
                              onClick={startAutoExecution}
                              className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              disabled={runningConnections.size > 0}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              自动执行
                            </button>
                          ) : (
                            <button
                              onClick={stopAutoExecution}
                              className="w-full flex items-center justify-center px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              停止自动执行
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 调试控制按钮 */}
              {isDebugMode && isDebugging && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs font-medium text-blue-800 mb-2">
                      连线控制说明
                    </p>
                    <div className="text-xs text-blue-600 space-y-1">
                      <div>• 点击 <span className="font-mono">▶</span> 开始执行该连线</div>
                      <div>• 点击 <span className="font-mono">⏸</span> 暂停执行</div>
                      <div>• <span className="font-mono">🔒</span> 表示等待前置节点完成</div>
                      <div>• 点击连线上的圆点可以设置/取消断点（红色表示已设置）</div>
                      <div>• 执行到断点处会自动暂停</div>
                      <div>• 使用"自动执行"可以连续执行所有节点</div>
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
                <svg width="2100" height="500" className="absolute top-0 left-0" key="workflow-svg">
                  {renderConnections()}
                  
                  {/* 渲染节点 */}
                  {nodes.map((node) => (
                    <g key={node.id}>
                      <foreignObject x={node.x} y={node.y} width="120" height="30">
                        <div 
                          className={`px-3 py-1 rounded border text-xs font-medium text-center cursor-pointer hover:shadow-md transition-all relative ${getDebugNodeStyle(node.id)}`}
                          title={node.type === 'info-extract' && node.config && node.config.model 
                            ? `${node.label}\n模型: ${node.config.model}` 
                            : node.type === 'python' && node.pythonConfig
                            ? `${node.label}\n输入: ${node.pythonConfig.inputValue}\n输出: ${node.pythonConfig.outputValue}`
                            : node.label}
                          onClick={() => {
                            if (node.type === 'info-extract') {
                              handleInfoExtractNodeClick(node.id);
                            } else if (node.type === 'python') {
                              handlePythonNodeClick(node.id);
                            }
                          }}
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
                          {/* 结构化提取节点配置指示器 */}
                          {node.type === 'info-extract' && node.config && node.config.schema.length > 0 && (
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-cyan-500 rounded-full"></div>
                          )}
                          {/* Python节点配置指示器 */}
                          {node.type === 'python' && node.pythonConfig && node.pythonConfig.pythonScript && (
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                          )}
                          {/* 模型配置指示器 */}
                          {node.type === 'info-extract' && node.config && node.config.model && (
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" 
                                 title={`模型: ${node.config.model}`}></div>
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

      {/* 结构化提取节点配置弹窗 */}
      {showInfoExtractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[80vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">配置结构化提取节点</h2>
              <button
                onClick={() => setShowInfoExtractModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* 节点名称 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  节点名称
                </label>
                <input
                  type="text"
                  value={currentInfoExtractConfig.nodeName}
                  onChange={(e) => setCurrentInfoExtractConfig(prev => ({
                    ...prev,
                    nodeName: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="请输入节点名称"
                />
              </div>

              {/* 模型选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  信息提取模型
                </label>
                <select
                  value={currentInfoExtractConfig.model}
                  onChange={(e) => setCurrentInfoExtractConfig(prev => ({
                    ...prev,
                    model: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="llama-2-70b">Llama 2 70B</option>
                  <option value="qwen-turbo">通义千问 Turbo</option>
                  <option value="baichuan2-53b">百川2-53B</option>
                  <option value="chatglm3-6b">ChatGLM3-6B</option>
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  选择用于信息提取的大语言模型，不同模型在准确性和成本上有所差异
                </div>
              </div>

              {/* 提取字段标题 */}
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-900">提取字段</h3>
              </div>

              {/* Tab切换 */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => switchConfigMode('form')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        configMode === 'form'
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      表单配置
                    </button>
                    <button
                      onClick={() => switchConfigMode('json')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        configMode === 'json'
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      JSON配置
                    </button>
                  </nav>
                </div>
              </div>

              {/* 表单配置模式 */}
              {configMode === 'form' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Schema字段配置
                    </label>
                  </div>

                  {/* Schema字段列表 */}
                  <div className="space-y-3">
                    {currentInfoExtractConfig.schema.map((field, index) => (
                      <div key={index} className="space-y-2">
                        {/* 主字段行 */}
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                          {/* 折叠按钮 */}
                          {field.type === 'object' && (
                            <button
                              onClick={() => {
                                const newSchema = [...currentInfoExtractConfig.schema];
                                newSchema[index] = {
                                  ...newSchema[index],
                                  collapsed: !newSchema[index].collapsed
                                };
                                setCurrentInfoExtractConfig(prev => ({
                                  ...prev,
                                  schema: newSchema
                                }));
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {field.collapsed ? '▶' : '▼'}
                            </button>
                          )}
                          
                          {/* 字段名称 */}
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => updateSchemaField(index, { name: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="Field name"
                          />
                          
                          {/* 字段类型 */}
                          <select
                            value={field.type}
                            onChange={(e) => updateSchemaField(index, { type: e.target.value as SchemaField['type'] })}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 min-w-[120px]"
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="object">Object</option>
                            <option value="array">Array</option>
                          </select>
                          
                          {/* 数组元素类型 */}
                          {field.type === 'array' && (
                            <>
                              <span className="text-gray-400">/</span>
                              <select
                                value={field.itemType || 'string'}
                                onChange={(e) => updateSchemaField(index, { itemType: e.target.value as SchemaField['itemType'] })}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 min-w-[120px] bg-blue-50"
                              >
                                <option value="string">String</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                                <option value="object">Object</option>
                              </select>
                            </>
                          )}
                          
                          {/* 必填标记 */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateSchemaField(index, { required: e.target.checked })}
                              className="mr-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            <span className="text-red-500 text-lg">*</span>
                          </div>
                          
                          {/* 操作按钮 */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => addSchemaField(index)}
                              className="p-1 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"
                              title="添加字段"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeSchemaField(index)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="删除字段"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* 字段描述 */}
                        <div className="ml-8">
                          <input
                            type="text"
                            value={field.description}
                            onChange={(e) => updateSchemaField(index, { description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-gray-50"
                            placeholder="Field description"
                          />
                        </div>

                        {/* Object类型的嵌套属性 */}
                        {field.type === 'object' && !field.collapsed && (
                          <div className="ml-8 space-y-2">
                            {(field.properties || []).map((property, propIndex) => (
                              <div key={propIndex} className="space-y-2">
                                {/* 属性主行 */}
                                <div className="flex items-center gap-3 p-2 border border-gray-200 rounded bg-gray-50">
                                  {/* Object类型属性的折叠按钮 */}
                                  {property.type === 'object' && (
                                    <button
                                      onClick={() => {
                                        updateObjectProperty(index, propIndex, { 
                                          collapsed: !property.collapsed 
                                        });
                                      }}
                                      className="text-gray-400 hover:text-gray-600"
                                    >
                                      {property.collapsed ? '▶' : '▼'}
                                    </button>
                                  )}
                                  
                                  <input
                                    type="text"
                                    value={property.name}
                                    onChange={(e) => updateObjectProperty(index, propIndex, { name: e.target.value })}
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white"
                                    placeholder="property"
                                  />
                                  <select
                                    value={property.type}
                                    onChange={(e) => {
                                      const newType = e.target.value as SchemaField['type'];
                                      const updates: Partial<SchemaField> = { type: newType };
                                      
                                      // 如果改为object类型且还没有properties，自动添加一个默认属性
                                      if (newType === 'object' && !property.properties) {
                                        updates.properties = [{
                                          name: '',
                                          type: 'string' as SchemaField['type'],
                                          description: '',
                                          required: true
                                        }];
                                      }
                                      
                                      // 如果改为非object类型，清除properties
                                      if (newType !== 'object') {
                                        updates.properties = undefined;
                                      }
                                      
                                      updateObjectProperty(index, propIndex, updates);
                                    }}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white min-w-[100px]"
                                  >
                                    <option value="string">String</option>
                                    <option value="number">Number</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="array">Array</option>
                                    <option value="object">Object</option>
                                  </select>
                                  
                                  {/* 数组元素类型 */}
                                  {property.type === 'array' && (
                                    <>
                                      <span className="text-gray-400">/</span>
                                      <select
                                        value={property.itemType || 'string'}
                                        onChange={(e) => updateObjectProperty(index, propIndex, { itemType: e.target.value as SchemaField['itemType'] })}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-blue-50 min-w-[100px]"
                                      >
                                        <option value="string">String</option>
                                        <option value="number">Number</option>
                                        <option value="boolean">Boolean</option>
                                        <option value="object">Object</option>
                                      </select>
                                    </>
                                  )}
                                  
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={property.required}
                                      onChange={(e) => updateObjectProperty(index, propIndex, { required: e.target.checked })}
                                      className="mr-1 h-3 w-3 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                                    />
                                    <span className="text-red-500">*</span>
                                  </div>
                                  
                                  <button
                                    onClick={() => addObjectProperty(index)}
                                    className="p-1 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"
                                    title="添加属性"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  
                                  <button
                                    onClick={() => removeObjectProperty(index, propIndex)}
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                                
                                {/* 属性描述 */}
                                <div className="ml-4">
                                  <input
                                    type="text"
                                    value={property.description}
                                    onChange={(e) => updateObjectProperty(index, propIndex, { description: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white"
                                    placeholder="Property description"
                                  />
                                </div>
                                
                                {/* 递归渲染Object类型属性的嵌套属性 */}
                                {property.type === 'object' && !property.collapsed && (
                                  <div className="ml-4 space-y-2">
                                    {(property.properties || []).map((nestedProp, nestedIndex) => (
                                      <div key={nestedIndex} className="space-y-2">
                                        {/* 嵌套属性主行 */}
                                        <div className="flex items-center gap-3 p-2 border border-gray-200 rounded bg-gray-100">
                                          {/* 嵌套Object的折叠按钮 */}
                                          {nestedProp.type === 'object' && (
                                            <button
                                              onClick={() => {
                                                const newProperties = [...(property.properties || [])];
                                                newProperties[nestedIndex] = {
                                                  ...newProperties[nestedIndex],
                                                  collapsed: !newProperties[nestedIndex].collapsed
                                                };
                                                updateObjectProperty(index, propIndex, { properties: newProperties });
                                              }}
                                              className="text-gray-400 hover:text-gray-600"
                                            >
                                              {nestedProp.collapsed ? '▶' : '▼'}
                                            </button>
                                          )}
                                          
                                          <input
                                            type="text"
                                            value={nestedProp.name}
                                            onChange={(e) => {
                                              const newProperties = [...(property.properties || [])];
                                              newProperties[nestedIndex] = {
                                                ...newProperties[nestedIndex],
                                                name: e.target.value
                                              };
                                              updateObjectProperty(index, propIndex, { properties: newProperties });
                                            }}
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white"
                                            placeholder="nested property"
                                          />
                                          <select
                                            value={nestedProp.type}
                                            onChange={(e) => {
                                              const newType = e.target.value as SchemaField['type'];
                                              const newProperties = [...(property.properties || [])];
                                              const updates: Partial<SchemaField> = { type: newType };
                                              
                                              // 如果改为object类型且还没有properties，自动添加一个默认属性
                                              if (newType === 'object' && !nestedProp.properties) {
                                                updates.properties = [{
                                                  name: '',
                                                  type: 'string' as SchemaField['type'],
                                                  description: '',
                                                  required: true
                                                }];
                                              }
                                              
                                              // 如果改为非object类型，清除properties
                                              if (newType !== 'object') {
                                                updates.properties = undefined;
                                              }
                                              
                                              newProperties[nestedIndex] = {
                                                ...newProperties[nestedIndex],
                                                ...updates
                                              };
                                              updateObjectProperty(index, propIndex, { properties: newProperties });
                                            }}
                                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white min-w-[80px]"
                                          >
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="array">Array</option>
                                            <option value="object">Object</option>
                                          </select>
                                          
                                          {/* 嵌套数组元素类型 */}
                                          {nestedProp.type === 'array' && (
                                            <>
                                              <span className="text-gray-400">/</span>
                                              <select
                                                value={nestedProp.itemType || 'string'}
                                                onChange={(e) => {
                                                  const newProperties = [...(property.properties || [])];
                                                  newProperties[nestedIndex] = {
                                                    ...newProperties[nestedIndex],
                                                    itemType: e.target.value as SchemaField['itemType']
                                                  };
                                                  updateObjectProperty(index, propIndex, { properties: newProperties });
                                                }}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-blue-50 min-w-[80px]"
                                              >
                                                <option value="string">String</option>
                                                <option value="number">Number</option>
                                                <option value="boolean">Boolean</option>
                                                <option value="object">Object</option>
                                              </select>
                                            </>
                                          )}
                                          
                                          <div className="flex items-center">
                                            <input
                                              type="checkbox"
                                              checked={nestedProp.required}
                                              onChange={(e) => {
                                                const newProperties = [...(property.properties || [])];
                                                newProperties[nestedIndex] = {
                                                  ...newProperties[nestedIndex],
                                                  required: e.target.checked
                                                };
                                                updateObjectProperty(index, propIndex, { properties: newProperties });
                                              }}
                                              className="mr-1 h-3 w-3 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            <span className="text-red-500">*</span>
                                          </div>
                                          
                                          <button
                                            onClick={() => {
                                              const newProperties = [...(property.properties || [])];
                                              newProperties.push({
                                                name: '',
                                                type: 'string' as SchemaField['type'],
                                                description: '',
                                                required: false
                                              });
                                              updateObjectProperty(index, propIndex, { properties: newProperties });
                                            }}
                                            className="p-1 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"
                                            title="添加嵌套属性"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                          
                                          <button
                                            onClick={() => {
                                              const newProperties = [...(property.properties || [])];
                                              newProperties.splice(nestedIndex, 1);
                                              updateObjectProperty(index, propIndex, { properties: newProperties });
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                        
                                        {/* 嵌套属性描述 */}
                                        <div className="ml-4">
                                          <input
                                            type="text"
                                            value={nestedProp.description}
                                            onChange={(e) => {
                                              const newProperties = [...(property.properties || [])];
                                              newProperties[nestedIndex] = {
                                                ...newProperties[nestedIndex],
                                                description: e.target.value
                                              };
                                              updateObjectProperty(index, propIndex, { properties: newProperties });
                                            }}
                                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white"
                                            placeholder="Nested property description"
                                          />
                                        </div>
                                        
                                        {/* 这里可以继续递归，但为了简化先支持二级嵌套 */}
                                        {nestedProp.type === 'object' && !nestedProp.collapsed && (
                                          <div className="ml-4 p-2 border border-dashed border-gray-300 rounded text-center text-gray-500 text-sm">
                                            继续嵌套功能开发中...
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    
                                    {/* 为Object类型属性添加嵌套属性的按钮 */}
                                    {(!property.properties || property.properties.length === 0) && (
                                      <div className="flex justify-end">
                                        <button
                                          onClick={() => {
                                            updateObjectProperty(index, propIndex, { 
                                              properties: [{
                                                name: '',
                                                type: 'string' as SchemaField['type'],
                                                description: '',
                                                required: false
                                              }]
                                            });
                                          }}
                                          className="flex items-center gap-2 px-3 py-2 text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded border border-dashed border-cyan-300"
                                        >
                                          <Plus className="w-4 h-4" />
                                          Add nested property
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            {/* 如果没有属性，显示添加第一个属性的按钮 */}
                            {(!field.properties || field.properties.length === 0) && (
                              <div className="flex justify-end">
                                <button
                                  onClick={() => addObjectProperty(index)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded border border-dashed border-cyan-300"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add property
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* 空状态 */}
                    {currentInfoExtractConfig.schema.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        <button
                          onClick={() => addSchemaField()}
                          className="flex items-center gap-2 px-4 py-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded border border-dashed border-cyan-300 mx-auto"
                        >
                          <Plus className="w-5 h-5" />
                          添加字段
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* JSON配置模式 */}
              {configMode === 'json' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      JSON Schema配置
                    </label>
                    <button
                      onClick={() => setIsJsonFullscreen(true)}
                      className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      title="全屏编辑"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">
                      请输入标准的JSON Schema格式，使用"required"数组指定必填字段
                    </p>
                  </div>
                  <textarea
                    value={jsonConfig}
                    onChange={(e) => handleJsonConfigChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      jsonError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={12}
                    placeholder={`{
"type": "object",
"properties": {
  "company_name": {
    "type": "string",
    "description": "提取文档中的公司名称"
  },
  "amount": {
    "type": "number",
    "description": "提取合同金额"
  },
  "keywords": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "提取文档中的关键词列表"
  },
  "contact_info": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "联系电话"
      },
      "email": {
        "type": "string",
        "description": "邮箱地址"
      }
    },
    "required": ["phone"],
    "description": "联系信息"
  }
},
"required": ["company_name", "amount"]
}`}
                  />
                  {jsonError && (
                    <div className="mt-2 text-sm text-red-600">
                      {jsonError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowInfoExtractModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={saveInfoExtractConfig}
                className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
              >
                <Save className="w-4 h-4 mr-1" />
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Python节点配置弹窗 */}
      {showPythonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[80vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">配置Python自定义节点</h2>
              <button
                onClick={() => setShowPythonModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* 节点名称 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  节点名称
                </label>
                <input
                  type="text"
                  value={currentPythonConfig.nodeName}
                  onChange={(e) => setCurrentPythonConfig(prev => ({
                    ...prev,
                    nodeName: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="请输入节点名称"
                />
              </div>

              {/* 输入值 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输入值
                </label>
                <input
                  type="text"
                  value={currentPythonConfig.inputValue}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* 返回值 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  返回值
                </label>
                <input
                  type="text"
                  value={currentPythonConfig.outputValue}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* 文档说明 */}
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  不同上下游documents参数内容有所区别，详情参考文档{' '}
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    python自定义节点
                  </a>
                </p>
              </div>

              {/* Python脚本编辑框 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Python脚本
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsPythonFullscreen(true)}
                      className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      title="全屏编辑"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <label className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded cursor-pointer hover:bg-yellow-200 transition-colors">
                      <Upload className="w-4 h-4 mr-1" />
                      载入脚本内容
                      <input
                        type="file"
                        accept=".py"
                        onChange={handlePythonScriptUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <textarea
                  value={currentPythonConfig.pythonScript}
                  onChange={(e) => setCurrentPythonConfig(prev => ({
                    ...prev,
                    pythonScript: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none font-mono text-sm"
                  rows={12}
                  placeholder={`# 请输入Python脚本或上传.py文件
# 函数定义示例：
def process_documents(documents):
    """
    处理文档的自定义函数
    
    Args:
        documents: 输入的文档数据
        
    Returns:
        documents: 处理后的文档数据
    """
    # 在这里编写您的处理逻辑
    processed_documents = documents
    
    return processed_documents`}
                />
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPythonModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={savePythonConfig}
                className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                <Save className="w-4 h-4 mr-1" />
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Python脚本全屏编辑弹窗 */}
      {isPythonFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] max-w-6xl overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Python脚本编辑 - 全屏编辑</h2>
              <div className="flex items-center space-x-2">
                <label className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded cursor-pointer hover:bg-yellow-200 transition-colors">
                  <Upload className="w-4 h-4 mr-1" />
                  载入脚本内容
                  <input
                    type="file"
                    accept=".py"
                    onChange={handlePythonScriptUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setIsPythonFullscreen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="关闭全屏"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col">
              <div className="mb-3">
                <p className="text-sm text-gray-500">
                  请输入Python脚本代码，确保包含处理documents参数的函数
                </p>
              </div>
              <div className="flex-1 flex flex-col">
                <textarea
                  value={currentPythonConfig.pythonScript}
                  onChange={(e) => setCurrentPythonConfig(prev => ({
                    ...prev,
                    pythonScript: e.target.value
                  }))}
                  className="w-full h-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder={`# 请输入Python脚本或上传.py文件
# 函数定义示例：
def process_documents(documents):
    """
    处理文档的自定义函数
    
    Args:
        documents: 输入的文档数据
        
    Returns:
        documents: 处理后的文档数据
    """
    # 在这里编写您的处理逻辑
    processed_documents = documents
    
    # 示例：过滤文档
    # filtered_documents = [doc for doc in documents if some_condition(doc)]
    
    # 示例：转换文档格式
    # for doc in processed_documents:
    #     doc['processed'] = True
    #     doc['timestamp'] = datetime.now()
    
    # 示例：数据清洗
    # processed_documents = clean_data(documents)
    
    # 示例：数据增强
    # processed_documents = enhance_data(documents)
    
    return processed_documents

# 您可以定义多个辅助函数
def helper_function(data):
    """
    辅助函数示例
    """
    return data

# 导入常用库（系统会自动处理依赖）
# import pandas as pd
# import numpy as np
# import json
# from datetime import datetime`}
                />
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setIsPythonFullscreen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                完成编辑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON全屏编辑弹窗 */}
      {isJsonFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] max-w-6xl overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">JSON Schema配置 - 全屏编辑</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsJsonFullscreen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  title="关闭全屏"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col">
              <div className="mb-3">
                <p className="text-sm text-gray-500">
                  请输入标准的JSON Schema格式，使用"required"数组指定必填字段
                </p>
              </div>
              <div className="flex-1 flex flex-col">
                <textarea
                  value={jsonConfig}
                  onChange={(e) => handleJsonConfigChange(e.target.value)}
                  className={`w-full h-full px-4 py-3 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none ${
                    jsonError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={`{
"type": "object",
"properties": {
  "company_name": {
    "type": "string",
    "description": "提取文档中的公司名称"
  },
  "amount": {
    "type": "number",
    "description": "提取合同金额"
  },
  "keywords": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "提取文档中的关键词列表"
  },
  "contact_info": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "联系电话"
      },
      "email": {
        "type": "string",
        "description": "邮箱地址"
      }
    },
    "required": ["phone"],
    "description": "联系信息"
  }
},
"required": ["company_name", "amount"]
}`}
                />
                {jsonError && (
                  <div className="mt-2 text-sm text-red-600">
                    {jsonError}
                  </div>
                )}
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setIsJsonFullscreen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                完成编辑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWorkflow; 