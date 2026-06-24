import {
  UserRole,
  SoftwareModule,
  CourseLevel,
  ContentType,
  EnrollmentStatus,
  AttemptStatus,
} from './enums';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnailUrl?: string;
  module: SoftwareModule;
  level: CourseLevel;
  examCode: string;
  price: number;
  isPublished: boolean;
  instructor: User;
  instructorId: string;
  enrollmentCount: number;
  contentItems?: Content[];
  quizzes?: Quiz[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Content {
  id: string;
  courseId: string;
  title: string;
  type: ContentType;
  url: string;
  order: number;
  duration?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  user?: User;
  course?: Course;
  status: EnrollmentStatus;
  progress: number;
  completedItemIds?: string[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  isPublished: boolean;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  imageUrl?: string;
  points: number;
  order: number;
  choices: Choice[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Choice {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface Attempt {
  id: string;
  quizId: string;
  userId: string;
  quiz?: Quiz;
  user?: User;
  answers: AttemptAnswer[];
  score?: number;
  isPassed?: boolean;
  status: AttemptStatus;
  startedAt: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  choiceId: string;
  isCorrect?: boolean;
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  authorId: string;
  author?: User;
  title: string;
  body: string;
  replies?: DiscussionReply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscussionReply {
  id: string;
  threadId: string;
  authorId: string;
  author?: User;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseReport {
  courseId: string;
  courseTitle: string;
  enrollmentCount: number;
  completionRate: number;
  avgScore: number;
}

export interface AdminDashboardStats {
  totalEnrollments: number;
  totalRevenue: number;
  completionRate: number;
  totalUsers: number;
  totalCourses: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
