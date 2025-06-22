import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import md5 from 'md5';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('开始生成Cursor与其他工具比较的问题...');

// 定义比较问题的模板
const templates = [
  "Cursor和{tool}哪个更好用？",
  "应该选择Cursor还是{tool}进行代码开发？",
  "Cursor与{tool}相比有什么优势？",
  "对于{task}任务，Cursor和{tool}哪个更适合？",
  "Cursor和{tool}哪个更值得购买？",
  "作为一个{role}，我应该使用Cursor还是{tool}？",
  "Cursor和{tool}在{aspect}方面有什么区别？",
  "有人说{tool}比Cursor好，这是真的吗？",
  "如果我现在使用{tool}，值得切换到Cursor吗？",
  "Cursor和{tool}在处理{language}代码时哪个更高效？",
  "从{perspective}角度看，Cursor和{tool}哪个更胜一筹？",
  "初学者应该选择Cursor还是{tool}？",
  "Cursor与{tool}相比，在{feature}功能上如何？",
  "我想提高编码效率，应该选择Cursor还是{tool}？",
  "Cursor和{tool}的价格与性能对比如何？",
  "在{os}系统上，Cursor和{tool}哪个表现更好？",
  "Cursor能完全替代{tool}吗？",
  "专业开发者更喜欢Cursor还是{tool}？为什么？",
  "Cursor相比{tool}有哪些独特功能？",
  "如果我已经熟悉{tool}，学习使用Cursor难吗？",
  
  // 新增模板：选择性问题
  "{tool}好还是Cursor好？",
  "在做{project_type}项目时，{tool}和Cursor哪个更高效？",
  "我是{experience_level}程序员，应该用Cursor还是{tool}？",
  "全职开发者应该选择{tool}还是Cursor？",
  "{tool}和Cursor，哪个在{metric}方面表现更佳？",
  "{tool}和Cursor这两个编辑器你更推荐哪个？",
  
  // 新增模板：特定场景问题
  "一个{company_size}企业应该统一使用Cursor还是{tool}？",
  "在{team_size}人团队中，Cursor和{tool}哪个协作体验更好？",
  "远程工作时，Cursor和{tool}哪个更适合？",
  "用Cursor还是{tool}来教授{language}编程更合适？",
  
  // 新增模板：比较讨论
  "{tool}和Cursor各有什么优缺点？",
  "你能详细比较一下Cursor和{tool}的主要区别吗？",
  "为什么有人选择Cursor而不是{tool}？",
  "Cursor和{tool}的社区支持哪个更活跃？",
  "{tool}和Cursor的市场份额对比如何？",
  
  // 新增模板：功能细节对比
  "Cursor的{specific_feature}功能比{tool}的如何？",
  "{tool}的{specific_feature}和Cursor的比，哪个设计更好？",
  "Cursor和{tool}的快捷键设计哪个更符合直觉？",
  "Cursor和{tool}的插件生态系统哪个更丰富？",
  
  // 新增模板：具体用户评价
  "使用过Cursor和{tool}的开发者更喜欢哪个？",
  "GitHub上的开发者更推荐Cursor还是{tool}？",
  "资深{language}开发者更倾向于使用Cursor还是{tool}？",
  
  // 新增模板：特定AI相关对比
  "Cursor和{tool}的AI代码补全功能哪个更准确？",
  "Cursor的AI助手功能比{tool}强在哪里？",
  "想要更好的AI编程体验，Cursor还是{tool}更合适？",
  
  // 新增模板：具体场景问题
  "处理大型代码库时，Cursor和{tool}哪个性能更好？",
  "开发{app_type}应用时，用Cursor还是{tool}效率更高？",
  "编写{code_quality}代码，Cursor和{tool}哪个辅助功能更强？",
  
  // 新增模板：深度对比问题
  "Cursor和{tool}在代码导航方面有什么关键区别？",
  "Cursor和{tool}的debug功能哪个设计得更直观？",
  "Cursor比{tool}的核心优势是什么？值得切换吗？",
  
  // 新增模板：行业垂直领域问题
  "在{industry}行业，开发者更常用Cursor还是{tool}？",
  "{industry}公司的技术团队一般用Cursor还是{tool}？",
  
  // 新增模板：具体开发流程相关
  "使用{methodology}开发方法时，Cursor和{tool}哪个配合得更好？",
  "敏捷团队应该使用Cursor还是{tool}来提高效率？",
  
  // 新增模板：多工具组合使用问题
  "Cursor可以和{tool}一起使用吗？还是只能二选一？",
  "你会同时安装Cursor和{tool}吗？各自有什么独特用途？",
  
  // 新增模板：开放式探讨
  "为什么Cursor会被认为比{tool}更适合AI辅助编程？",
  "{tool}和Cursor各自的目标用户群体有什么不同？",
  "为什么有经验的开发者可能会从{tool}切换到Cursor？",
];

