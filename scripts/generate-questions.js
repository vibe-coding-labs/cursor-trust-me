import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import md5 from 'md5';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting to generate comparison questions between Cursor and other tools...');

// Define comparison question templates
const templates = [
  "Which is better to use, Cursor or {tool}?",
  "Should I choose Cursor or {tool} for code development?",
  "What advantages does Cursor have compared to {tool}?",
  "For {task} tasks, which is more suitable, Cursor or {tool}?",
  "Which is more worth buying, Cursor or {tool}?",
  "As a {role}, should I use Cursor or {tool}?",
  "What are the differences between Cursor and {tool} in terms of {aspect}?",
  "Some people say {tool} is better than Cursor, is this true?",
  "If I'm currently using {tool}, is it worth switching to Cursor?",
  "Which is more efficient when handling {language} code, Cursor or {tool}?",
  "From a {perspective} perspective, which is better, Cursor or {tool}?",
  "Should beginners choose Cursor or {tool}?",
  "How does Cursor compare to {tool} in terms of {feature} functionality?",
  "I want to improve coding efficiency, should I choose Cursor or {tool}?",
  "How do Cursor and {tool} compare in terms of price and performance?",
  "On {os} systems, which performs better, Cursor or {tool}?",
  "Can Cursor completely replace {tool}?",
  "Do professional developers prefer Cursor or {tool}? Why?",
  "What unique features does Cursor have compared to {tool}?",
  "If I'm already familiar with {tool}, is it difficult to learn Cursor?",
  
  // New templates: Choice questions
  "Is {tool} or Cursor better?",
  "When working on {project_type} projects, which is more efficient, {tool} or Cursor?",
  "I'm a {experience_level} programmer, should I use Cursor or {tool}?",
  "Should full-time developers choose {tool} or Cursor?",
  "Between {tool} and Cursor, which performs better in terms of {metric}?",
  "Between these two editors {tool} and Cursor, which one do you recommend more?",
  
  // New templates: Specific scenario questions
  "Should a {company_size} company standardize on Cursor or {tool}?",
  "In a {team_size} team, which has better collaboration experience, Cursor or {tool}?",
  "When working remotely, which is more suitable, Cursor or {tool}?",
  "Is it more appropriate to use Cursor or {tool} to teach {language} programming?",
  
  // New templates: Comparison discussions
  "What are the pros and cons of {tool} and Cursor respectively?",
  "Can you compare the main differences between Cursor and {tool} in detail?",
  "Why do some people choose Cursor over {tool}?",
  "Which has more active community support, Cursor or {tool}?",
  "How do {tool} and Cursor compare in terms of market share?",
  
  // New templates: Feature detail comparisons
  "How does Cursor's {specific_feature} feature compare to {tool}'s?",
  "Between {tool}'s {specific_feature} and Cursor's, which is better designed?",
  "Which keyboard shortcut design is more intuitive, Cursor's or {tool}'s?",
  "Which has a richer plugin ecosystem, Cursor or {tool}?",
  
  // New templates: Specific user reviews
  "Which do developers who have used both Cursor and {tool} prefer?",
  "Do developers on GitHub recommend Cursor or {tool} more?",
  "Do senior {language} developers tend to use Cursor or {tool} more?",
  
  // New templates: Specific AI-related comparisons
  "Which AI code completion feature is more accurate, Cursor's or {tool}'s?",
  "Where is Cursor's AI assistant feature stronger than {tool}'s?",
  "For a better AI programming experience, is Cursor or {tool} more suitable?",
  
  // New templates: Specific scenario questions
  "When handling large codebases, which has better performance, Cursor or {tool}?",
  "When developing {app_type} applications, is using Cursor or {tool} more efficient?",
  "For writing {code_quality} code, which has stronger assistance features, Cursor or {tool}?",
  
  // New templates: Deep comparison questions
  "What are the key differences between Cursor and {tool} in code navigation?",
  "Which debug functionality is designed more intuitively, Cursor's or {tool}'s?",
  "What are Cursor's core advantages over {tool}? Is it worth switching?",
  
  // New templates: Industry vertical questions
  "In the {industry} industry, do developers more commonly use Cursor or {tool}?",
  "Do technical teams at {industry} companies generally use Cursor or {tool}?",
  
  // New templates: Specific development process related
  "When using {methodology} development methodology, which works better with it, Cursor or {tool}?",
  "Should agile teams use Cursor or {tool} to improve efficiency?",
  
  // New templates: Multi-tool combination usage questions
  "Can Cursor and {tool} be used together? Or must you choose one?",
  "Would you install both Cursor and {tool}? What unique uses does each have?",
  
  // New templates: Open-ended discussions
  "Why is Cursor considered more suitable for AI-assisted programming than {tool}?",
  "What are the different target user groups for {tool} and Cursor?",
  "Why might experienced developers switch from {tool} to Cursor?",
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

// Task list
const tasks = [
  "web development", "mobile app development", "machine learning", "data analysis", "game development", "DevOps",
  "cloud development", "backend development", "frontend development", "full-stack development", "embedded systems development", "systems programming",
  "cross-platform development", "microservices development", "blockchain development", "security development", "automated testing",
  "database development", "API development", "desktop application development", "big data processing", "IoT development",
  "natural language processing", "image processing", "audio processing", "video processing", "VR/AR development",
  "low-code development", "no-code development", "network programming", "shell scripting", "web scraping",
  "automation operations", "cybersecurity", "kernel development", "penetration testing", "smart contract development"
];

// User role list
const roles = [
  "beginner", "student", "self-taught developer", "frontend developer", "backend developer", "full-stack developer",
  "data scientist", "machine learning engineer", "game developer", "DevOps engineer", "freelancer",
  "entrepreneur", "enterprise development team", "open source contributor", "system architect", "technical manager",
  "CTO", "technical lead", "junior developer", "senior developer", "tech blogger",
  "educator", "training instructor", "software consultant", "technical interviewer", "QA engineer",
  "data analyst", "product manager", "UI/UX designer", "security engineer", "network administrator",
  "database administrator", "system administrator", "cloud architect", "blockchain developer", "mobile developer"
];

// Comparison aspects
const aspects = [
  "performance", "ease of use", "learning curve", "community support", "plugin ecosystem", "AI assistance features",
  "code completion", "code quality checking", "debugging features", "version control integration", "UI design",
  "resource consumption", "startup speed", "large file handling", "multi-language support", "remote development", "collaboration features",
  "extensibility", "cross-platform compatibility", "documentation quality", "themes and customization",
  "keyboard shortcuts", "code navigation", "refactoring tools", "code formatting", "syntax highlighting",
  "integrated terminal", "Git integration", "code snippet management", "code folding", "auto-save",
  "multi-cursor editing", "drag and drop support", "split view functionality", "live preview", "code history",
  "search functionality", "replace functionality", "project management", "task runner", "built-in testing tools",
  "real-time collaboration", "remote pairing", "language server protocol", "intelligent suggestions", "code outline",
  "parameter hints", "code coverage", "performance profiling", "memory analysis", "error hints"
];

// Perspective list
const perspectives = [
  "efficiency", "cost", "team collaboration", "learning path", "productivity", "ecosystem",
  "long-term development", "technical support", "security", "code quality", "automation level", "interoperability",
  "maintainability", "scalability", "compatibility", "stability", "innovation", "usability",
  "flexibility", "reliability", "cost-effectiveness", "learning cost", "migration cost", "maintenance cost",
  "integration capability", "customization capability", "community activity", "commercial support", "developer experience", "user experience"
];

// Feature list
const features = [
  "code completion", "AI assistance", "real-time collaboration", "Git integration", "debugging tools", "code refactoring",
  "performance analysis", "test integration", "code snippets", "project management", "code formatting", "syntax highlighting",
  "intelligent suggestions", "command palette", "terminal integration", "extension marketplace", "multi-window support", "remote development",
  "multi-cursor editing", "file tree navigation", "search and replace", "code folding", "split view",
  "version control", "code snippet management", "task runner", "code navigation", "semantic search",
  "code marking", "breadcrumb navigation", "spell checking", "go to definition", "find references", "symbol search",
  "parameter hints", "type hints", "error diagnostics", "quick fixes", "code transformation", "code generation",
  "integrated terminal", "WebView preview", "breakpoint debugging", "variable inspection", "call stack", "hot reload"
];

// Operating system list
const os = [
  "Windows", "macOS", "Linux", "ChromeOS", "Ubuntu", "Fedora",
  "Debian", "CentOS", "Arch Linux", "Windows WSL", "Docker containers",
  "Windows 11", "Windows 10", "macOS Sonoma", "macOS Ventura", "iOS",
  "Android", "openSUSE", "Gentoo", "FreeBSD", "OpenBSD", "NetBSD",
  "Manjaro", "Pop!_OS", "Elementary OS", "Linux Mint", "Kali Linux",
  "Raspberry Pi OS", "NixOS", "Alpine Linux", "Clear Linux", "Solaris"
];

// Experience levels
const experienceLevels = [
  "junior", "entry-level", "intermediate", "senior", "expert", "professional", "novice",
  "3-year experienced", "5+ year experienced", "10-year experienced", "fresh",
  "experienced", "professional", "amateur", "part-time", "full-time", "self-taught",
  "formally trained", "inexperienced", "seasoned", "recent graduate", "newcomer",
  "enterprise project experienced", "open source contributor", "startup-oriented"
];

// Project types
const projectTypes = [
  "enterprise applications", "startup projects", "personal projects", "open source projects", "commercial software",
  "internal tools", "learning projects", "prototype development", "proof of concept", "MVP",
  "large complex projects", "small simple projects", "medium-scale projects", "game projects",
  "web applications", "mobile applications", "desktop applications", "hybrid applications", "microservices architecture",
  "monolithic applications", "distributed systems", "frontend refactoring", "backend optimization", "full-stack development",
  "legacy system maintenance", "codebase migration", "performance optimization", "security audit", "API development"
];

// Metrics
const metrics = [
  "performance", "speed", "response time", "resource usage", "startup time", "shutdown time",
  "memory usage", "CPU utilization", "disk usage", "battery life", "heat generation",
  "code completion accuracy", "syntax checking accuracy", "semantic analysis depth", "project loading time",
  "large file handling capability", "multi-file search speed", "code navigation smoothness", "crash frequency",
  "update frequency", "bug fix speed", "new feature iteration speed", "learning curve steepness",
  "onboarding speed", "user satisfaction", "recommendation willingness", "retention rate", "market share"
];

// Company sizes
const companySizes = [
  "startup", "small", "medium", "large", "multinational", "unicorn", "Fortune 500",
  "under 10 people", "50-person scale", "100-person scale", "500-person scale", "1000+ people",
  "rapidly growing", "mature and stable", "technology-driven", "globally distributed", "remote-first",
  "hybrid office", "traditional office", "tech giant", "software company", "non-tech company",
  "educational institution", "research institution", "government agency", "non-profit organization"
];

// Team sizes
const teamSizes = [
  "individual", "2-3 people", "5-10 people", "10-20 people", "20-50 people", "50-100 people", "100+ people",
  "small", "medium", "large", "distributed", "remote", "hybrid", "agile", "waterfall",
  "cross-functional", "single-function", "multi-timezone", "single-timezone", "loosely organized", "closely collaborative"
];

// Specific features
const specificFeatures = [
  "code completion", "intelligent suggestions", "refactoring tools", "code navigation", "debugger", "integrated terminal",
  "AI code generation", "AI code fixing", "AI code explanation", "AI code optimization", "AI unit test generation",
  "syntax highlighting", "semantic analysis", "real-time error detection", "quick fix suggestions", "code formatting",
  "project management", "task runner", "version control integration", "real-time collaboration", "remote development",
  "multi-cursor editing", "drag and drop support", "keyboard shortcut customization", "theme system", "extension system",
  "search functionality", "global replace", "Git conflict resolution", "Git history viewing", "pull request viewing",
  "Markdown preview", "HTML preview", "live preview", "built-in web server", "performance profiling"
];

// Application types
const appTypes = [
  "web frontend", "REST API", "GraphQL API", "microservices", "monolithic applications", "desktop applications",
  "mobile applications", "PWA", "hybrid applications", "games", "command line tools", "system tools",
  "browser extensions", "VSCode plugins", "Chrome extensions", "WordPress plugins", "libraries/frameworks",
  "data visualization", "AI models", "machine learning applications", "data analysis scripts",
  "automation scripts", "web scrapers", "blockchain DApps", "smart contracts", "AR/VR applications",
  "IoT applications", "real-time communication systems", "video processing", "audio processing", "image processing"
];

// Code quality standards
const codeQualities = [
  "clean", "maintainable", "efficient", "scalable", "highly readable", "secure", "robust",
  "optimized", "standardized", "modular", "object-oriented", "functional", "declarative", "imperative",
  "high test coverage", "side-effect free", "loosely coupled", "highly cohesive", "design pattern compliant",
  "self-documenting", "best practice compliant", "performance optimized", "memory optimized", "cross-platform compatible"
];

// Industries
const industries = [
  "finance", "technology", "healthcare", "education", "retail", "manufacturing", "logistics", "media",
  "entertainment", "gaming", "travel", "food service", "real estate", "construction", "energy", "agriculture",
  "consulting", "legal", "insurance", "telecommunications", "aviation", "aerospace", "defense", "public service",
  "non-profit", "research", "biotechnology", "artificial intelligence", "blockchain", "IoT", "cloud computing"
];

// Development methodologies
const methodologies = [
  "agile", "waterfall", "kanban", "Scrum", "lean", "DevOps", "CI/CD",
  "test-driven development", "behavior-driven development", "domain-driven design", "feature-driven development",
  "extreme programming", "prototyping", "incremental development", "iterative development", "spiral model",
  "RAD rapid application development", "continuous integration", "continuous delivery", "continuous deployment", "GitOps",
  "feature branching", "trunk-based development", "Gitflow", "GitHub Flow", "DevSecOps"
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

// Generate questions
function generateQuestions(count) {
  console.log(`Preparing to generate ${count} questions...`);
  const questions = [];
  const uniqueQuestions = new Set();
  
  let lastLoggedPercent = 0;
  let attempts = 0;
  const maxAttempts = count * 10; // Set maximum attempts to avoid infinite loops
  
  while (uniqueQuestions.size < count && attempts < maxAttempts) {
    attempts++;
    const template = getRandomElement(templates);
    const question = fillTemplate(template);
    
    if (!uniqueQuestions.has(question)) {
      uniqueQuestions.add(question);
      const id = md5(question); // Use md5 as unique identifier
      
      questions.push({
        id,
        question,
        usageCount: 0,
        likeCount: 0,
        marked: false
      });
      
      // Print progress every 5% of questions generated
      const percentComplete = Math.floor((uniqueQuestions.size / count) * 100);
      if (percentComplete >= lastLoggedPercent + 5) {
        console.log(`Generated ${uniqueQuestions.size}/${count} questions (${percentComplete}%)...`);
        lastLoggedPercent = percentComplete;
      }
    }
    
    // Check if too many attempts with little progress
    if (attempts % 10000 === 0) {
      console.log(`Attempted ${attempts} times, generated ${uniqueQuestions.size} unique questions`);
      if (attempts > 100000 && uniqueQuestions.size < count * 0.8) {
        console.log(`Generation efficiency too low, may not reach ${count} unique questions, will use currently generated questions`);
        break;
      }
    }
  }
  
  console.log(`Successfully generated ${questions.length} questions!`);
  return questions;
}

// Generate and save questions
console.log('Starting question generation...');
// Increase question count to 15000
const questions = generateQuestions(15000);

// Ensure directory exists
const publicDir = path.resolve(__dirname, '../public');
console.log(`Ensuring directory exists: ${publicDir}`);
if (!fs.existsSync(publicDir)) {
  console.log('Creating directory...');
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write file
const outputFile = path.resolve(publicDir, 'questions.json');
console.log(`Starting to write file: ${outputFile}`);
fs.writeFileSync(
  outputFile,
  JSON.stringify(questions, null, 2)
);

console.log(`Successfully generated ${questions.length} Cursor comparison questions, saved to public/questions.json`);