export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}

export enum SoftwareModule {
  WORD = 'word',
  EXCEL = 'excel',
  POWERPOINT = 'powerpoint',
  ACCESS = 'access',
  OUTLOOK = 'outlook',
  ONENOTE = 'onenote',
  TEAMS = 'teams',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum ContentType {
  VIDEO = 'video',
  PDF = 'pdf',
  LINK = 'link',
  LAB = 'lab',
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

export enum QuizStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export enum AttemptStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
}