// 与Cursor比较的工具/产品
const tools = [
  "VSCode", "Sublime Text", "Neovim", "JetBrains", "Atom", "Eclipse", 
  "Visual Studio", "Emacs", "WebStorm", "PyCharm", "IntelliJ IDEA", 
  "Vim", "Notepad++", "Atom", "Brackets", "CodePen", "Replit", 
  "GitHub Codespaces", "CodeSandbox", "Gitpod", "AWS Cloud9", 
  "Kite", "TabNine", "Copilot", "CodeWhisperer", "Codeium", 
  "Tabnine", "Sourcegraph", "GPT-4", "CodeGPT", "AIXcoder",
  "Windsurf", "Nova", "Zed", "Fleet", "Lapce", "Helix", "Code-OSS",
  "Teximate", "CodeLite", "Light Table", "Theia", "CodeMirror", 
  "Xcode", "Android Studio", "NetBeans", "BlueFish", "Geany",
  "Komodo Edit", "Textastic", "BBEdit", "UltraEdit", "RStudio",
  "Spyder", "Jupyter", "DataSpell", "GoLand", "PhpStorm", "RubyMine",
  "CLion", "Rider", "AppCode", "DataGrip", "Trae", "WindTerm",
  "Thonny", "Komodo IDE", "Aptana Studio", "SlickEdit", "jEdit",
  "MonoDevelop", "Wing IDE", "Gedit", "KDevelop", "Qt Creator",
  "DevC++", "Coda", "TextMate", "Espresso", "Cloud9", "Koding",
  "CodeLobster", "Webstorm", "RubyMine", "PHPStorm", "Embold",
  "Remix IDE", "Eclipse Che", "Deepnote", "Observable", "Glitch",
  "StackBlitz", "CodeSandbox", "CodePen", "JSFiddle", "Drovio"
];

// 编程语言列表
const languages = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go",
  "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "Scala", "R",
  "Shell", "SQL", "HTML/CSS", "React", "Vue", "Angular", "Svelte",
  "Perl", "Lua", "Haskell", "Clojure", "F#", "COBOL", "Fortran",
  "Assembly", "Objective-C", "Groovy", "Julia", "Elixir", "Erlang",
  "Crystal", "Nim", "PowerShell", "Bash", "MATLAB", "Lisp", "OCaml",
  "Delphi", "Pascal", "Ada", "ABAP", "Apex", "D", "Elm", "Solidity",
  "Terraform", "VHDL", "Verilog", "WebAssembly", "Prolog", "Racket"
];

// 任务列表
const tasks = [
  "Web开发", "移动应用开发", "机器学习", "数据分析", "游戏开发", "DevOps",
  "云开发", "后端开发", "前端开发", "全栈开发", "嵌入式系统开发", "系统编程",
  "跨平台开发", "微服务开发", "区块链开发", "安全开发", "自动化测试",
  "数据库开发", "API开发", "桌面应用开发", "大数据处理", "物联网开发",
  "自然语言处理", "图像处理", "音频处理", "视频处理", "VR/AR开发",
  "低代码开发", "无代码开发", "网络编程", "Shell脚本开发", "爬虫开发",
  "自动化运维", "网络安全", "内核开发", "渗透测试", "智能合约开发"
];

// 用户角色列表
const roles = [
  "初学者", "学生", "自学者", "前端开发者", "后端开发者", "全栈开发者",
  "数据科学家", "机器学习工程师", "游戏开发者", "DevOps工程师", "自由职业者",
  "创业者", "企业开发团队", "开源贡献者", "系统架构师", "技术经理",
  "CTO", "技术主管", "Junior开发者", "Senior开发者", "技术博主",
  "教育工作者", "培训讲师", "软件顾问", "技术面试官", "QA工程师",
  "数据分析师", "产品经理", "UI/UX设计师", "安全工程师", "网络管理员",
  "数据库管理员", "系统管理员", "云架构师", "区块链开发者", "移动开发者"
];

