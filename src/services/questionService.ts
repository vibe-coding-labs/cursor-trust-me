import type { Question, QuestionStats } from '../types';

// 本地存储的键名
const STORAGE_KEY = 'cursor-trust-me-stats';

// 从localStorage获取统计数据
export const getStats = (): QuestionStats => {
  const stats = localStorage.getItem(STORAGE_KEY);
  return stats ? JSON.parse(stats) : {};
};

// 保存统计数据到localStorage
export const saveStats = (stats: QuestionStats): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

// 获取问题列表
export const getQuestions = async (): Promise<Question[]> => {
  try {
    // 使用相对路径，这样在任何base URL配置下都能正确工作
    const response = await fetch('./questions.json');
    if (!response.ok) {
      throw new Error('无法加载问题数据');
    }
    return await response.json();
  } catch (error) {
    console.error('获取问题列表出错:', error);
    return [];
  }
};

// 获取带有用户统计数据的问题列表
export const getQuestionsWithStats = async (): Promise<Question[]> => {
  const questions = await getQuestions();
  const stats = getStats();
  
  return questions.map(question => {
    const questionStats = stats[question.id] || { usage: 0, likes: 0, isMarked: false };
    return {
      ...question,
      usageCount: questionStats.usage,
      likeCount: questionStats.likes,
      marked: questionStats.isMarked
    };
  });
};

// 获取随机问题
export const getRandomQuestion = async (): Promise<Question | null> => {
  const questions = await getQuestionsWithStats();
  if (questions.length === 0) {
    return null;
  }
  
  // 过滤掉已标记为不可用的问题
  const availableQuestions = questions.filter(q => !q.marked);
  if (availableQuestions.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
};

// 更新问题统计数据
export const updateQuestionStats = (
  questionId: string,
  update: { usage?: boolean, like?: boolean, mark?: boolean }
): void => {
  const stats = getStats();
  const questionStats = stats[questionId] || { usage: 0, likes: 0, isMarked: false };
  
  if (update.usage) {
    questionStats.usage += 1;
  }
  
  if (update.like) {
    questionStats.likes += 1;
  }
  
  if (update.mark !== undefined) {
    questionStats.isMarked = update.mark;
  }
  
  stats[questionId] = questionStats;
  saveStats(stats);
}; 