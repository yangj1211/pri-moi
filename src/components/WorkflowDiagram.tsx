import React, { useState, useEffect } from 'react';
import { FileText, Settings, X, Eye, GitBranch, GitMerge } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface NodeModalProps {
  node: any;
  isOpen: boolean;
  onClose: () => void;
  nodes: any[];
  onNodeChange: (node: any) => void;
  highlightedFileId: string | null;
  setHighlightedFileId: (fileId: string | null) => void;
}

const NodeModal: React.FC<NodeModalProps> = ({ node, isOpen, onClose, nodes, onNodeChange, highlightedFileId, setHighlightedFileId }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'files'>('files');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

  // 当节点变化时，重置预览状态
  useEffect(() => {
    if (node && node.id !== currentNodeId) {
      setPreviewFile(null);
      setCurrentNodeId(node.id);
      setActiveTab('files'); // 强制重置到文件标签页
      setHighlightedFileId(null); // 重置高亮状态
    }
  }, [node, currentNodeId]);

  // 清除高亮状态的定时器
  useEffect(() => {
    if (highlightedFileId) {
      const timer = setTimeout(() => {
        setHighlightedFileId(null);
      }, 3000); // 3秒后清除高亮
      return () => clearTimeout(timer);
    }
  }, [highlightedFileId]);

  if (!isOpen || !node) return null;

  // 模拟每个节点的配置信息
  const getNodeConfig = (nodeId: string) => {
    const configs: Record<string, any> = {
      'start': {
        name: '开始节点',
        type: '流程控制',
        description: '工作流的起始点，接收各种类型的输入文件',
        parameters: {
          '触发方式': '手动触发',
          '输入数据源': 'source_vol1',
          '并发处理': '是',
          '支持文件类型': 'doc, ppt, jpg, png, mp3, mp4, yaml, txt',
          '最大文件数': '100',
          '文件大小限制': '50MB'
        }
      },
      'text-parse': {
        name: '文本解析节点',
        type: '数据处理',
        description: '解析文本文件内容，提取关键信息',
        parameters: {
          '支持格式': 'txt, md, docx, pdf',
          '编码方式': 'UTF-8',
          '解析引擎': 'NLP Engine v2.0',
          '输出格式': 'JSON'
        }
      },
      'image-parse': {
        name: '图片解析节点',
        type: '数据处理',
        description: '解析图片文件，提取图像特征和元数据',
        parameters: {
          '支持格式': 'jpg, png, gif, bmp',
          '最大分辨率': '4096x4096',
          '特征提取': 'CNN模型',
          'OCR识别': '启用'
        }
      },
      'audio-parse': {
        name: '音频解析节点',
        type: '数据处理',
        description: '解析音频文件，提取音频特征',
        parameters: {
          '支持格式': 'mp3, wav, flac',
          '采样率': '44.1kHz',
          '特征提取': 'MFCC',
          '语音识别': '启用'
        }
      },
      'video-parse': {
        name: '视频解析节点',
        type: '数据处理',
        description: '解析视频文件，提取视频帧和音频',
        parameters: {
          '支持格式': 'mp4, avi, mov',
          '帧率': '30fps',
          '分辨率': '1920x1080',
          '音频提取': '启用'
        }
      },
      'python-custom': {
        name: 'Python2',
        type: '自定义处理',
        description: '执行自定义Python脚本进行数据处理',
        parameters: {
          '脚本路径': '/scripts/custom_process.py',
          '运行环境': 'Python 3.9',
          '内存限制': '2GB',
          '超时时间': '300秒'
        }
      },
      'python-preprocess': {
        name: 'Python1',
        type: '数据预处理',
        description: '执行Python脚本进行文件预处理和验证',
        parameters: {
          '脚本路径': '/scripts/preprocess.py',
          '运行环境': 'Python 3.9',
          '内存限制': '1GB',
          '超时时间': '180秒',
          '验证规则': '格式检查、编码检测'
        }
      },
      'clean': {
        name: '数据清洗',
        type: '数据处理',
        description: '清洗和标准化处理后的数据',
        parameters: {
          '去重策略': '基于内容哈希',
          '格式标准化': '启用',
          '异常值处理': '自动检测',
          '质量评分': '启用'
        }
      },
      'enhance': {
        name: '数据增强',
        type: '数据处理',
        description: '对清洗后的数据进行增强处理',
        parameters: {
          '增强算法': 'AI增强',
          '质量提升': '2x',
          '格式转换': '多格式输出',
          '索引构建': '启用'
        }
      },
      'end': {
        name: '结束节点',
        type: '流程控制',
        description: '工作流的结束点',
        parameters: {
          '输出位置': 'target_vol1',
          '结果通知': '启用',
          '日志记录': '详细模式',
          '清理临时文件': '是'
        }
      }
    };
    return configs[nodeId] || {};
  };

  // 模拟每个节点处理后的文件列表
  const getNodeFiles = (nodeId: string): FileItem[] => {
    const filesByNode: Record<string, FileItem[]> = {
      // 开始节点：原始输入文件
      'start': [
        {
          id: '1',
          name: '产品介绍.doc',
          type: 'doc',
          startTime: '2024-08-19 14:52:20',
          endTime: '2024-08-19 14:52:22',
          status: '处理完成'
        },
        {
          id: '2',
          name: '营销方案.ppt',
          type: 'ppt',
          startTime: '2024-08-19 14:52:20',
          endTime: '2024-08-19 14:52:23',
          status: '处理完成'
        },
        {
          id: '3',
          name: '用户头像.jpg',
          type: 'jpg',
          startTime: '2024-08-19 14:52:20',
          endTime: '2024-08-19 14:52:22',
          status: '处理完成'
        },
        {
          id: '4',
          name: '界面截图.png',
          type: 'png',
          startTime: '2024-08-19 14:52:20',
          endTime: '2024-08-19 14:52:23',
          status: '处理完成'
        },
        {
          id: '5',
          name: '背景音乐.mp3',
          type: 'mp3',
          startTime: '2024-08-19 14:52:20',
          endTime: '2024-08-19 14:52:24',
          status: '处理完成'
        },
        {
          id: '6',
          name: '宣传视频.mp4',
          type: 'mp4',
          startTime: '2024-08-19 14:52:20',
          endTime: '2024-08-19 14:52:25',
          status: '处理完成'
        },
        {
          id: '7',
          name: '配置文件.yaml',
          type: 'yaml',
          startTime: '2024-08-19 14:52:20',
          endTime: '2024-08-19 14:52:22',
          status: '处理完成'
        },
        {
          id: '8',
          name: '说明文档.txt',
          type: 'txt',
          startTime: '2024-08-19 14:52:21',
          endTime: '2024-08-19 14:52:23',
          status: '处理完成'
        }
      ],
      // Python预处理节点：对所有文件进行预处理
      'python-preprocess': [
        {
          id: '9',
          name: '预处理-产品介绍.doc',
          type: 'doc',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:42',
          status: '处理完成'
        },
        {
          id: '10',
          name: '预处理-营销方案.ppt',
          type: 'ppt',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:46',
          status: '处理完成'
        },
        {
          id: '11',
          name: '预处理-用户头像.jpg',
          type: 'jpg',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:28',
          status: '处理完成'
        },
        {
          id: '12',
          name: '预处理-界面截图.png',
          type: 'png',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:38',
          status: '处理失败'
        },
        {
          id: '13',
          name: '预处理-背景音乐.mp3',
          type: 'mp3',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:38',
          status: '处理完成'
        },
        {
          id: '14',
          name: '预处理-宣传视频.mp4',
          type: 'mp4',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:38',
          status: '处理完成'
        },
        {
          id: '15',
          name: '预处理-说明文档.txt',
          type: 'txt',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:28',
          status: '处理完成'
        }
      ],
      // 文本解析节点：只处理文本类文件（doc, ppt, txt）
      'text-parse': [
        {
          id: '16',
          name: '文本解析-产品介绍.json',
          type: 'json',
          startTime: '2024-08-19 14:52:45',
          endTime: '2024-08-19 14:52:58',
          status: '处理完成'
        },
        {
          id: '17',
          name: '文本解析-营销方案.json',
          type: 'json',
          startTime: '2024-08-19 14:52:47',
          endTime: '2024-08-19 14:53:02',
          status: '处理完成'
        },
        {
          id: '18',
          name: '文本解析-说明文档.json',
          type: 'json',
          startTime: '2024-08-19 14:52:50',
          endTime: '2024-08-19 14:53:05',
          status: '处理中'
        }
      ],
      // 图片解析节点：只处理图片文件（jpg）- png处理失败了所以没有
      'image-parse': [
        {
          id: '19',
          name: '图片解析-用户头像.json',
          type: 'json',
          startTime: '2024-08-19 14:52:30',
          endTime: '2024-08-19 14:52:45',
          status: '处理完成'
        }
      ],
      // 音频解析节点：只处理音频文件（mp3）
      'audio-parse': [
        {
          id: '20',
          name: '音频解析-背景音乐.json',
          type: 'json',
          startTime: '2024-08-19 14:52:40',
          endTime: '2024-08-19 14:52:55',
          status: '处理完成'
        }
      ],
      // 视频解析节点：只处理视频文件（mp4）
      'video-parse': [
        {
          id: '21',
          name: '视频解析-宣传视频.json',
          type: 'json',
          startTime: '2024-08-19 14:52:40',
          endTime: '2024-08-19 14:53:10',
          status: '处理完成'
        }
      ],
      // Python自定义节点：合并所有解析结果
      'python-custom': [
        {
          id: '22',
          name: '合并数据-产品介绍.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:15',
          endTime: '2024-08-19 14:53:30',
          status: '处理完成'
        },
        {
          id: '23',
          name: '合并数据-营销方案.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:15',
          endTime: '2024-08-19 14:53:35',
          status: '处理完成'
        },
        {
          id: '24',
          name: '合并数据-用户头像.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:15',
          endTime: '2024-08-19 14:53:25',
          status: '处理完成'
        },
        {
          id: '25',
          name: '合并数据-背景音乐.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:15',
          endTime: '2024-08-19 14:53:40',
          status: '处理完成'
        },
        {
          id: '26',
          name: '合并数据-宣传视频.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:15',
          endTime: '2024-08-19 14:53:45',
          status: '处理失败'
        }
      ],
      // 数据清洗节点：清洗成功处理的合并数据
      'clean': [
        {
          id: '27',
          name: '清洗数据-产品介绍.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:50',
          endTime: '2024-08-19 14:54:05',
          status: '处理完成'
        },
        {
          id: '28',
          name: '清洗数据-营销方案.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:50',
          endTime: '2024-08-19 14:54:10',
          status: '处理完成'
        },
        {
          id: '29',
          name: '清洗数据-用户头像.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:50',
          endTime: '2024-08-19 14:54:00',
          status: '处理完成'
        },
        {
          id: '30',
          name: '清洗数据-背景音乐.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:53:50',
          endTime: '2024-08-19 14:54:15',
          status: '处理完成'
        }
      ],
      // 数据增强节点：增强清洗后的数据
      'enhance': [
        {
          id: '31',
          name: '增强数据-产品介绍.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:54:20',
          endTime: '2024-08-19 14:54:35',
          status: '处理完成'
        },
        {
          id: '32',
          name: '增强数据-营销方案.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:54:20',
          endTime: '2024-08-19 14:54:40',
          status: '处理完成'
        },
        {
          id: '33',
          name: '增强数据-用户头像.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:54:20',
          endTime: '2024-08-19 14:54:30',
          status: '处理完成'
        },
        {
          id: '34',
          name: '增强数据-背景音乐.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:54:20',
          endTime: '2024-08-19 14:54:45',
          status: '处理完成'
        }
      ],
      // 结束节点：最终输出文件
      'end': [
        {
          id: '35',
          name: '最终结果-产品介绍.json',
          type: 'json',
          startTime: '2024-08-19 14:54:50',
          endTime: '2024-08-19 14:54:55',
          status: '处理完成'
        },
        {
          id: '36',
          name: '最终结果-营销方案.json',
          type: 'json',
          startTime: '2024-08-19 14:54:50',
          endTime: '2024-08-19 14:55:00',
          status: '处理完成'
        },
        {
          id: '37',
          name: '最终结果-用户头像.json',
          type: 'json',
          startTime: '2024-08-19 14:54:50',
          endTime: '2024-08-19 14:54:58',
          status: '处理完成'
        },
        {
          id: '38',
          name: '最终结果-背景音乐.json',
          type: 'json',
          startTime: '2024-08-19 14:54:50',
          endTime: '2024-08-19 14:55:05',
          status: '处理完成'
        },
        {
          id: '39',
          name: '处理报告.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:55:10',
          endTime: '2024-08-19 14:55:15',
          status: '处理完成'
        }
      ]
    };
    return filesByNode[nodeId] || [];
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '处理完成':
        return 'bg-green-100 text-green-800';
      case '处理中':
        return 'bg-blue-100 text-blue-800';
      case '处理失败':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取文件处理过程详情
  const getFileProcessDetails = (fileId: string, fileName: string) => {
    // 根据文件类型和节点生成不同的处理过程
    const baseSteps = [
      {
        name: '原始文件',
        status: 'completed',
        duration: '',
        description: '文件上传完成'
      }
    ];

    // 根据当前节点添加对应的处理步骤
    const nodeSteps: Record<string, any[]> = {
      'text-parse': [
        {
          name: '文本解析节点',
          status: 'completed',
          duration: '14s',
          description: '文本内容提取和分析'
        }
      ],
      'image-parse': [
        {
          name: '图片解析节点',
          status: 'completed',
          duration: '14s',
          description: '图像特征提取和元数据分析'
        }
      ],
      'audio-parse': [
        {
          name: '音频解析节点',
          status: 'completed',
          duration: '26s',
          description: '音频特征提取和语音识别'
        }
      ],
      'video-parse': [
        {
          name: '视频解析节点',
          status: 'completed',
          duration: '45s',
          description: '视频帧提取和音频分离'
        }
      ],
      'python-custom': [
        {
          name: 'Python2',
          status: 'completed',
          duration: '25s',
          description: '自定义脚本处理和数据合并'
        }
      ],
      'clean': [
        {
          name: '数据清洗',
          status: 'completed',
          duration: '30s',
          description: '数据去重和格式标准化'
        }
      ],
      'enhance': [
        {
          name: '数据增强',
          status: 'completed',
          duration: '15s',
          description: 'AI增强和质量提升'
        }
      ]
    };

    return [...baseSteps, ...(nodeSteps[node.id] || [])];
  };

  const handlePreviewFile = (file: FileItem) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  // 获取文件处理结果内容
  const getFileResultContent = (file: FileItem) => {
    // 根据文件类型和节点生成不同的处理结果内容
    const nodeResults: Record<string, Record<string, any>> = {
      'text-parse': {
        'txt': [
          {
            blockId: '06f2a0fc-b23f-4d8e-9c1a-7e8f9d0a1b2c',
            type: '文本',
            content: '这是一段重要的文本内容，包含了关键信息和数据分析结果。'
          },
          {
            blockId: '7d4a3ae8-09b1-4c2f-8e5d-6f7g8h9i0j1k',
            type: '文本',
            content: '另一段文本内容，描述了处理流程和相关参数配置。'
          },
          {
            blockId: '3a1b2c3d-4e5f-6789-abcd-ef0123456789',
            type: '文本',
            content: '最后一段文本，总结了整个处理过程的结果和建议。'
          }
        ],
        'docx': [
          {
            blockId: '11f2a0fc-b23f-4d8e-9c1a-7e8f9d0a1b2c',
            type: '标题',
            content: '文档标题：数据处理报告'
          },
          {
            blockId: '22d4a3ae8-09b1-4c2f-8e5d-6f7g8h9i0j1k',
            type: '段落',
            content: '本文档详细描述了数据处理的各个环节和步骤。'
          },
          {
            blockId: '33a1b2c3d-4e5f-6789-abcd-ef0123456789',
            type: '表格',
            content: '包含3行4列的数据表格，记录了处理结果统计信息。'
          }
        ],
        'pdf': [
          {
            blockId: '44f2a0fc-b23f-4d8e-9c1a-7e8f9d0a1b2c',
            type: '文本',
            content: 'PDF第一页的主要内容，包含项目概述和目标说明。'
          },
          {
            blockId: '55d4a3ae8-09b1-4c2f-8e5d-6f7g8h9i0j1k',
            type: '图片',
            content: '页面中的图表和示意图，展示了数据流向。'
          },
          {
            blockId: '66a1b2c3d-4e5f-6789-abcd-ef0123456789',
            type: '文本',
            content: '结论部分的文字内容，总结了分析结果。'
          }
        ]
      },
      'image-parse': {
        'jpg': [
          {
            blockId: '06f2a0fc-b23f-4d8e-9c1a-7e8f9d0a1b2c',
            type: '图片',
            content: '一只小猫，毛色为浅棕色和黑色相间，眼睛大而圆，呈现出深蓝色。它的耳朵竖立，显得非常警觉。背景是浅色的，可能是白色或米色。'
          },
          {
            blockId: '7d4a3ae8-09b1-4c2f-8e5d-6f7g8h9i0j1k',
            type: '图片',
            content: '评分界面截图，显示4.5/5的评分结果，界面设计简洁美观'
          },
          {
            blockId: '3a1b2c3d-4e5f-6789-abcd-ef0123456789',
            type: '图片',
            content: '网站logo和品牌标识，采用蓝色主色调'
          }
        ],
        'png': [
          {
            blockId: '77f2a0fc-b23f-4d8e-9c1a-7e8f9d0a1b2c',
            type: '图片',
            content: '透明背景的logo图标，包含公司名称和图形标识'
          },
          {
            blockId: '88d4a3ae8-09b1-4c2f-8e5d-6f7g8h9i0j1k',
            type: '图片',
            content: '用户界面截图，显示了主要功能按钮和导航菜单'
          },
          {
            blockId: '99a1b2c3d-4e5f-6789-abcd-ef0123456789',
            type: '图片',
            content: '数据可视化图表，展示了月度增长趋势'
          }
        ]
      },
      'audio-parse': {
        'mp3': [
          {
            blockId: 'aa1b2c3d-4e5f-6789-abcd-ef0123456789',
            type: '音频',
            content: '欢迎使用我们的数据处理平台，本段音频将为您介绍主要功能。'
          },
          {
            blockId: 'bb2c3d4e-5f6g-7890-bcde-f01234567890',
            type: '音频',
            content: '背景音乐片段，节奏轻快，适合作为介绍视频的配乐。'
          },
          {
            blockId: 'cc3d4e5f-6g7h-8901-cdef-012345678901',
            type: '音频',
            content: '感谢您的使用，如有问题请联系客服支持。'
          }
        ],
        'wav': [
          {
            blockId: 'dd4e5f6g-7h8i-9012-def0-123456789012',
            type: '音频',
            content: '高质量录音内容，包含详细的操作说明和注意事项。'
          },
          {
            blockId: 'ee5f6g7h-8i9j-0123-ef01-234567890123',
            type: '音频',
            content: '系统提示音和操作反馈声音，用于用户交互。'
          }
        ]
      },
      'video-parse': {
        'mp4': [
          {
            blockId: 'ff6g7h8i-9j0k-1234-f012-345678901234',
            type: '视频',
            content: '产品演示视频的开头部分，介绍了主要功能特性。'
          },
          {
            blockId: 'gg7h8i9j-0k1l-2345-0123-456789012345',
            type: '视频',
            content: '视频中的字幕文字：欢迎使用数据处理平台'
          },
          {
            blockId: 'hh8i9j0k-1l2m-3456-1234-567890123456',
            type: '视频',
            content: '视频配音内容，专业的解说员声音，语速适中。'
          }
        ]
      },
      'python-custom': {
        'pdf': [
          {
            blockId: '16-merged-001',
            type: '文本',
            content: '文本解析结果：共提取3段文本内容，包含关键信息和数据分析结果'
          },
          {
            blockId: '16-merged-002',
            type: '文本',
            content: '图片解析结果：识别出评分界面和logo标识，质量评分4.5/5'
          },
          {
            blockId: '16-merged-003',
            type: '文本',
            content: '音频解析结果：提取语音内容"欢迎使用数据处理平台"'
          },
          {
            blockId: '16-merged-004',
            type: '文本',
            content: '视频解析结果：检测到产品演示内容，时长约30秒'
          }
        ],
        'docx': [
          {
            blockId: '17-feature-001',
            type: '文本',
            content: '文本特征：[0.85, 0.92, 0.78, 0.65, 0.89] - 情感分析正向'
          },
          {
            blockId: '17-feature-002',
            type: '文本',
            content: '图像特征：[0.91, 0.88, 0.95, 0.72, 0.83] - 高质量图像'
          },
          {
            blockId: '17-feature-003',
            type: '文本',
            content: '音频特征：[0.76, 0.84, 0.69, 0.91, 0.77] - 清晰语音'
          },
          {
            blockId: '17-feature-004',
            type: '文本',
            content: '视频特征：[0.88, 0.79, 0.93, 0.86, 0.81] - 流畅播放'
          }
        ],
        'png': [
          {
            blockId: '18-visual-001',
            type: '图片',
            content: '生成数据流程图：显示从原始数据到处理结果的完整流程'
          },
          {
            blockId: '18-visual-002',
            type: '图片',
            content: '特征分布图：展示各类型数据的特征向量分布情况'
          },
          {
            blockId: '18-visual-003',
            type: '图片',
            content: '质量评估图：显示处理前后的数据质量对比'
          }
        ],
        'jpg': [
          {
            blockId: '19-sample-001',
            type: '图片',
            content: '处理失败：图像质量过低，无法提取有效特征'
          },
          {
            blockId: '19-sample-002',
            type: '图片',
            content: '错误信息：分辨率不足，建议使用高分辨率图像'
          }
        ],
        'mp3': [
          {
            blockId: '20-audio-001',
            type: '音频',
            content: '合成语音："数据处理已完成，共处理1450条记录"'
          },
          {
            blockId: '20-audio-002',
            type: '音频',
            content: '背景音效：处理完成提示音，时长2秒'
          },
          {
            blockId: '20-audio-003',
            type: '音频',
            content: '质量检测：音频清晰度95%，无噪音干扰'
          }
        ],
        'mp4': [
          {
            blockId: '21-video-001',
            type: '视频',
            content: '演示视频：展示数据处理的完整流程，包含解析、合并、清洗步骤'
          },
          {
            blockId: '21-video-002',
            type: '视频',
            content: '结果展示：可视化数据处理前后的对比效果'
          },
          {
            blockId: '21-video-003',
            type: '视频',
            content: '操作指南：用户如何查看和使用处理结果'
          }
        ]
      },
      'clean': {
        'pdf': [
          {
            blockId: '22-clean-001',
            type: '文本',
            content: '去除重复数据：检测到45条重复记录，已自动删除'
          },
          {
            blockId: '22-clean-002',
            type: '文本',
            content: '格式标准化：统一文档格式，修复编码问题'
          },
          {
            blockId: '22-clean-003',
            type: '文本',
            content: '质量评分：数据完整性98%，准确性95%'
          }
        ],
        'docx': [
          {
            blockId: '23-clean-001',
            type: '文本',
            content: '文本清洗：移除无效字符，统一格式规范'
          },
          {
            blockId: '23-clean-002',
            type: '文本',
            content: '特征优化：保留有效特征向量，删除噪声数据'
          },
          {
            blockId: '23-clean-003',
            type: '文本',
            content: '一致性检查：确保数据格式统一，字段完整'
          }
        ],
        'jpg': [
          {
            blockId: '24-clean-001',
            type: '图片',
            content: '图像清洗：调整分辨率，优化图像质量'
          },
          {
            blockId: '24-clean-002',
            type: '图片',
            content: '去噪处理：移除图像噪点，增强清晰度'
          },
          {
            blockId: '24-clean-003',
            type: '图片',
            content: '格式统一：转换为标准格式，压缩文件大小'
          }
        ],
        'mp3': [
          {
            blockId: '25-clean-001',
            type: '音频',
            content: '音频清洗：去除背景噪音，提升音质'
          },
          {
            blockId: '25-clean-002',
            type: '音频',
            content: '格式标准化：统一采样率和比特率'
          },
          {
            blockId: '25-clean-003',
            type: '音频',
            content: '质量检测：音频清晰度95%，无失真'
          }
        ],
        'mp4': [
          {
            blockId: '26-clean-001',
            type: '视频',
            content: '视频清洗：优化视频质量，调整帧率'
          },
          {
            blockId: '26-clean-002',
            type: '视频',
            content: '音视频同步：确保音画同步，无延迟'
          },
          {
            blockId: '26-clean-003',
            type: '视频',
            content: '压缩优化：减少文件大小，保持质量'
          }
        ]
      },
      'enhance': {
        'pdf': [
          {
            blockId: 'DOC-2024-001',
            type: 'ID',
            content: 'DOC-2024-001'
          },
          {
            blockId: 'DOC-2024-001',
            type: '样本',
            content: '{"instruction": "提取文档关键信息", "input": "增强后的文档内容，经过AI处理的高质量文本", "output": "关键信息：语义增强、结构优化、质量提升"}'
          },
          {
            blockId: 'DOC-2024-002',
            type: 'ID',
            content: 'DOC-2024-002'
          },
          {
            blockId: 'DOC-2024-002',
            type: '样本',
            content: '{"instruction": "生成智能摘要", "input": "增强后的文档内容，智能摘要生成", "output": "摘要：关键信息提取和格式标准化完成"}'
          },
          {
            blockId: 'DOC-2024-003',
            type: 'ID',
            content: 'DOC-2024-003'
          },
          {
            blockId: 'DOC-2024-003',
            type: '样本',
            content: '{"instruction": "多语言翻译", "input": "增强后的文档内容，多语言支持", "output": "翻译结果：自动翻译和本地化处理完成"}'
          }
        ],
        'jpg': [
          {
            blockId: 'IMG-2024-001',
            type: 'ID',
            content: 'IMG-2024-001'
          },
          {
            blockId: 'IMG-2024-001',
            type: '样本',
            content: '{"instruction": "图像质量增强", "input": "原始图片分辨率1080p", "output": "增强后图片：分辨率提升至4K，色彩饱和度优化，噪点去除"}'
          },
          {
            blockId: 'IMG-2024-002',
            type: 'ID',
            content: 'IMG-2024-002'
          },
          {
            blockId: 'IMG-2024-002',
            type: '样本',
            content: '{"instruction": "智能锐化处理", "input": "模糊图片需要清晰化", "output": "增强后图片：智能锐化处理，对比度调整，细节增强"}'
          },
          {
            blockId: 'IMG-2024-003',
            type: 'ID',
            content: 'IMG-2024-003'
          },
          {
            blockId: 'IMG-2024-003',
            type: '样本',
            content: '{"instruction": "超分辨率重建", "input": "低分辨率图片", "output": "增强后图片：AI超分辨率重建，画质提升200%"}'
          }
        ],
        'mp4': [
          {
            blockId: 'VID-2024-001',
            type: 'ID',
            content: 'VID-2024-001'
          },
          {
            blockId: 'VID-2024-001',
            type: '样本',
            content: '{"instruction": "视频质量提升", "input": "原始视频30fps 720p", "output": "增强后视频：帧率提升至60fps，画质增强至1080p，音画同步优化"}'
          },
          {
            blockId: 'VID-2024-002',
            type: 'ID',
            content: 'VID-2024-002'
          },
          {
            blockId: 'VID-2024-002',
            type: '样本',
            content: '{"instruction": "视频去噪处理", "input": "有噪点的视频文件", "output": "增强后视频：智能去噪处理，色彩校正，稳定性增强"}'
          },
          {
            blockId: 'VID-2024-003',
            type: 'ID',
            content: 'VID-2024-003'
          },
          {
            blockId: 'VID-2024-003',
            type: '样本',
            content: '{"instruction": "视频流畅度优化", "input": "卡顿的视频播放", "output": "增强后视频：AI插帧技术，流畅度提升，压缩优化"}'
          }
        ],
        'mp3': [
          {
            blockId: 'AUD-2024-001',
            type: 'ID',
            content: 'AUD-2024-001'
          },
          {
            blockId: 'AUD-2024-001',
            type: '样本',
            content: '{"instruction": "音频质量提升", "input": "有损音频文件", "output": "增强后音频：音质提升至无损级别，背景噪音消除，音量标准化"}'
          },
          {
            blockId: 'AUD-2024-002',
            type: 'ID',
            content: 'AUD-2024-002'
          },
          {
            blockId: 'AUD-2024-002',
            type: '样本',
            content: '{"instruction": "语音清晰度增强", "input": "模糊不清的语音录音", "output": "增强后音频：语音清晰度增强，频率响应优化，立体声效果改善"}'
          },
          {
            blockId: 'AUD-2024-003',
            type: 'ID',
            content: 'AUD-2024-003'
          },
          {
            blockId: 'AUD-2024-003',
            type: '样本',
            content: '{"instruction": "音频降噪处理", "input": "有背景噪音的录音", "output": "增强后音频：AI降噪技术，动态范围扩展，音色还原"}'
          }
        ]
      },
      'start': {
        'doc': `文档内容预览:
标题: 产品介绍文档
内容: 本文档详细介绍了我们的核心产品功能和特性...
页数: 5页
字数: 约2000字
创建时间: 2024-08-19
最后修改: 2024-08-19`,
        'ppt': `演示文稿预览:
标题: 营销方案演示
幻灯片数量: 15张
主要内容:
- 市场分析
- 产品定位  
- 营销策略
- 预算规划
- 时间安排
文件大小: 8.5MB`,
        'jpg': `图片文件预览:
文件名: 用户头像.jpg
分辨率: 512x512像素
文件大小: 85KB
色彩模式: RGB
拍摄时间: 2024-08-19
图片描述: 用户个人头像照片，背景简洁`,
        'png': `图片文件预览:
文件名: 界面截图.png
分辨率: 1920x1080像素
文件大小: 2.3MB
色彩模式: RGBA (支持透明)
创建时间: 2024-08-19
图片描述: 应用程序主界面截图`,
        'mp3': `音频文件预览:
文件名: 背景音乐.mp3
时长: 3分45秒
比特率: 320kbps
采样率: 44.1kHz
文件大小: 8.6MB
音频描述: 轻松愉快的背景音乐，适合产品展示`,
        'mp4': `视频文件预览:
文件名: 宣传视频.mp4
时长: 2分30秒
分辨率: 1920x1080
帧率: 30fps
文件大小: 45MB
视频描述: 产品功能演示和宣传视频`,
        'yaml': `配置文件预览:
workflow:
  name: "数据处理流程"
  version: "1.0"
  trigger: "manual"
  
input:
  source: "source_vol1"
  max_files: 100
  
processing:
  parallel: true
  timeout: 3600`,
        'txt': `文本文件预览:
输入文件清单:
1. 产品介绍.doc
2. 营销方案.ppt  
3. 用户头像.jpg
4. 界面截图.png
5. 背景音乐.mp3
6. 宣传视频.mp4
7. 启动配置-1.yaml

总计: 8个文件
预计处理时间: 15分钟`
      },
      'end': [
        {
          id: '33',
          name: '最终结果-1.json',
          type: 'json',
          startTime: '2024-08-19 14:54:10',
          endTime: '2024-08-19 14:54:15',
          status: '处理完成'
        },
        {
          id: '34',
          name: '执行摘要-1.pdf',
          type: 'pdf',
          startTime: '2024-08-19 14:54:11',
          endTime: '2024-08-19 14:54:20',
          status: '处理完成'
        },
        {
          id: '35',
          name: '完成通知-1.txt',
          type: 'txt',
          startTime: '2024-08-19 14:54:12',
          endTime: '2024-08-19 14:54:13',
          status: '处理完成'
        }
      ]
    };

    // 对于非解析节点，返回原来的JSON格式
    if (!['text-parse', 'image-parse', 'audio-parse', 'video-parse', 'python-custom', 'clean', 'enhance'].includes(node.id)) {
      const otherResults: Record<string, Record<string, any>> = {
        'start': {
          'doc': `文档内容预览:
标题: 产品介绍文档
内容: 本文档详细介绍了我们的核心产品功能和特性...
页数: 5页
字数: 约2000字
创建时间: 2024-08-19
最后修改: 2024-08-19`,
          'ppt': `演示文稿预览:
标题: 营销方案演示
幻灯片数量: 15张
主要内容:
- 市场分析
- 产品定位  
- 营销策略
- 预算规划
- 时间安排
文件大小: 8.5MB`,
          'jpg': `图片文件预览:
文件名: 用户头像.jpg
分辨率: 512x512像素
文件大小: 85KB
色彩模式: RGB
拍摄时间: 2024-08-19
图片描述: 用户个人头像照片，背景简洁`,
          'png': `图片文件预览:
文件名: 界面截图.png
分辨率: 1920x1080像素
文件大小: 2.3MB
色彩模式: RGBA (支持透明)
创建时间: 2024-08-19
图片描述: 应用程序主界面截图`,
          'mp3': `音频文件预览:
文件名: 背景音乐.mp3
时长: 3分45秒
比特率: 320kbps
采样率: 44.1kHz
文件大小: 8.6MB
音频描述: 轻松愉快的背景音乐，适合产品展示`,
          'mp4': `视频文件预览:
文件名: 宣传视频.mp4
时长: 2分30秒
分辨率: 1920x1080
帧率: 30fps
文件大小: 45MB
视频描述: 产品功能演示和宣传视频`,
          'yaml': `配置文件预览:
workflow:
  name: "数据处理流程"
  version: "1.0"
  trigger: "manual"
  
input:
  source: "source_vol1"
  max_files: 100
  
processing:
  parallel: true
  timeout: 3600`,
          'txt': `文本文件预览:
输入文件清单:
1. 产品介绍.doc
2. 营销方案.ppt  
3. 用户头像.jpg
4. 界面截图.png
5. 背景音乐.mp3
6. 宣传视频.mp4
7. 启动配置-1.yaml

总计: 8个文件
预计处理时间: 15分钟`
        },
        'python-custom': {
          'json': `{
  "processed_data": {
    "total_records": 1500,
    "processed_records": 1450,
    "failed_records": 50
  },
  "feature_extraction": {
    "text_features": 128,
    "image_features": 256,
    "audio_features": 64
  },
  "merged_dataset": "combined_features.json"
}`,
          'csv': `processed_id,feature_1,feature_2,feature_3,label
1,0.85,0.92,0.78,positive
2,0.23,0.45,0.67,negative
3,0.91,0.88,0.95,positive
...
(显示前3行，共1450行数据)`
        },
        'clean': {
          'json': `{
  "cleaning_results": {
    "original_records": 1450,
    "duplicates_removed": 45,
    "invalid_records": 12,
    "final_records": 1393
  },
  "data_quality": {
    "completeness": 0.98,
    "accuracy": 0.95,
    "consistency": 0.97
  }
}`,
          'html': `<!DOCTYPE html>
<html>
<head><title>数据质量报告</title></head>
<body>
  <h1>数据清洗质量报告</h1>
  <p>处理时间: 2024-08-19 14:53:20</p>
  <p>原始数据: 1450条</p>
  <p>清洗后数据: 1393条</p>
  <p>数据质量评分: 96.7%</p>
</body>
</html>`
        },
        'enhance': {
          'json': `{
  "enhancement_results": {
    "input_records": 1393,
    "enhanced_records": 1393,
    "quality_improvement": "2x",
    "new_features_added": 15
  },
  "ai_enhancement": {
    "model_used": "GPT-4",
    "confidence_threshold": 0.85,
    "enhancement_types": ["text_enrichment", "feature_augmentation"]
  }
}`,
          'pdf': `增强处理报告
=============

处理时间: 2024-08-19 14:53:40 - 14:53:55
输入数据: 1393条记录
输出数据: 1393条增强记录

增强内容:
- 文本语义增强
- 特征向量扩展  
- 质量评分提升
- 索引优化

质量提升: 200%
处理效率: 95.2%`
        }
      };

      const nodeResult = otherResults[node.id];
      if (nodeResult && nodeResult[file.type]) {
        return nodeResult[file.type];
      }

      return `{
  "file_name": "${file.name}",
  "file_type": "${file.type}",
  "processing_node": "${node.label}",
  "status": "${file.status}",
  "processed_at": "${file.endTime}",
  "result": "处理完成，生成结果文件"
}`;
    }

    const nodeResult = nodeResults[node.id];
    return nodeResult && nodeResult[file.type] ? nodeResult[file.type] : [];
  };

  const config = getNodeConfig(node.id);
  const files = getNodeFiles(node.id);

  // 获取文件血缘关系映射
  const getFileLineage = (currentNodeId: string, fileName: string) => {
    // 定义文件血缘关系映射
    const lineageMap: Record<string, Record<string, { nodeId: string; fileName: string }>> = {
      // Python预处理节点的文件来源于开始节点
      'python-preprocess': {
        '预处理-产品介绍.doc': { nodeId: 'start', fileName: '产品介绍.doc' },
        '预处理-营销方案.ppt': { nodeId: 'start', fileName: '营销方案.ppt' },
        '预处理-用户头像.jpg': { nodeId: 'start', fileName: '用户头像.jpg' },
        '预处理-界面截图.png': { nodeId: 'start', fileName: '界面截图.png' },
        '预处理-背景音乐.mp3': { nodeId: 'start', fileName: '背景音乐.mp3' },
        '预处理-宣传视频.mp4': { nodeId: 'start', fileName: '宣传视频.mp4' },
        '预处理-说明文档.txt': { nodeId: 'start', fileName: '说明文档.txt' }
      },
      // 文本解析节点的文件来源于预处理节点的文本类文件
      'text-parse': {
        '文本解析-产品介绍.json': { nodeId: 'python-preprocess', fileName: '预处理-产品介绍.doc' },
        '文本解析-营销方案.json': { nodeId: 'python-preprocess', fileName: '预处理-营销方案.ppt' },
        '文本解析-说明文档.json': { nodeId: 'python-preprocess', fileName: '预处理-说明文档.txt' }
      },
      // 图片解析节点的文件来源于预处理节点的图片文件（只有jpg成功了）
      'image-parse': {
        '图片解析-用户头像.json': { nodeId: 'python-preprocess', fileName: '预处理-用户头像.jpg' }
      },
      // 音频解析节点的文件来源于预处理节点的音频文件
      'audio-parse': {
        '音频解析-背景音乐.json': { nodeId: 'python-preprocess', fileName: '预处理-背景音乐.mp3' }
      },
      // 视频解析节点的文件来源于预处理节点的视频文件
      'video-parse': {
        '视频解析-宣传视频.json': { nodeId: 'python-preprocess', fileName: '预处理-宣传视频.mp4' }
      },
      // Python自定义节点的文件来源于各个解析节点
      'python-custom': {
        '合并数据-产品介绍.pdf': { nodeId: 'text-parse', fileName: '文本解析-产品介绍.json' },
        '合并数据-营销方案.pdf': { nodeId: 'text-parse', fileName: '文本解析-营销方案.json' },
        '合并数据-用户头像.pdf': { nodeId: 'image-parse', fileName: '图片解析-用户头像.json' },
        '合并数据-背景音乐.pdf': { nodeId: 'audio-parse', fileName: '音频解析-背景音乐.json' },
        '合并数据-宣传视频.pdf': { nodeId: 'video-parse', fileName: '视频解析-宣传视频.json' }
      },
      // 数据清洗节点的文件来源于Python自定义节点（只有成功处理的）
      'clean': {
        '清洗数据-产品介绍.pdf': { nodeId: 'python-custom', fileName: '合并数据-产品介绍.pdf' },
        '清洗数据-营销方案.pdf': { nodeId: 'python-custom', fileName: '合并数据-营销方案.pdf' },
        '清洗数据-用户头像.pdf': { nodeId: 'python-custom', fileName: '合并数据-用户头像.pdf' },
        '清洗数据-背景音乐.pdf': { nodeId: 'python-custom', fileName: '合并数据-背景音乐.pdf' }
      },
      // 数据增强节点的文件来源于数据清洗节点
      'enhance': {
        '增强数据-产品介绍.pdf': { nodeId: 'clean', fileName: '清洗数据-产品介绍.pdf' },
        '增强数据-营销方案.pdf': { nodeId: 'clean', fileName: '清洗数据-营销方案.pdf' },
        '增强数据-用户头像.pdf': { nodeId: 'clean', fileName: '清洗数据-用户头像.pdf' },
        '增强数据-背景音乐.pdf': { nodeId: 'clean', fileName: '清洗数据-背景音乐.pdf' }
      },
      // 结束节点的文件来源于数据增强节点
      'end': {
        '最终结果-产品介绍.json': { nodeId: 'enhance', fileName: '增强数据-产品介绍.pdf' },
        '最终结果-营销方案.json': { nodeId: 'enhance', fileName: '增强数据-营销方案.pdf' },
        '最终结果-用户头像.json': { nodeId: 'enhance', fileName: '增强数据-用户头像.pdf' },
        '最终结果-背景音乐.json': { nodeId: 'enhance', fileName: '增强数据-背景音乐.pdf' },
        '处理报告.pdf': { nodeId: 'enhance', fileName: '增强数据-产品介绍.pdf' }
      }
    };

    const nodeLineage = lineageMap[currentNodeId];
    return nodeLineage ? nodeLineage[fileName] : null;
  };

  // 获取下游血缘关系映射
  const getDownstreamLineage = (currentNodeId: string, fileName: string) => {
    // 定义下游血缘关系映射（被哪些文件使用）
    const downstreamMap: Record<string, Record<string, { nodeId: string; fileName: string }[]>> = {
      // 开始节点的文件被预处理节点使用
      'start': {
        '产品介绍.doc': [{ nodeId: 'python-preprocess', fileName: '预处理-产品介绍.doc' }],
        '营销方案.ppt': [{ nodeId: 'python-preprocess', fileName: '预处理-营销方案.ppt' }],
        '用户头像.jpg': [{ nodeId: 'python-preprocess', fileName: '预处理-用户头像.jpg' }],
        '界面截图.png': [{ nodeId: 'python-preprocess', fileName: '预处理-界面截图.png' }],
        '背景音乐.mp3': [{ nodeId: 'python-preprocess', fileName: '预处理-背景音乐.mp3' }],
        '宣传视频.mp4': [{ nodeId: 'python-preprocess', fileName: '预处理-宣传视频.mp4' }],
        '说明文档.txt': [{ nodeId: 'python-preprocess', fileName: '预处理-说明文档.txt' }]
      },
      // 预处理节点的文件被各个解析节点使用
      'python-preprocess': {
        '预处理-产品介绍.doc': [{ nodeId: 'text-parse', fileName: '文本解析-产品介绍.json' }],
        '预处理-营销方案.ppt': [{ nodeId: 'text-parse', fileName: '文本解析-营销方案.json' }],
        '预处理-用户头像.jpg': [{ nodeId: 'image-parse', fileName: '图片解析-用户头像.json' }],
        '预处理-说明文档.txt': [{ nodeId: 'text-parse', fileName: '文本解析-说明文档.json' }],
        '预处理-背景音乐.mp3': [{ nodeId: 'audio-parse', fileName: '音频解析-背景音乐.json' }],
        '预处理-宣传视频.mp4': [{ nodeId: 'video-parse', fileName: '视频解析-宣传视频.json' }]
      },
      // 各个解析节点的文件被Python自定义节点使用
      'text-parse': {
        '文本解析-产品介绍.json': [{ nodeId: 'python-custom', fileName: '合并数据-产品介绍.pdf' }],
        '文本解析-营销方案.json': [{ nodeId: 'python-custom', fileName: '合并数据-营销方案.pdf' }]
      },
      'image-parse': {
        '图片解析-用户头像.json': [{ nodeId: 'python-custom', fileName: '合并数据-用户头像.pdf' }]
      },
      'audio-parse': {
        '音频解析-背景音乐.json': [{ nodeId: 'python-custom', fileName: '合并数据-背景音乐.pdf' }]
      },
      'video-parse': {
        '视频解析-宣传视频.json': [{ nodeId: 'python-custom', fileName: '合并数据-宣传视频.pdf' }]
      },
      // Python自定义节点的文件被数据清洗节点使用
      'python-custom': {
        '合并数据-产品介绍.pdf': [{ nodeId: 'clean', fileName: '清洗数据-产品介绍.pdf' }],
        '合并数据-营销方案.pdf': [{ nodeId: 'clean', fileName: '清洗数据-营销方案.pdf' }],
        '合并数据-用户头像.pdf': [{ nodeId: 'clean', fileName: '清洗数据-用户头像.pdf' }],
        '合并数据-背景音乐.pdf': [{ nodeId: 'clean', fileName: '清洗数据-背景音乐.pdf' }]
      },
      // 数据清洗节点的文件被数据增强节点使用
      'clean': {
        '清洗数据-产品介绍.pdf': [{ nodeId: 'enhance', fileName: '增强数据-产品介绍.pdf' }],
        '清洗数据-营销方案.pdf': [{ nodeId: 'enhance', fileName: '增强数据-营销方案.pdf' }],
        '清洗数据-用户头像.pdf': [{ nodeId: 'enhance', fileName: '增强数据-用户头像.pdf' }],
        '清洗数据-背景音乐.pdf': [{ nodeId: 'enhance', fileName: '增强数据-背景音乐.pdf' }]
      },
      // 数据增强节点的文件被结束节点使用
      'enhance': {
        '增强数据-产品介绍.pdf': [
          { nodeId: 'end', fileName: '最终结果-产品介绍.json' },
          { nodeId: 'end', fileName: '处理报告.pdf' }
        ],
        '增强数据-营销方案.pdf': [{ nodeId: 'end', fileName: '最终结果-营销方案.json' }],
        '增强数据-用户头像.pdf': [{ nodeId: 'end', fileName: '最终结果-用户头像.json' }],
        '增强数据-背景音乐.pdf': [{ nodeId: 'end', fileName: '最终结果-背景音乐.json' }]
      }
    };

    const nodeDownstream = downstreamMap[currentNodeId];
    return nodeDownstream ? nodeDownstream[fileName] : null;
  };

  // 处理血缘跳转
  const handleLineageClick = (file: FileItem) => {
    const lineage = getFileLineage(node.id, file.name);
    if (lineage) {
      // 找到目标节点
      const targetNode = nodes.find(n => n.id === lineage.nodeId);
      if (targetNode) {
        // 设置高亮文件ID（基于文件名匹配）
        const targetFiles = getNodeFiles(lineage.nodeId);
        const targetFile = targetFiles.find(f => f.name === lineage.fileName);
        if (targetFile) {
          setHighlightedFileId(targetFile.id);
        }
        
        // 跳转到目标节点
        onNodeChange(targetNode);
      }
    }
  };

  // 处理下游血缘跳转
  const handleDownstreamLineageClick = (file: FileItem) => {
    const downstreams = getDownstreamLineage(node.id, file.name);
    if (downstreams && downstreams.length > 0) {
      // 如果有多个下游，跳转到第一个
      const firstDownstream = downstreams[0];
      const targetNode = nodes.find(n => n.id === firstDownstream.nodeId);
      if (targetNode) {
        // 设置高亮文件ID（基于文件名匹配）
        const targetFiles = getNodeFiles(firstDownstream.nodeId);
        const targetFile = targetFiles.find(f => f.name === firstDownstream.fileName);
        if (targetFile) {
          setHighlightedFileId(targetFile.id);
        }
        
        // 跳转到目标节点
        onNodeChange(targetNode);
      }
    }
  };

  const getFileIcon = (fileType: string) => {
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{config.name || node.label}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 标签页导航 */}
        <div className="flex border-b border-gray-200">
          {node.id !== 'start' && node.id !== 'end' && (
            <button
              onClick={() => setActiveTab('files')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>处理结果 ({files.length})</span>
              </div>
            </button>
          )}
          {node.id === 'start' && (
            <button
              onClick={() => setActiveTab('files')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>原始文件列表 ({files.length})</span>
              </div>
            </button>
          )}
          {node.id === 'end' && (
            <button
              onClick={() => setActiveTab('files')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>最终输出文件 ({files.length})</span>
              </div>
            </button>
          )}
          {node.id !== 'start' && node.id !== 'end' && (
            <button
              onClick={() => setActiveTab('config')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'config'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>节点配置</span>
              </div>
            </button>
          )}
        </div>

        {/* 标签页内容 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">基本信息</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">节点类型:</span>
                    <span className="text-sm text-gray-900">{config.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">描述:</span>
                    <span className="text-sm text-gray-900">{config.description}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">参数配置</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {Object.entries(config.parameters || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600">{key}:</span>
                      <span className="text-sm text-gray-900">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && !previewFile && (
            <div key={node.id}>
              {files.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          文件名
                        </th>
                        {node.id !== 'start' && node.id !== 'end' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            状态
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          文件类型
                        </th>
                        {node.id !== 'start' && node.id !== 'end' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            开始时间
                          </th>
                        )}
                        {node.id !== 'start' && node.id !== 'end' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            结束时间
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {files.map((file) => (
                        <tr 
                          key={file.id} 
                          className={`hover:bg-gray-50 ${
                            highlightedFileId === file.id ? 'bg-yellow-100 border-l-4 border-yellow-400' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file.type)}
                              <span className={`text-sm ${
                                highlightedFileId === file.id ? 'text-yellow-900 font-medium' : 'text-gray-900'
                              }`}>
                                {file.name}
                              </span>
                            </div>
                          </td>
                          {node.id !== 'start' && node.id !== 'end' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(file.status)}`}>
                                {file.status}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {file.type}
                          </td>
                          {node.id !== 'start' && node.id !== 'end' && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {file.startTime}
                            </td>
                          )}
                          {node.id !== 'start' && node.id !== 'end' && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {file.endTime}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button 
                                className={`${
                                  file.status === '处理完成' 
                                    ? 'text-green-600 hover:text-green-800 cursor-pointer' 
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                                title={file.status === '处理完成' ? '查看' : '文件未处理完成，无法预览'}
                                onClick={() => {
                                  if (file.status === '处理完成') {
                                    handlePreviewFile(file);
                                  }
                                }}
                                disabled={file.status !== '处理完成'}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {/* 开始节点不显示上游血缘按钮 */}
                              {node.id !== 'start' && getFileLineage(node.id, file.name) && (
                                <button 
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                  title="查看上游血缘"
                                  onClick={() => handleLineageClick(file)}
                                >
                                  <GitBranch className="w-4 h-4" />
                                </button>
                              )}
                              {/* 结束节点不显示下游血缘按钮 */}
                              {node.id !== 'end' && getDownstreamLineage(node.id, file.name) && (
                                <button 
                                  className="text-purple-600 hover:text-purple-800 cursor-pointer"
                                  title="查看下游血缘"
                                  onClick={() => handleDownstreamLineageClick(file)}
                                >
                                  <GitMerge className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">该节点暂无处理文件</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && previewFile && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">文件预览: {previewFile.name}</h4>
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={closePreview}
                >
                  返回列表
                </button>
              </div>
              
              {['text-parse', 'image-parse', 'audio-parse', 'video-parse', 'python-custom', 'clean', 'enhance'].includes(node.id) ? (
                <div className="bg-white rounded border">
                  <div className="p-4 border-b">
                    <h5 className="text-sm font-medium text-gray-900">
                      {node.id === 'enhance' ? '数据增强样本' : '识别结果'}
                    </h5>
                    {node.id === 'enhance' && (
                      <p className="text-xs text-gray-500 mt-1">
                        共{Math.ceil((getFileResultContent(previewFile) as any[]).length / 2)}条样本
                      </p>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {node.id !== 'enhance' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              块ID
                            </th>
                          )}
                          {node.id !== 'enhance' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              类型
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {node.id === 'enhance' ? '样本' : '内容'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {node.id === 'enhance' ? (
                          // 对于数据增强节点，只显示样本内容，过滤掉ID行
                          (getFileResultContent(previewFile) as any[])
                            .filter(block => block.type === '样本')
                            .map((block, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  <div className="max-w-2xl">
                                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                      {block.content}
                                    </pre>
                                  </div>
                                </td>
                              </tr>
                            ))
                        ) : (
                          // 其他节点保持原有格式
                          (getFileResultContent(previewFile) as any[]).map((block, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                {block.blockId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {block.type}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="max-w-md">
                                  {block.content}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded border p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">处理结果内容:</h5>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
                    {getFileResultContent(previewFile)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WorkflowDiagram: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedFileId, setHighlightedFileId] = useState<string | null>(null);

  const nodes = [
    { id: 'start', label: '开始节点', x: 50, y: 200, color: 'bg-green-100 border-green-300 text-green-800' },
    { id: 'python-preprocess', label: 'Python1', x: 200, y: 200, color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { id: 'text-parse', label: '文本解析节点', x: 350, y: 120, color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { id: 'image-parse', label: '图片解析节点', x: 350, y: 160, color: 'bg-purple-100 border-purple-300 text-purple-800' },
    { id: 'audio-parse', label: '音频解析节点', x: 350, y: 200, color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { id: 'video-parse', label: '视频解析节点', x: 350, y: 240, color: 'bg-pink-100 border-pink-300 text-pink-800' },
    { id: 'python-custom', label: 'Python2', x: 500, y: 200, color: 'bg-amber-100 border-amber-300 text-amber-800' },
    { id: 'clean', label: '数据清洗', x: 650, y: 200, color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
    { id: 'enhance', label: '数据增强', x: 800, y: 200, color: 'bg-teal-100 border-teal-300 text-teal-800' },
    { id: 'end', label: '结束节点', x: 950, y: 200, color: 'bg-green-100 border-green-300 text-green-800' }
  ];

  const connections = [
    { from: 'start', to: 'python-preprocess' },
    { from: 'python-preprocess', to: 'text-parse' },
    { from: 'python-preprocess', to: 'image-parse' },
    { from: 'python-preprocess', to: 'audio-parse' },
    { from: 'python-preprocess', to: 'video-parse' },
    { from: 'text-parse', to: 'python-custom' },
    { from: 'image-parse', to: 'python-custom' },
    { from: 'audio-parse', to: 'python-custom' },
    { from: 'video-parse', to: 'python-custom' },
    { from: 'python-custom', to: 'clean' },
    { from: 'clean', to: 'enhance' },
    { from: 'enhance', to: 'end' }
  ];

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

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

  // 清除高亮状态的定时器
  useEffect(() => {
    if (highlightedFileId) {
      const timer = setTimeout(() => {
        setHighlightedFileId(null);
      }, 3000); // 3秒后清除高亮
      return () => clearTimeout(timer);
    }
  }, [highlightedFileId]);

  return (
    <>
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
            <svg width="1100" height="350" className="bg-gray-50">
              {/* 渲染连接线 */}
              {connections.map((connection, index) => renderConnection(connection, index))}
              
              {/* 渲染节点 */}
              {nodes.map((node) => (
                <g key={node.id}>
                  <foreignObject x={node.x} y={node.y} width="120" height="30">
                    <div 
                      className={`px-3 py-1 rounded border text-xs font-medium text-center cursor-pointer hover:shadow-md transition-shadow ${node.color}`}
                      onClick={() => handleNodeClick(node)}
                    >
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
              <span>Python预处理</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div>
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

      {/* 节点配置弹窗 */}
      <NodeModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodes={nodes}
        onNodeChange={handleNodeClick}
        highlightedFileId={highlightedFileId}
        setHighlightedFileId={setHighlightedFileId}
      />
    </>
  );
};

export default WorkflowDiagram;