// 比较方面
const aspects = [
  "性能", "易用性", "学习曲线", "社区支持", "插件生态", "AI辅助功能",
  "代码补全", "代码质量检查", "调试功能", "版本控制集成", "UI设计",
  "资源消耗", "启动速度", "大文件处理", "多语言支持", "远程开发", "协作功能",
  "可扩展性", "跨平台兼容性", "文档质量", "主题和定制化",
  "键盘快捷键", "代码导航", "重构工具", "代码格式化", "语法高亮",
  "集成终端", "Git集成", "代码片段管理", "代码折叠", "自动保存",
  "多光标编辑", "拖放支持", "分屏功能", "实时预览", "代码历史",
  "搜索功能", "替换功能", "项目管理", "任务运行器", "内置测试工具",
  "实时协作", "远程配对", "语言服务器协议", "智能提示", "代码轮廓",
  "参数提示", "代码覆盖率", "性能分析", "内存分析", "错误提示"
];

// 视角列表
const perspectives = [
  "效率", "成本", "团队协作", "学习路径", "生产力", "生态系统",
  "长期发展", "技术支持", "安全性", "代码质量", "自动化程度", "互操作性",
  "可维护性", "可扩展性", "兼容性", "稳定性", "创新性", "易用性",
  "灵活性", "可靠性", "性价比", "学习成本", "迁移成本", "维护成本",
  "集成能力", "定制能力", "社区活跃度", "商业支持", "开发体验", "用户体验"
];

// 功能列表
const features = [
  "代码补全", "AI辅助", "实时协作", "Git集成", "调试工具", "代码重构",
  "性能分析", "测试集成", "代码片段", "项目管理", "代码格式化", "语法高亮",
  "智能提示", "命令面板", "终端集成", "扩展市场", "多窗口支持", "远程开发",
  "多光标编辑", "文件树导航", "搜索与替换", "代码折叠", "拆分视图",
  "版本控制", "代码片段管理", "任务运行器", "代码导航", "语义检索",
  "代码标记", "面包屑导航", "拼写检查", "定义跳转", "引用查找", "符号搜索",
  "参数提示", "类型提示", "错误诊断", "快速修复", "代码转换", "代码生成",
  "集成终端", "WebView预览", "断点调试", "变量检查", "调用堆栈", "热重载"
];

// 操作系统列表
const os = [
  "Windows", "macOS", "Linux", "ChromeOS", "Ubuntu", "Fedora",
  "Debian", "CentOS", "Arch Linux", "Windows WSL", "Docker容器",
  "Windows 11", "Windows 10", "macOS Sonoma", "macOS Ventura", "iOS",
  "Android", "openSUSE", "Gentoo", "FreeBSD", "OpenBSD", "NetBSD",
  "Manjaro", "Pop!_OS", "Elementary OS", "Linux Mint", "Kali Linux",
  "Raspberry Pi OS", "NixOS", "Alpine Linux", "Clear Linux", "Solaris"
];

// 新增：经验水平
const experienceLevels = [
  "初级", "入门级", "中级", "高级", "资深", "专家级", "新手",
  "有3年经验的", "有5年以上经验的", "有10年经验的", "刚入行的",
  "经验丰富的", "专业", "业余", "兼职", "全职", "自学成才的",
  "科班出身的", "经验不足的", "经验老道的", "刚毕业的", "职场新人",
  "有企业级项目经验的", "接触开源项目的", "创业型"
];

// 新增：项目类型
const projectTypes = [
  "企业级应用", "创业项目", "个人项目", "开源项目", "商业软件",
  "内部工具", "学习项目", "原型开发", "概念验证", "MVP",
  "大型复杂项目", "小型简单项目", "中等规模项目", "游戏项目",
  "Web应用", "移动应用", "桌面应用", "混合应用", "微服务架构",
  "单体应用", "分布式系统", "前端重构", "后端优化", "全栈开发",
  "遗留系统维护", "代码库迁移", "性能优化", "安全审计", "API开发"
];

