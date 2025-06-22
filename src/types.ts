export interface Question {
  id: string;
  question: string;
  usageCount: number;
  likeCount: number;
  marked: boolean;
}

export interface QuestionStats {
  [key: string]: {
    usage: number;
    likes: number;
    isMarked: boolean;
  }
} 