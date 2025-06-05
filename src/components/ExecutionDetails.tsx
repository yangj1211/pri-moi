import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Clock, Play, AlertCircle, FileText } from 'lucide-react';

// 定义节点处理数据的类型
interface NodeProcessingData {
  status: string;
  startTime: string;
  endTime: string;
  duration: string;
  result: string;
  details: string;
  outputSize: string;
  // 添加处理结果相关字段
  hasOutput: boolean;
  outputPreview?: string;
  outputType: string;
  outputUrl?: string;
}

interface FileProcessingData {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  overallStatus: string;
  currentNode: string;
  originalContent?: string; // 原始文件内容预览
  nodeProcessing: { [key: string]: NodeProcessingData };
}

const ExecutionDetails: React.FC = () => {
  const [expandedFiles, setExpandedFiles] = useState<string[]>([]);

  // 根据文件类型获取对应的解析节点名称
  const getParseNodeName = (fileType: string): string => {
    switch (fileType.toLowerCase()) {
      case 'txt':
      case 'docx':
      case 'doc':
      case 'pdf':
        return '文本解析节点';
      case 'jpg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return '图片解析节点';
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
        return '音频解析节点';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return '视频解析节点';
      default:
        return '文本解析节点';
    }
  };

  // 计算文件处理进度
  const getFileProgress = (file: FileProcessingData) => {
    const nodeNames = Object.keys(file.nodeProcessing);
    const totalNodes = nodeNames.length;
    
    // 计算已完成的节点数量
    let completedNodes = 0;
    
    nodeNames.forEach((nodeName) => {
      const nodeData = file.nodeProcessing[nodeName];
      if (nodeData.status === 'completed') {
        completedNodes++;
      }
    });
    
    return {
      current: completedNodes,
      total: totalNodes,
      progressText: `(${completedNodes}/${totalNodes})`
    };
  };

  // 文件处理数据 - 扩展原有表格数据，添加处理结果
  const tableData: FileProcessingData[] = [
    {
      fileId: 'file-1',
      fileName: '通过评分网-1.jpg',
      fileType: 'jpg',
      fileSize: '2.5MB',
      overallStatus: '处理完成',
      currentNode: '数据增强',
      originalContent: '原始图片: 1920x1080像素，包含评分网页面截图',
      nodeProcessing: {
        'Python自定义': { 
          status: 'completed', 
          result: 'Python自定义脚本执行成功', 
          duration: '18s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:42',
          details: '自定义处理完成',
          outputSize: '2.8KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "custom_analysis": {
              "image_quality_score": 0.92,
              "text_extraction_confidence": 0.95,
              "object_detection_results": ["评分界面", "按钮", "文本"],
              "color_analysis": {
                "dominant_colors": ["#4F46E5", "#10B981", "#F59E0B"],
                "color_harmony": 0.88
              }
            },
            "python_script_output": "成功提取了评分网页面的关键视觉元素",
            "processing_metadata": {
              "script_version": "v1.2.3",
              "execution_time": "18.2s",
              "memory_usage": "95MB"
            }
          }, null, 2)
        },
        '图片解析节点': { 
          status: 'completed', 
          result: '解析成功，提取图片元数据', 
          duration: '14s',
          startTime: '2024-08-19 14:52:42',
          endTime: '2024-08-19 14:52:56',
          details: '解析完成',
          outputSize: '2KB',
          hasOutput: true,
          outputType: 'metadata',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 25%;">块 ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 15%;">类型</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 60%;">识别内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">06f2a0fc-b23f-4d8e-9c1a-7e8f9d0a1b2c</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">图片</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">一只小猫，毛色为浅棕色和黑色相间，眼睛大而圆，呈现出深蓝色。它的耳朵竖立，显得非常警觉。背景是浅色的，可能是白色或米色。</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">7d4a3ae8-09b1-4c2f-8e5d-6f7g8h9i0j1k</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">图片</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">评分界面截图，显示4.5/5的评分结果，界面设计简洁美观</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">3a1b2c3d-4e5f-6789-abcd-ef0123456789</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">图片</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">网站logo和品牌标识，采用蓝色主色调</td>
    </tr>
  </tbody>
</table>`
        },
        'Python2': { 
          status: 'completed', 
          result: 'Python脚本执行成功', 
          duration: '25s',
          startTime: '2024-08-19 14:52:56',
          endTime: '2024-08-19 14:53:21',
          details: '自定义处理完成',
          outputSize: '3.2KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "custom_analysis": {
              "image_quality_score": 0.92,
              "text_extraction_confidence": 0.95,
              "object_detection_results": ["评分界面", "按钮", "文本"],
              "color_analysis": {
                "dominant_colors": ["#4F46E5", "#10B981", "#F59E0B"],
                "color_harmony": 0.88
              }
            },
            "python_script_output": "成功提取了评分网页面的关键视觉元素",
            "processing_metadata": {
              "script_version": "v1.2.3",
              "execution_time": "25.4s",
              "memory_usage": "128MB"
            }
          }, null, 2)
        },
        '数据清洗': { 
          status: 'completed', 
          result: '数据清洗完成', 
          duration: '30s',
          startTime: '2024-08-19 14:53:21',
          endTime: '2024-08-19 14:53:51',
          details: '清洗完成',
          outputSize: '1.8KB',
          hasOutput: true,
          outputType: 'structured_data',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 25%;">块 ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 15%;">类型</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 60%;">识别内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">06f2a0fc-b23f-4d8e-9c1a-7e8f9d0a1b2c</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">图片</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">小猫图片，毛色浅棕黑相间，蓝色眼睛，竖立耳朵，浅色背景</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">7d4a3ae8-09b1-4c2f-8e5d-6f7g8h9i0j1k</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">图片</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">评分界面，4.5/5评分，简洁美观设计</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">3a1b2c3d-4e5f-6789-abcd-ef0123456789</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">图片</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">网站logo，蓝色主色调品牌标识</td>
    </tr>
  </tbody>
</table>`
        },
        '数据增强': { 
          status: 'completed', 
          result: '数据增强完成', 
          duration: '15s',
          startTime: '2024-08-19 14:53:51',
          endTime: '2024-08-19 14:54:06',
          details: '增强完成',
          outputSize: '3.2KB',
          hasOutput: true,
          outputType: 'enhanced_data',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 10%;">ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 90%;">QA对</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">1</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"翻译成法语","input":"Hello","output":"Bonjour"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">2</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"翻译成西班牙语","input":"Good morning","output":"Buenos días"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">3</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"计算结果","input":"2 + 2","output":"4"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">4</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"解释概念","input":"什么是人工智能？","output":"人工智能是计算机科学的一个领域，致力于开发能够执行通常需要人类智能的任务的系统。"}</td>
    </tr>
  </tbody>
</table>`
        }
      }
    },
    {
      fileId: 'file-2',
      fileName: '通过评分网-2.docx',
      fileType: 'docx',
      fileSize: '1.2MB',
      overallStatus: '处理中',
      currentNode: '数据清洗',
      originalContent: '原始文档内容: 包含评分网站分析报告，共5页内容',
      nodeProcessing: {
        'Python自定义': { 
          status: 'completed', 
          result: 'Python自定义脚本执行成功', 
          duration: '22s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:46',
          details: '自定义处理完成',
          outputSize: '3.5KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "custom_analysis": {
              "document_structure_score": 0.95,
              "text_quality_score": 0.88,
              "content_categories": ["报告", "数据分析", "用户反馈"],
              "language_analysis": {
                "primary_language": "中文",
                "readability_score": 0.82,
                "technical_terms_count": 45
              }
            },
            "python_script_output": "成功分析了文档结构和内容质量",
            "processing_metadata": {
              "script_version": "v1.2.3",
              "execution_time": "22.1s",
              "memory_usage": "112MB"
            }
          }, null, 2)
        },
        '文本解析节点': { 
          status: 'completed', 
          result: '解析成功，提取文本内容', 
          duration: '29s',
          startTime: '2024-08-19 14:52:46',
          endTime: '2024-08-19 14:53:15',
          details: '解析完成',
          outputSize: '15KB',
          hasOutput: true,
          outputType: 'text',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 25%;">块 ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 15%;">类型</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 60%;">识别内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">1a2b3c4d-5e6f-7890-abcd-ef1234567890</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">文本</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">评分网站分析报告</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">2b3c4d5e-6f78-9012-bcde-f23456789012</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">文本</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">本报告分析了当前评分网站的使用情况，包括用户行为、满意度调查和系统性能评估。</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">3c4d5e6f-7890-1234-cdef-345678901234</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">图片</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">数据统计图表：总用户数15,432，平均评分4.2/5.0，活跃度78%</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">4d5e6f78-9012-3456-def0-456789012345</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">文本</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">大多数用户对评分系统表示满意，界面友好，操作简便。建议进一步优化移动端体验。</td>
    </tr>
  </tbody>
</table>`
        },
        'Python2': { 
          status: 'completed', 
          result: 'Python脚本执行成功', 
          duration: '35s',
          startTime: '2024-08-19 14:53:15',
          endTime: '2024-08-19 14:53:50',
          details: '自定义处理完成',
          outputSize: '8KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "text_analysis": {
              "word_count": 1250,
              "sentence_count": 89,
              "readability_score": 0.78,
              "key_topics": ["用户体验", "评分系统", "数据统计", "界面优化"],
              "sentiment_analysis": {
                "overall_sentiment": "positive",
                "confidence": 0.87
              }
            },
            "custom_nlp_results": {
              "entity_extraction": ["评分网站", "用户", "界面设计"],
              "keyword_density": {
                "评分": 0.045,
                "用户": 0.038,
                "系统": 0.032
              }
            },
            "python_script_output": "成功分析文档结构和内容质量"
          }, null, 2)
        },
        '数据清洗': { 
          status: 'processing', 
          result: '正在进行数据清洗...', 
          duration: '进行中(2min30s)',
          startTime: '2024-08-19 14:53:50',
          endTime: '',
          details: '处理中',
          outputSize: '',
          hasOutput: false,
          outputType: 'processing',
          outputPreview: '处理中...\n当前进度: 65%\n正在清洗文本格式和无效字符...\n已处理段落: 23/35\n正在提取关键信息...'
        },
        '数据增强': { 
          status: 'pending', 
          result: '等待数据清洗完成', 
          duration: '-',
          startTime: '',
          endTime: '',
          details: '等待中',
          outputSize: '',
          hasOutput: false,
          outputType: 'pending'
        }
      }
    },
    {
      fileId: 'file-3',
      fileName: '通过评分网-3.txt',
      fileType: 'txt',
      fileSize: '500KB',
      overallStatus: '处理失败',
      currentNode: 'Python2',
      originalContent: '原始文件: 编码格式错误，无法正常读取内容',
      nodeProcessing: {
        'Python自定义': { 
          status: 'completed', 
          result: 'Python自定义脚本执行成功', 
          duration: '18s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:42',
          details: '自定义处理完成',
          outputSize: '2.8KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "custom_analysis": {
              "text_length": 2048,
              "sentence_count": 156,
              "keyword_density": {
                "评分": 0.045,
                "网站": 0.038,
                "用户": 0.032
              },
              "sentiment_analysis": {
                "overall_sentiment": "neutral",
                "confidence": 0.78
              }
            },
            "python_script_output": "成功提取了文本的关键特征和语义信息",
            "processing_metadata": {
              "script_version": "v1.2.3",
              "execution_time": "18.2s",
              "memory_usage": "95MB"
            }
          }, null, 2)
        },
        '文本解析节点': { 
          status: 'completed', 
          result: '解析成功，提取文本内容', 
          duration: '25s',
          startTime: '2024-08-19 14:52:42',
          endTime: '2024-08-19 14:53:07',
          details: '解析完成',
          outputSize: '12KB',
          hasOutput: true,
          outputType: 'text',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 25%;">块 ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 15%;">类型</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 60%;">识别内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">1a2b3c4d-5e6f-7890-abcd-ef1234567890</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">文本</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">评分网站使用指南</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">2b3c4d5e-6f78-9012-bcde-f23456789012</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">文本</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">本指南介绍了如何使用评分网站进行产品评价和反馈提交。</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">3c4d5e6f-7890-1234-cdef-345678901234</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">文本</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">用户可以通过星级评分、文字评论等方式表达对产品的满意度。</td>
    </tr>
  </tbody>
</table>`
        },
        'Python2': { 
          status: 'failed', 
          result: 'Python脚本执行失败', 
          duration: '8s',
          startTime: '2024-08-19 14:53:07',
          endTime: '2024-08-19 14:53:15',
          details: '自定义处理失败',
          outputSize: '',
          hasOutput: true,
          outputType: 'error',
          outputPreview: 'Error: CustomProcessingError\nPython2脚本执行失败\n错误类型: 内存不足\n错误位置: 自定义处理模块\n错误详情: 处理大文件时内存溢出\n\nPython脚本错误:\n  File "/scripts/custom_process.py", line 127, in process_text\n    result = nlp_model.analyze(large_text_chunk)\nMemoryError: Unable to allocate 2.5 GiB for an array with shape (327680000,) and data type float64\n\n建议解决方案:\n1. 减少文件大小或分块处理\n2. 增加系统内存配置\n3. 优化处理算法\n4. 联系技术支持'
        },
        '数据清洗': { 
          status: 'skipped', 
          result: '跳过处理', 
          duration: '-',
          startTime: '',
          endTime: '',
          details: '已跳过',
          outputSize: '',
          hasOutput: false,
          outputType: 'skipped'
        },
        '数据增强': { 
          status: 'skipped', 
          result: '跳过处理', 
          duration: '-',
          startTime: '',
          endTime: '',
          details: '已跳过',
          outputSize: '',
          hasOutput: false,
          outputType: 'skipped'
        }
      }
    },
    {
      fileId: 'file-4',
      fileName: '通过评分网-4.mp3',
      fileType: 'mp3',
      fileSize: '2.5MB',
      overallStatus: '处理完成',
      currentNode: '数据增强',
      originalContent: '原始音频: 时长2分钟，包含评分网站背景音乐',
      nodeProcessing: {
        'Python自定义': { 
          status: 'completed', 
          result: 'Python自定义脚本执行成功', 
          duration: '14s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:38',
          details: '自定义处理完成',
          outputSize: '2.1KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "custom_analysis": {
              "audio_duration": 120.5,
              "sample_rate": 44100,
              "audio_features": {
                "tempo": 120,
                "key": "C Major",
                "loudness": -12.3,
                "energy": 0.75
              },
              "speech_detection": {
                "speech_segments": ["0:15-0:25", "1:30-1:45"],
                "speech_confidence": 0.89
              }
            },
            "python_script_output": "成功提取了音频的声学特征和内容信息",
            "processing_metadata": {
              "script_version": "v1.2.3",
              "execution_time": "14.2s",
              "memory_usage": "85MB"
            }
          }, null, 2)
        },
        '音频解析节点': { 
          status: 'completed', 
          result: '解析成功，提取音频元数据', 
          duration: '14s',
          startTime: '2024-08-19 14:52:38',
          endTime: '2024-08-19 14:52:52',
          details: '解析完成',
          outputSize: '2KB',
          hasOutput: true,
          outputType: 'metadata',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 25%;">块 ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 15%;">类型</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 60%;">识别内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">5e6f7890-1234-5678-9abc-def012345678</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">音频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">背景音乐，轻快的流行音乐风格，节奏明快，适合网站背景播放</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">6f789012-3456-789a-bcde-f01234567890</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">音频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">"欢迎来到评分网，请为您的体验打分"语音播报</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">7890123a-bcde-f012-3456-789012345678</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">音频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">按钮点击音效，清脆的"滴"声</td>
    </tr>
  </tbody>
</table>`
        },
        'Python2': { 
          status: 'completed', 
          result: 'Python脚本执行成功', 
          duration: '42s',
          startTime: '2024-08-19 14:52:52',
          endTime: '2024-08-19 14:53:34',
          details: '自定义处理完成',
          outputSize: '5.1KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "audio_analysis": {
              "tempo": 120,
              "key": "C Major",
              "loudness": -12.3,
              "energy": 0.75,
              "danceability": 0.68,
              "valence": 0.82,
              "spectral_features": {
                "mfcc": [1.2, -0.8, 0.5, 1.1],
                "spectral_centroid": 2048.5,
                "zero_crossing_rate": 0.085
              }
            },
            "custom_audio_processing": {
              "noise_reduction": "applied",
              "volume_normalization": "completed",
              "frequency_analysis": "extracted",
              "speech_segments": ["0:15-0:25", "1:30-1:45"]
            },
            "python_script_output": "音频特征提取和处理完成"
          }, null, 2)
        },
        '数据清洗': { 
          status: 'completed', 
          result: '数据清洗完成', 
          duration: '30s',
          startTime: '2024-08-19 14:53:34',
          endTime: '2024-08-19 14:54:04',
          details: '清洗完成',
          outputSize: '1.8KB',
          hasOutput: true,
          outputType: 'structured_data',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 25%;">块 ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 15%;">类型</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 60%;">识别内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">5e6f7890-1234-5678-9abc-def012345678</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">音频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">背景音乐，流行风格，节奏明快</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">6f789012-3456-789a-bcde-f01234567890</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">音频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">语音播报："欢迎来到评分网，请为您的体验打分"</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">7890123a-bcde-f012-3456-789012345678</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">音频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">按钮点击音效，清脆"滴"声</td>
    </tr>
  </tbody>
</table>`
        },
        '数据增强': { 
          status: 'completed', 
          result: '数据增强完成', 
          duration: '15s',
          startTime: '2024-08-19 14:54:04',
          endTime: '2024-08-19 14:54:19',
          details: '增强完成',
          outputSize: '3.2KB',
          hasOutput: true,
          outputType: 'enhanced_data',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 10%;">ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 90%;">QA对</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">1</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"翻译成法语","input":"Hello","output":"Bonjour"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">2</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"翻译成西班牙语","input":"Good morning","output":"Buenos días"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">3</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"计算结果","input":"2 + 2","output":"4"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">4</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"解释概念","input":"什么是人工智能？","output":"人工智能是计算机科学的一个领域，致力于开发能够执行通常需要人类智能的任务的系统。"}</td>
    </tr>
  </tbody>
</table>`
        }
      }
    },
    {
      fileId: 'file-5',
      fileName: '通过评分网-5.mp4',
      fileType: 'mp4',
      fileSize: '5.5MB',
      overallStatus: '处理完成',
      currentNode: '数据增强',
      originalContent: '原始视频: 时长3分钟，包含评分网站广告',
      nodeProcessing: {
        'Python自定义': { 
          status: 'completed', 
          result: 'Python自定义脚本执行成功', 
          duration: '14s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:38',
          details: '自定义处理完成',
          outputSize: '3.8KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "custom_analysis": {
              "video_duration": 180.0,
              "resolution": "1920x1080",
              "frame_rate": 30,
              "scene_analysis": {
                "scene_changes": [15, 45, 90, 120, 165],
                "dominant_colors": ["#4F46E5", "#FFFFFF", "#10B981"],
                "motion_intensity": 0.65
              },
              "object_detection": {
                "detected_objects": ["界面", "按钮", "文字", "logo"],
                "confidence": 0.87
              }
            },
            "python_script_output": "成功分析了视频内容和视觉特征",
            "processing_metadata": {
              "script_version": "v1.2.3",
              "execution_time": "14.2s",
              "memory_usage": "145MB"
            }
          }, null, 2)
        },
        '视频解析节点': { 
          status: 'completed', 
          result: '解析成功，提取视频元数据', 
          duration: '14s',
          startTime: '2024-08-19 14:52:38',
          endTime: '2024-08-19 14:52:52',
          details: '解析完成',
          outputSize: '2KB',
          hasOutput: true,
          outputType: 'metadata',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 25%;">块 ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 15%;">类型</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 60%;">识别内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">8901234b-cdef-0123-4567-890123456789</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">视频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">评分网站首页展示，界面简洁明了，主色调为蓝色和白色</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">9012345c-def0-1234-5678-901234567890</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">视频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">标题动画："通过评分网 - 您的满意是我们的追求"</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">0123456d-ef01-2345-6789-012345678901</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">视频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">用户点击评分按钮，选择4.5星评分，界面显示"感谢您的评分"</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">1234567e-f012-3456-789a-bcdef0123456</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">视频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">星星闪烁动画，评分提交成功的视觉反馈</td>
    </tr>
  </tbody>
</table>`
        },
        'Python2': { 
          status: 'completed', 
          result: 'Python脚本执行成功', 
          duration: '58s',
          startTime: '2024-08-19 14:52:52',
          endTime: '2024-08-19 14:53:50',
          details: '自定义处理完成',
          outputSize: '12.5KB',
          hasOutput: true,
          outputType: 'custom_processing',
          outputPreview: JSON.stringify({
            "video_analysis": {
              "frame_count": 5400,
              "fps": 30,
              "scene_changes": [15, 45, 90, 120, 165],
              "motion_analysis": {
                "average_motion": 0.35,
                "max_motion": 0.78,
                "motion_variance": 0.12
              },
              "object_tracking": {
                "detected_objects": ["button", "text", "logo", "user_interface"],
                "tracking_confidence": 0.89
              }
            },
            "custom_video_processing": {
              "keyframe_extraction": "completed",
              "scene_segmentation": "applied",
              "quality_enhancement": "processed",
              "audio_video_sync": "verified"
            },
            "python_script_output": "视频内容分析和特征提取完成"
          }, null, 2)
        },
        '数据清洗': { 
          status: 'completed', 
          result: '数据清洗完成', 
          duration: '30s',
          startTime: '2024-08-19 14:53:50',
          endTime: '2024-08-19 14:54:20',
          details: '清洗完成',
          outputSize: '1.8KB',
          hasOutput: true,
          outputType: 'structured_data',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 25%;">块 ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 15%;">类型</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 60%;">识别内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">8901234b-cdef-0123-4567-890123456789</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">视频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">评分网站首页，蓝白色调，界面简洁</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">9012345c-def0-1234-5678-901234567890</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">视频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">标题动画："通过评分网 - 您的满意是我们的追求"</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">0123456d-ef01-2345-6789-012345678901</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">视频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">用户评分操作，4.5星评分，感谢提示</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">1234567e-f012-3456-789a-bcdef0123456</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">视频</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">星星闪烁动画，评分成功反馈</td>
    </tr>
  </tbody>
</table>`
        },
        '数据增强': { 
          status: 'completed', 
          result: '数据增强完成', 
          duration: '15s',
          startTime: '2024-08-19 14:54:20',
          endTime: '2024-08-19 14:54:35',
          details: '增强完成',
          outputSize: '3.2KB',
          hasOutput: true,
          outputType: 'enhanced_data',
          outputPreview: `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 10%;">ID</th>
      <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; width: 90%;">QA对</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">1</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"翻译成法语","input":"Hello","output":"Bonjour"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">2</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"翻译成西班牙语","input":"Good morning","output":"Buenos días"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">3</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"计算结果","input":"2 + 2","output":"4"}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 8px;">4</td>
      <td style="border: 1px solid #dee2e6; padding: 8px;">{"instruction":"解释概念","input":"什么是人工智能？","output":"人工智能是计算机科学的一个领域，致力于开发能够执行通常需要人类智能的任务的系统。"}</td>
    </tr>
  </tbody>
</table>`
        }
      }
    },
    {
      fileId: 'file-6',
      fileName: '通过评分网-6.pdf',
      fileType: 'pdf',
      fileSize: '800KB',
      overallStatus: '处理完成',
      currentNode: 'Python自定义',
      originalContent: '原始PDF文档: 包含广告内容，不符合处理要求',
      nodeProcessing: {
        'Python自定义': { 
          status: 'completed', 
          result: 'Python自定义脚本执行成功，文件被过滤', 
          duration: '12s',
          startTime: '2024-08-19 14:52:30',
          endTime: '2024-08-19 14:52:42',
          details: '文件预处理完成，检测到广告内容，已过滤',
          outputSize: '1.2KB',
          hasOutput: true,
          outputType: 'filtered',
          outputPreview: JSON.stringify({
            "custom_analysis": {
              "content_type_detection": "advertisement",
              "quality_score": 0.25,
              "relevance_score": 0.15,
              "filter_triggers": ["advertisement_keywords", "promotional_content", "low_quality_score"]
            },
            "filter_decision": {
              "action": "FILTERED",
              "reason": "检测到广告内容，质量分数过低",
              "confidence": 0.92,
              "filter_rules_matched": ["content_quality_filter", "advertisement_filter"]
            },
            "python_script_output": "文件已被过滤，不符合处理要求",
            "processing_metadata": {
              "script_version": "v1.2.3",
              "execution_time": "12.1s",
              "memory_usage": "68MB"
            }
          }, null, 2)
        },
        '文本解析节点': { 
          status: 'skipped', 
          result: '跳过处理 - 文件已被过滤', 
          duration: '-',
          startTime: '',
          endTime: '',
          details: '已跳过',
          outputSize: '',
          hasOutput: false,
          outputType: 'skipped'
        },
        'Python2': { 
          status: 'skipped', 
          result: '跳过处理 - 文件已被过滤', 
          duration: '-',
          startTime: '',
          endTime: '',
          details: '已跳过',
          outputSize: '',
          hasOutput: false,
          outputType: 'skipped'
        },
        '数据清洗': { 
          status: 'skipped', 
          result: '跳过处理 - 文件已被过滤', 
          duration: '-',
          startTime: '',
          endTime: '',
          details: '已跳过',
          outputSize: '',
          hasOutput: false,
          outputType: 'skipped'
        },
        '数据增强': { 
          status: 'skipped', 
          result: '跳过处理 - 文件已被过滤', 
          duration: '-',
          startTime: '',
          endTime: '',
          details: '已跳过',
          outputSize: '',
          hasOutput: false,
          outputType: 'skipped'
        }
      }
    }
  ];

  // 为了兼容表格显示，添加辅助函数
  const getDisplayData = (file: FileProcessingData) => {
    const parseNodeName = getParseNodeName(file.fileType);
    
    // 检查是否在Python自定义节点被过滤
    const isFiltered = file.nodeProcessing['Python自定义']?.outputType === 'filtered';
    
    return {
      ...file,
      status: file.overallStatus,
      createTime: file.nodeProcessing[parseNodeName]?.startTime || file.nodeProcessing['Python自定义']?.startTime || '2024-08-19 14:52:24',
      updateTime: Object.values(file.nodeProcessing).find(node => node.endTime)?.endTime || file.nodeProcessing[parseNodeName]?.startTime || file.nodeProcessing['Python自定义']?.endTime || '2024-08-19 14:52:24',
      note: file.overallStatus === '处理失败' ? '解析错误' : 
            file.overallStatus === '处理中' ? `当前在${file.currentNode}` : 
            isFiltered ? '文件已过滤' : '-',
      statusColor: file.overallStatus === '处理完成' ? 'text-green-600' : 
                   file.overallStatus === '处理中' ? 'text-blue-600' : 
                   file.overallStatus === '处理失败' ? 'text-red-600' : 'text-gray-600',
      statusIcon: file.overallStatus === '处理中' ? '●' : file.overallStatus === '等待中' ? '○' : '●'
    };
  };

  const toggleFileExpansion = (fileId: string) => {
    setExpandedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const getNodeStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'processing': return <Play className="w-3 h-3 text-blue-600" />;
      case 'failed': return <XCircle className="w-3 h-3 text-red-600" />;
      case 'pending': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'skipped': return <AlertCircle className="w-3 h-3 text-orange-500" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">执行详情</h2>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          文件处理进度量 
          <span className="ml-2">
            处理成功 <span className="text-blue-600 font-medium">48/100</span> 
            处理失败数 <span className="text-red-600 font-medium">5/100</span>
          </span>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          重试
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                文件名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                文件类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                开始时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                结束时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                详情
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                处理过程
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((file, index) => {
              const row = getDisplayData(file);
              const progress = getFileProgress(file);
              return (
              <React.Fragment key={file.fileId}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.fileName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${row.statusColor} flex items-center`}>
                      <span className="mr-1">{row.statusIcon}</span>
                      {row.status}
                      <span className="text-xs text-gray-500 ml-2">
                        {progress.progressText}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.fileType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.createTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.updateTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.overallStatus === '处理失败' ? (
                      <span className="text-red-600 text-xs">编码格式错误</span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleFileExpansion(file.fileId)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {expandedFiles.includes(file.fileId) ? (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          收起
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-4 h-4 mr-1" />
                          展开
                        </>
                      )}
                    </button>
                  </td>
                </tr>
                
                {/* 展开的节点详情行 */}
                {expandedFiles.includes(file.fileId) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">节点处理详情</h4>
                        
                        {/* 节点处理结果 */}
                        <div className="relative">
                          {Object.entries(file.nodeProcessing)
                            .filter(([nodeName, nodeData]) => {
                              // 如果文件在Python自定义被过滤，只显示Python自定义节点
                              if (file.nodeProcessing['Python自定义']?.outputType === 'filtered') {
                                return nodeName === 'Python自定义';
                              }
                              // 否则显示所有非跳过的节点
                              return nodeData.status !== 'skipped';
                            })
                            .map(([nodeName, nodeData], index, array) => (
                            <div key={nodeName} className="relative">
                              {/* 连接线 - 不是第一个节点时显示 */}
                              {index > 0 && (
                                <div className="absolute left-4 -top-3 w-0.5 h-6 bg-gray-300"></div>
                              )}
                              
                              <div className="p-3 bg-white rounded border mb-3 relative">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    {getNodeStatusIcon(nodeData.status)}
                                    <div>
                                      <span className="font-medium text-gray-900">{nodeName}</span>
                                      <div className="text-sm text-gray-500 mt-1">
                                        耗时: {nodeData.duration}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* 连接线 - 不是最后一个节点时显示 */}
                              {index < array.length - 1 && (
                                <div className="absolute left-4 -bottom-3 w-0.5 h-6 bg-gray-300"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )})}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">1</span>
        <span className="px-3 py-1 text-gray-600 text-sm cursor-pointer hover:bg-gray-100 rounded">2</span>
        <span className="px-3 py-1 text-gray-600 text-sm cursor-pointer hover:bg-gray-100 rounded">3</span>
        <span className="px-3 py-1 text-gray-600 text-sm cursor-pointer hover:bg-gray-100 rounded">4</span>
        <span className="px-3 py-1 text-gray-600 text-sm cursor-pointer hover:bg-gray-100 rounded">5</span>
        <button className="px-3 py-1 text-gray-600 text-sm cursor-pointer hover:bg-gray-100 rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ExecutionDetails; 