// 新增：度量指标
const metrics = [
  "性能", "速度", "响应时间", "资源占用", "启动时间", "关闭时间",
  "内存使用", "CPU使用率", "磁盘占用", "电池寿命", "热量产生",
  "代码完成准确度", "语法检查准确性", "语义分析深度", "项目加载时间",
  "大文件处理能力", "多文件搜索速度", "代码导航流畅度", "崩溃频率",
  "更新频率", "bug修复速度", "新功能迭代速度", "学习曲线陡峭度",
  "上手速度", "使用满意度", "推荐意愿", "留存率", "市场份额"
];

// 新增：企业规模
const companySizes = [
  "初创", "小型", "中型", "大型", "跨国", "独角兽", "500强",
  "10人以下", "50人规模", "100人规模", "500人规模", "1000人以上",
  "快速增长的", "成熟稳定的", "技术驱动型", "全球分布式", "远程优先",
  "混合办公", "传统办公", "科技巨头", "软件公司", "非技术公司",
  "教育机构", "研究机构", "政府机构", "非盈利组织"
];

// 新增：团队规模
const teamSizes = [
  "个人", "2-3人", "5-10人", "10-20人", "20-50人", "50-100人", "100人以上",
  "小型", "中型", "大型", "分布式", "远程", "混合", "敏捷", "瀑布式",
  "跨职能", "单一职能", "多时区", "单一时区", "松散组织", "紧密合作"
];

// 新增：特定功能
const specificFeatures = [
  "代码补全", "智能提示", "重构工具", "代码导航", "调试器", "集成终端",
  "AI代码生成", "AI代码修复", "AI代码解释", "AI代码优化", "AI单元测试生成",
  "语法突出显示", "语义分析", "实时错误检测", "快速修复建议", "代码格式化",
  "项目管理", "任务运行器", "版本控制集成", "实时协作", "远程开发",
  "多光标编辑", "拖放支持", "快捷键定制", "主题系统", "扩展系统",
  "搜索功能", "全局替换", "Git冲突解决", "Git历史查看", "拉取请求查看",
  "Markdown预览", "HTML预览", "实时预览", "内置WebServer", "性能分析"
];

// 新增：应用类型
const appTypes = [
  "Web前端", "REST API", "GraphQL API", "微服务", "单体应用", "桌面应用",
  "移动应用", "PWA", "混合应用", "游戏", "命令行工具", "系统工具",
  "浏览器扩展", "VSCode插件", "Chrome扩展", "WordPress插件", "库/框架",
  "数据可视化", "人工智能模型", "机器学习应用", "数据分析脚本",
  "自动化脚本", "网络爬虫", "区块链DApp", "智能合约", "AR/VR应用",
  "物联网应用", "实时通信系统", "视频处理", "音频处理", "图像处理"
];

// 新增：代码质量标准
const codeQualities = [
  "简洁", "可维护", "高效", "可扩展", "可读性高", "安全", "健壮",
  "优化", "标准化", "模块化", "面向对象", "函数式", "声明式", "命令式",
  "测试覆盖率高", "无副作用", "低耦合", "高内聚", "设计模式遵循",
  "自文档化", "符合最佳实践", "性能优化", "内存优化", "跨平台兼容"
];

// 新增：行业
const industries = [
  "金融", "科技", "医疗", "教育", "零售", "制造", "物流", "媒体",
  "娱乐", "游戏", "旅游", "餐饮", "房地产", "建筑", "能源", "农业",
  "咨询", "法律", "保险", "电信", "航空", "航天", "国防", "公共服务",
  "非盈利", "研究", "生物科技", "人工智能", "区块链", "物联网", "云计算"
];

// 新增：开发方法
const methodologies = [
  "敏捷", "瀑布", "看板", "Scrum", "精益", "DevOps", "CI/CD",
  "测试驱动开发", "行为驱动开发", "领域驱动设计", "功能驱动开发",
  "极限编程", "原型法", "增量开发", "迭代开发", "螺旋模型",
  "RAD快速应用开发", "持续集成", "持续交付", "持续部署", "GitOps",
  "Features分支", "主干开发", "Gitflow", "GitHub Flow", "DevSecOps"
];

