import { useState, useEffect } from 'react';
import type { Question } from '../types';
import * as questionService from '../services/questionService';

const RandomQuestion = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  
  // 加载随机问题
  const loadRandomQuestion = async () => {
    try {
      setLoading(true);
      setCopied(false);
      setError(null);
      setFadeIn(false);
      
      const randomQuestion = await questionService.getRandomQuestion();
      
      if (randomQuestion) {
        setQuestion(randomQuestion);
        // 添加淡入效果
        setTimeout(() => setFadeIn(true), 50);
      } else {
        setError('没有可用的问题，请尝试取消过滤或添加更多问题');
      }
    } catch (error) {
      console.error('获取随机问题失败:', error);
      setError('获取随机问题失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    loadRandomQuestion();
  }, []);
  
  // 复制问题到剪贴板
  const handleCopyQuestion = () => {
    if (!question) return;
    
    navigator.clipboard.writeText(question.question)
      .then(() => {
        setCopied(true);
        questionService.updateQuestionStats(question.id, { usage: true });
        
        // 更新本地状态以显示使用计数增加
        setQuestion(prev => prev ? {...prev, usageCount: prev.usageCount + 1} : null);
        
        // 2秒后重置复制状态
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('复制失败:', err);
        setError('复制失败，请重试');
        setTimeout(() => setError(null), 3000);
      });
  };
  
  // 标记问题为好用
  const handleLikeQuestion = () => {
    if (!question) return;
    
    questionService.updateQuestionStats(question.id, { like: true });
    // 更新本地状态
    setQuestion(prev => prev ? {...prev, likeCount: prev.likeCount + 1} : null);
  };
  
  // 标记问题为不可用
  const handleMarkQuestion = () => {
    if (!question) return;
    
    const newMarkedValue = !question.marked;
    questionService.updateQuestionStats(question.id, { mark: newMarkedValue });
    // 更新本地状态
    setQuestion(prev => prev ? {...prev, marked: newMarkedValue} : null);
  };
  
  if (loading) {
    return <div className="loading">正在获取随机问题...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadRandomQuestion}>重试</button>
      </div>
    );
  }
  
  if (!question) {
    return (
      <div className="random-question-container">
        <div className="empty-state">
          <p>没有找到可用的问题</p>
          <button 
            className="refresh-btn"
            onClick={loadRandomQuestion}
          >
            重试
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="random-question-container">
      <div className={`question-card ${question.marked ? 'marked' : ''} ${fadeIn ? 'fade-in' : ''}`}>
        <h2>随机问题</h2>
        
        <p className="question-text">{question.question}</p>
        
        <div className="question-stats">
          <span className="usage-count">使用: {question.usageCount}</span>
          <span className="like-count">点赞: {question.likeCount}</span>
        </div>
        
        <div className="question-actions">
          <button 
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyQuestion}
          >
            {copied ? '已复制!' : '复制问题'}
          </button>
          
          <button 
            className="like-btn"
            onClick={handleLikeQuestion}
            title="这个问题很好用"
          >
            👍 好用
          </button>
          
          <button 
            className={`mark-btn ${question.marked ? 'marked' : ''}`}
            onClick={handleMarkQuestion}
          >
            {question.marked ? '恢复可用' : '标记为不可用'}
          </button>
        </div>
      </div>
      
      <button 
        className="next-btn"
        onClick={loadRandomQuestion}
      >
        下一个随机问题
      </button>
    </div>
  );
};

export default RandomQuestion;