import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Clock, Play, AlertCircle, Eye, Download, FileText, Search } from 'lucide-react';

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
  const [viewingResult, setViewingResult] = useState<{fileId: string, nodeName: string} | null>(null);
  const [blockIdSearch, setBlockIdSearch] = useState('');
  const [contentSearch, setContentSearch] = useState('');

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
        '图片解析节点': { 
          status: 'completed', 
          result: '解析成功，提取图片元数据', 
          duration: '14s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:38',
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
        'Python自定义节点': { 
          status: 'completed', 
          result: 'Python脚本执行成功', 
          duration: '25s',
          startTime: '2024-08-19 14:52:38',
          endTime: '2024-08-19 14:53:03',
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
          startTime: '2024-08-19 14:53:03',
          endTime: '2024-08-19 14:53:33',
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
          startTime: '2024-08-19 14:53:33',
          endTime: '2024-08-19 14:53:48',
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
        '文本解析节点': { 
          status: 'completed', 
          result: '解析成功，提取文本内容', 
          duration: '29s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:53',
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
        'Python自定义节点': { 
          status: 'completed', 
          result: 'Python脚本执行成功', 
          duration: '35s',
          startTime: '2024-08-19 14:52:53',
          endTime: '2024-08-19 14:53:28',
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
          duration: '进行中(2分30秒)',
          startTime: '2024-08-19 14:53:28',
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
      currentNode: '文本解析节点',
      originalContent: '原始文件: 编码格式错误，无法正常读取内容',
      nodeProcessing: {
        '文本解析节点': { 
          status: 'failed', 
          result: '解析失败', 
          duration: '4s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:28',
          details: '解析失败',
          outputSize: '',
          hasOutput: true,
          outputType: 'error',
          outputPreview: 'Error: UnicodeDecodeError\n无法解码文件内容\n检测到的编码: unknown\n文件大小: 500KB\n错误位置: 第3行，第127个字符\n建议: 请检查文件编码格式或重新保存文件为UTF-8格式\n\n常见解决方案:\n1. 使用记事本打开文件，另存为UTF-8编码\n2. 检查文件是否包含特殊字符\n3. 联系管理员获取技术支持'
        },
        'Python自定义节点': { 
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
        '音频解析节点': { 
          status: 'completed', 
          result: '解析成功，提取音频元数据', 
          duration: '14s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:38',
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
        'Python自定义节点': { 
          status: 'completed', 
          result: 'Python脚本执行成功', 
          duration: '42s',
          startTime: '2024-08-19 14:52:38',
          endTime: '2024-08-19 14:53:20',
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
              "frequency_analysis": "extracted"
            },
            "python_script_output": "音频特征提取和处理完成"
          }, null, 2)
        },
        '数据清洗': { 
          status: 'completed', 
          result: '数据清洗完成', 
          duration: '30s',
          startTime: '2024-08-19 14:53:20',
          endTime: '2024-08-19 14:53:50',
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
          startTime: '2024-08-19 14:53:50',
          endTime: '2024-08-19 14:54:05',
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
        '视频解析节点': { 
          status: 'completed', 
          result: '解析成功，提取视频元数据', 
          duration: '14s',
          startTime: '2024-08-19 14:52:24',
          endTime: '2024-08-19 14:52:38',
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
        'Python自定义节点': { 
          status: 'completed', 
          result: 'Python脚本执行成功', 
          duration: '58s',
          startTime: '2024-08-19 14:52:38',
          endTime: '2024-08-19 14:53:36',
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
              "quality_enhancement": "processed"
            },
            "python_script_output": "视频内容分析和特征提取完成"
          }, null, 2)
        },
        '数据清洗': { 
          status: 'completed', 
          result: '数据清洗完成', 
          duration: '30s',
          startTime: '2024-08-19 14:53:36',
          endTime: '2024-08-19 14:54:06',
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
          startTime: '2024-08-19 14:54:06',
          endTime: '2024-08-19 14:54:21',
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
    }
  ];

  // 为了兼容表格显示，添加辅助函数
  const getDisplayData = (file: FileProcessingData) => {
    const parseNodeName = getParseNodeName(file.fileType);
    return {
      ...file,
      status: file.overallStatus,
      createTime: file.nodeProcessing[parseNodeName]?.startTime || '2024-08-19 14:52:24',
      updateTime: Object.values(file.nodeProcessing).find(node => node.endTime)?.endTime || file.nodeProcessing[parseNodeName]?.startTime || '2024-08-19 14:52:24',
      note: file.overallStatus === '处理失败' ? '解析错误' : file.overallStatus === '处理中' ? `当前在${file.currentNode}` : '-',
      statusColor: file.overallStatus === '处理完成' ? 'text-green-600' : 
                   file.overallStatus === '处理中' ? 'text-blue-600' : 
                   file.overallStatus === '处理失败' ? 'text-red-600' : 'text-gray-600',
      statusIcon: file.overallStatus === '等待中' ? '○' : '●'
    };
  };

  const toggleFileExpansion = (fileId: string) => {
    setExpandedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const openResultViewer = (fileId: string, nodeName: string) => {
    setViewingResult({ fileId, nodeName });
  };

  const closeResultViewer = () => {
    setViewingResult(null);
    setBlockIdSearch('');
    setContentSearch('');
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

  const getCurrentFile = () => {
    if (!viewingResult) return null;
    return tableData.find(file => file.fileId === viewingResult.fileId);
  };

  const getCurrentNodeData = (): NodeProcessingData | null => {
    const file = getCurrentFile();
    if (!file || !viewingResult) return null;
    return file.nodeProcessing[viewingResult.nodeName] || null;
  };

  // 搜索过滤功能
  const filterTableContent = (htmlContent: string): string => {
    if (!blockIdSearch && !contentSearch) return htmlContent;
    
    // 解析HTML表格内容
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const rows = doc.querySelectorAll('tbody tr');
    
    let filteredRows: string[] = [];
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 3) {
        const blockId = cells[0].textContent || '';
        const content = cells[2].textContent || '';
        
        const matchesBlockId = !blockIdSearch || blockId.toLowerCase().includes(blockIdSearch.toLowerCase());
        const matchesContent = !contentSearch || content.toLowerCase().includes(contentSearch.toLowerCase());
        
        if (matchesBlockId && matchesContent) {
          filteredRows.push(row.outerHTML);
        }
      }
    });
    
    // 重新构建表格
    const tableHeader = doc.querySelector('thead')?.outerHTML || '';
    const filteredTableBody = `<tbody>${filteredRows.join('')}</tbody>`;
    
    return `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">
      ${tableHeader}
      ${filteredTableBody}
    </table>`;
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
                    ) : file.overallStatus === '处理中' ? (
                      <span className="text-blue-600 text-xs">正在处理中...</span>
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
                        
                        {/* 原始文件预览 */}
                        <div className="p-3 bg-white rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">原始文件</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => openResultViewer(file.fileId, '原始文件')}
                                className="text-blue-600 hover:text-blue-800"
                                title="查看内容"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-green-600 hover:text-green-800"
                                title="下载原始文件"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 节点处理结果 */}
                        <div className="relative">
                          {Object.entries(file.nodeProcessing).map(([nodeName, nodeData], index, array) => (
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
                                  <div className="flex items-center space-x-2">
                                    {nodeData.hasOutput && nodeData.status !== 'failed' && (
                                      <>
                                        <button 
                                          onClick={() => openResultViewer(file.fileId, nodeName)}
                                          className="text-blue-600 hover:text-blue-800"
                                          title="查看结果"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                          className="text-green-600 hover:text-green-800"
                                          title="下载结果"
                                        >
                                          <Download className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
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
      
      {/* 处理结果查看器模态框 */}
      {viewingResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {getCurrentFile()?.fileName} - {viewingResult.nodeName}处理结果
              </h3>
              <div className="flex items-center space-x-2">
                {/* 解析节点和数据清洗节点的搜索框 */}
                {(viewingResult.nodeName.includes('解析节点') || viewingResult.nodeName.includes('数据清洗')) && (
                  <>
                    <div className="flex items-center space-x-1">
                      <Search className="w-3 h-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="搜索块ID"
                        value={blockIdSearch}
                        onChange={(e) => setBlockIdSearch(e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Search className="w-3 h-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="搜索内容"
                        value={contentSearch}
                        onChange={(e) => setContentSearch(e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
                <button
                  onClick={closeResultViewer}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {viewingResult.nodeName === '原始文件' ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-3">原始文件内容预览:</div>
                  <div className="bg-gray-50 p-4 rounded border font-mono text-sm">
                    {getCurrentFile()?.originalContent}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded border">
                    {getCurrentNodeData()?.outputType === 'metadata' || getCurrentNodeData()?.outputType === 'text' || getCurrentNodeData()?.outputType === 'structured_data' || getCurrentNodeData()?.outputType === 'enhanced_data' ? (
                      <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: getCurrentNodeData()?.outputType === 'enhanced_data' 
                            ? getCurrentNodeData()?.outputPreview || '' 
                            : filterTableContent(getCurrentNodeData()?.outputPreview || '') 
                        }}
                      />
                    ) : (
                      <pre className="text-sm whitespace-pre-wrap">
                        {getCurrentNodeData()?.outputPreview || '暂无输出内容'}
                      </pre>
                    )}
                  </div>
                  {getCurrentNodeData()?.outputType === 'error' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <div className="text-sm font-medium text-red-800 mb-1">错误信息</div>
                      <div className="text-sm text-red-600">
                        建议检查文件格式或联系管理员
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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