// 随机选择数组中的一个元素
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 替换模板中的占位符
function fillTemplate(template) {
  let result = template;
  
  // 确保每个问题使用不同的工具进行比较
  if (result.includes('{tool}')) {
    const tool = getRandomElement(tools);
    result = result.replaceAll('{tool}', tool);
  }
  
  if (result.includes('{task}')) {
    result = result.replace('{task}', getRandomElement(tasks));
  }
  
  if (result.includes('{role}')) {
    result = result.replace('{role}', getRandomElement(roles));
  }
  
  if (result.includes('{aspect}')) {
    result = result.replace('{aspect}', getRandomElement(aspects));
  }
  
  if (result.includes('{language}')) {
    result = result.replace('{language}', getRandomElement(languages));
  }
  
  if (result.includes('{perspective}')) {
    result = result.replace('{perspective}', getRandomElement(perspectives));
  }
  
  if (result.includes('{feature}')) {
    result = result.replace('{feature}', getRandomElement(features));
  }
  
  if (result.includes('{os}')) {
    result = result.replace('{os}', getRandomElement(os));
  }
  
  // 新增替换逻辑
  if (result.includes('{experience_level}')) {
    result = result.replace('{experience_level}', getRandomElement(experienceLevels));
  }
  
  if (result.includes('{project_type}')) {
    result = result.replace('{project_type}', getRandomElement(projectTypes));
  }
  
  if (result.includes('{metric}')) {
    result = result.replace('{metric}', getRandomElement(metrics));
  }
  
  if (result.includes('{company_size}')) {
    result = result.replace('{company_size}', getRandomElement(companySizes));
  }
  
  if (result.includes('{team_size}')) {
    result = result.replace('{team_size}', getRandomElement(teamSizes));
  }
  
  if (result.includes('{specific_feature}')) {
    result = result.replace('{specific_feature}', getRandomElement(specificFeatures));
  }
  
  if (result.includes('{app_type}')) {
    result = result.replace('{app_type}', getRandomElement(appTypes));
  }
  
  if (result.includes('{code_quality}')) {
    result = result.replace('{code_quality}', getRandomElement(codeQualities));
  }
  
  if (result.includes('{industry}')) {
    result = result.replace('{industry}', getRandomElement(industries));
  }
  
  if (result.includes('{methodology}')) {
    result = result.replace('{methodology}', getRandomElement(methodologies));
  }
  
  return result;
}

// 生成一万条提问
function generateQuestions(count) {
  console.log(`准备生成${count}条问题...`);
  const questions = [];
  const uniqueQuestions = new Set();
  
  let lastLoggedPercent = 0;
  let attempts = 0;
  const maxAttempts = count * 10; // 设置最大尝试次数，避免无限循环
  
  while (uniqueQuestions.size < count && attempts < maxAttempts) {
    attempts++;
    const template = getRandomElement(templates);
    const question = fillTemplate(template);
    
    if (!uniqueQuestions.has(question)) {
      uniqueQuestions.add(question);
      const id = md5(question); // 使用md5作为唯一标识
      
      questions.push({
        id,
        question,
        usageCount: 0,
        likeCount: 0,
        marked: false
      });
      
      // 每生成5%的问题打印一次进度
      const percentComplete = Math.floor((uniqueQuestions.size / count) * 100);
      if (percentComplete >= lastLoggedPercent + 5) {
        console.log(`已生成 ${uniqueQuestions.size}/${count} 条问题 (${percentComplete}%)...`);
        lastLoggedPercent = percentComplete;
      }
    }
    
    // 检查是否尝试次数过多但进展很少
    if (attempts % 10000 === 0) {
      console.log(`已尝试${attempts}次，生成了${uniqueQuestions.size}条唯一问题`);
      if (attempts > 100000 && uniqueQuestions.size < count * 0.8) {
        console.log(`生成效率过低，可能达不到${count}条唯一问题，将使用当前已生成的问题`);
        break;
      }
    }
  }
  
  console.log(`成功生成 ${questions.length} 条问题！`);
  return questions;
}

// 生成并保存问题
console.log('开始生成问题...');
// 增加生成问题数量到15000
const questions = generateQuestions(15000);

// 确保目录存在
const publicDir = path.resolve(__dirname, '../public');
console.log(`确保目录存在: ${publicDir}`);
if (!fs.existsSync(publicDir)) {
  console.log('创建目录...');
  fs.mkdirSync(publicDir, { recursive: true });
}

// 写入文件
const outputFile = path.resolve(publicDir, 'questions.json');
console.log(`开始写入文件: ${outputFile}`);
fs.writeFileSync(
  outputFile,
  JSON.stringify(questions, null, 2)
);

console.log(`成功生成${questions.length}条Cursor比较相关问题，已保存到 public/questions.json`);