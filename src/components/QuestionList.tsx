import { useState, useEffect } from 'react';
import type { Question } from '../types';
import * as questionService from '../services/questionService';
import Select from 'react-select';

// 排序选项
const sortOptions = [
  { value: 'newest', label: '最新' },
  { value: 'popular', label: '最常用' },
  { value: 'liked', label: '最受好评' }
];

// 自定义样式
const selectStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: '6px',
    borderColor: '#e5e7eb',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#4f46e5',
    },
    minWidth: '150px',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#f3f4f6' : undefined,
    '&:active': {
      backgroundColor: '#4338ca',
    },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '6px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  }),
};

const QuestionList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showMarked, setShowMarked] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'liked'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 100;
  
  // 加载问题列表
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await questionService.getQuestionsWithStats();
        setQuestions(data);
        setFilteredQuestions(data);
      } catch (error) {
        console.error('加载问题失败:', error);
        setError('加载问题失败，请重试');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, []);
  
  // 过滤和排序问题
  useEffect(() => {
    let filtered = questions;
    
    // 按搜索关键词过滤
    if (filter) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    // 按标记状态过滤
    if (!showMarked) {
      filtered = filtered.filter(q => !q.marked);
    }
    
    // 排序
    const sorted = [...filtered];
    switch (sortBy) {
      case 'popular':
        sorted.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'liked':
        sorted.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'newest':
      default:
        // 假设最新的在前面，这里不做额外排序
        break;
    }
    
    setFilteredQuestions(sorted);
    // 重置为第一页
    setCurrentPage(1);
  }, [filter, showMarked, questions, sortBy]);
  
  // 复制问题到剪贴板并更新统计
  const handleCopyQuestion = (question: Question) => {
    navigator.clipboard.writeText(question.question)
      .then(() => {
        questionService.updateQuestionStats(question.id, { usage: true });
        
        // 更新本地状态
        setQuestions(prevQuestions => 
          prevQuestions.map(q => 
            q.id === question.id ? { ...q, usageCount: q.usageCount + 1 } : q
          )
        );
        
        // 显示复制成功的反馈
        setCopiedId(question.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(err => {
        console.error('复制失败:', err);
        setError('复制失败，请重试');
        setTimeout(() => setError(null), 3000);
      });
  };
  
  // 点赞问题并更新统计
  const handleLikeQuestion = (question: Question) => {
    questionService.updateQuestionStats(question.id, { like: true });
    
    // 更新本地状态
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.id === question.id ? { ...q, likeCount: q.likeCount + 1 } : q
      )
    );
  };
  
  // 标记问题可用性并更新统计
  const handleMarkQuestion = (question: Question) => {
    const newMarkedValue = !question.marked;
    questionService.updateQuestionStats(question.id, { mark: newMarkedValue });
    
    // 更新本地状态
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.id === question.id ? { ...q, marked: newMarkedValue } : q
      )
    );
  };
  
  // 获取当前页的问题
  const getCurrentPageQuestions = () => {
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    return filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  };
  
  // 计算总页数
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  
  // 页码变更处理
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 生成页码按钮
  const renderPaginationButtons = () => {
    const buttons = [];
    
    // 添加"上一页"按钮
    buttons.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn prev-btn"
      >
        上一页
      </button>
    );
    
    // 显示页码逻辑（当页数较多时，显示首页、尾页和当前页附近的页码）
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // 调整起始页，确保显示正确数量的页码
    if (endPage - startPage + 1 < maxPagesToShow && startPage > 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // 显示首页
    if (startPage > 1) {
      buttons.push(
        <button 
          key={1} 
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      
      // 显示省略号
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }
    
    // 显示中间页码
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    // 显示尾页
    if (endPage < totalPages) {
      // 显示省略号
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      
      buttons.push(
        <button 
          key={totalPages} 
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }
    
    // 添加"下一页"按钮
    buttons.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn next-btn"
      >
        下一页
      </button>
    );
    
    return buttons;
  };
  
  // 处理排序变更
  const handleSortChange = (selectedOption: any) => {
    if (selectedOption) {
      setSortBy(selectedOption.value);
    }
  };
  
  if (loading) {
    return <div className="loading">加载中...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>重试</button>
      </div>
    );
  }
  
  // 获取当前页的问题
  const currentQuestions = getCurrentPageQuestions();
  
  return (
    <div className="question-list-container">
      <div className="filter-container">
        <input
          type="text"
          placeholder="搜索问题..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="search-input"
        />
        
        <div className="filter-options">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showMarked}
              onChange={() => setShowMarked(!showMarked)}
            />
            显示标记为不可用的问题
          </label>
          
          <div className="sort-options">
            <span>排序: </span>
            <Select
              options={sortOptions}
              defaultValue={sortOptions[0]}
              onChange={handleSortChange}
              styles={selectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable={false}
              aria-label="排序方式"
            />
          </div>
        </div>
      </div>
      
      <div className="list-stats">
        找到 {filteredQuestions.length} 个问题
        {filter && <span>（搜索: "{filter}"）</span>}
        {filteredQuestions.length > 0 && (
          <span className="page-info">
            当前显示: 第 {currentPage} 页，共 {totalPages} 页
          </span>
        )}
      </div>
      
      {filteredQuestions.length === 0 ? (
        <div className="no-results">
          <p>没有找到匹配的问题</p>
          {filter && (
            <button onClick={() => setFilter('')} className="clear-filter-btn">
              清除搜索
            </button>
          )}
        </div>
      ) : (
        <>
          <ul className="question-list">
            {currentQuestions.map(question => (
              <li 
                key={question.id} 
                className={`question-item ${question.marked ? 'marked' : ''}`}
              >
                <div className="question-content">
                  <p className="question-text">{question.question}</p>
                  <div className="question-stats">
                    <span className="usage-count">使用: {question.usageCount}</span>
                    <span className="like-count">点赞: {question.likeCount}</span>
                  </div>
                </div>
                
                <div className="question-actions">
                  <button 
                    className={`copy-btn ${copiedId === question.id ? 'copied' : ''}`}
                    onClick={() => handleCopyQuestion(question)}
                    title="复制到剪贴板"
                  >
                    {copiedId === question.id ? '已复制!' : '复制'}
                  </button>
                  
                  <button 
                    className="like-btn" 
                    onClick={() => handleLikeQuestion(question)}
                    title="这个问题很好用"
                  >
                    👍
                  </button>
                  
                  <button 
                    className={`mark-btn ${question.marked ? 'marked' : ''}`} 
                    onClick={() => handleMarkQuestion(question)}
                    title={question.marked ? "标记为可用" : "标记为不可用"}
                  >
                    {question.marked ? "恢复" : "标记"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="pagination-container">
              {renderPaginationButtons()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionList;