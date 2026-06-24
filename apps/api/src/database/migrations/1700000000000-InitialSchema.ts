import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users
    await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'instructor', 'student')
    `);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'student',
        "avatarUrl" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "refreshToken" character varying,
        "googleId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Courses
    await queryRunner.query(`
      CREATE TYPE "public"."courses_module_enum" AS ENUM(
        'word','excel','powerpoint','access','outlook','onenote','teams'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."courses_level_enum" AS ENUM(
        'beginner','intermediate','advanced','expert'
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "courses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "shortDescription" character varying NOT NULL,
        "thumbnailUrl" character varying,
        "module" "public"."courses_module_enum" NOT NULL,
        "level" "public"."courses_level_enum" NOT NULL,
        "examCode" character varying NOT NULL,
        "price" numeric(10,2) NOT NULL DEFAULT 0,
        "isPublished" boolean NOT NULL DEFAULT false,
        "instructorId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_courses" PRIMARY KEY ("id"),
        CONSTRAINT "FK_courses_instructor" FOREIGN KEY ("instructorId") REFERENCES "users"("id")
      )
    `);

    // Content Items
    await queryRunner.query(`
      CREATE TYPE "public"."content_items_type_enum" AS ENUM('video','pdf','link','lab')
    `);
    await queryRunner.query(`
      CREATE TABLE "content_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "courseId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "type" "public"."content_items_type_enum" NOT NULL,
        "url" character varying NOT NULL,
        "order" integer NOT NULL DEFAULT 0,
        "duration" integer,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_content_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_content_items_course" FOREIGN KEY ("courseId")
          REFERENCES "courses"("id") ON DELETE CASCADE
      )
    `);

    // Enrollments
    await queryRunner.query(`
      CREATE TYPE "public"."enrollments_status_enum" AS ENUM('active','completed','dropped')
    `);
    await queryRunner.query(`
      CREATE TABLE "enrollments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "courseId" uuid NOT NULL,
        "status" "public"."enrollments_status_enum" NOT NULL DEFAULT 'active',
        "progress" float NOT NULL DEFAULT 0,
        "completedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_enrollments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_enrollments_user" FOREIGN KEY ("userId") REFERENCES "users"("id"),
        CONSTRAINT "FK_enrollments_course" FOREIGN KEY ("courseId") REFERENCES "courses"("id")
      )
    `);

    // Quizzes
    await queryRunner.query(`
      CREATE TABLE "quizzes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "courseId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "description" text,
        "passingScore" integer NOT NULL DEFAULT 70,
        "timeLimit" integer,
        "isPublished" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_quizzes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_quizzes_course" FOREIGN KEY ("courseId")
          REFERENCES "courses"("id") ON DELETE CASCADE
      )
    `);

    // Questions
    await queryRunner.query(`
      CREATE TABLE "questions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quizId" uuid NOT NULL,
        "text" text NOT NULL,
        "imageUrl" character varying,
        "points" integer NOT NULL DEFAULT 1,
        "order" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_questions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_questions_quiz" FOREIGN KEY ("quizId")
          REFERENCES "quizzes"("id") ON DELETE CASCADE
      )
    `);

    // Choices
    await queryRunner.query(`
      CREATE TABLE "choices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "questionId" uuid NOT NULL,
        "text" character varying NOT NULL,
        "isCorrect" boolean NOT NULL DEFAULT false,
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_choices" PRIMARY KEY ("id"),
        CONSTRAINT "FK_choices_question" FOREIGN KEY ("questionId")
          REFERENCES "questions"("id") ON DELETE CASCADE
      )
    `);

    // Attempts
    await queryRunner.query(`
      CREATE TYPE "public"."attempts_status_enum" AS ENUM('in_progress','submitted','graded')
    `);
    await queryRunner.query(`
      CREATE TABLE "attempts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quizId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "score" float,
        "isPassed" boolean,
        "status" "public"."attempts_status_enum" NOT NULL DEFAULT 'in_progress',
        "startedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "submittedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_attempts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_attempts_quiz" FOREIGN KEY ("quizId")
          REFERENCES "quizzes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_attempts_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);

    // Attempt Answers
    await queryRunner.query(`
      CREATE TABLE "attempt_answers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "attemptId" uuid NOT NULL,
        "questionId" uuid NOT NULL,
        "choiceId" uuid NOT NULL,
        "isCorrect" boolean,
        CONSTRAINT "PK_attempt_answers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_attempt_answers_attempt" FOREIGN KEY ("attemptId")
          REFERENCES "attempts"("id") ON DELETE CASCADE
      )
    `);

    // Discussion Threads
    await queryRunner.query(`
      CREATE TABLE "discussion_threads" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "courseId" uuid NOT NULL,
        "authorId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "body" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_discussion_threads" PRIMARY KEY ("id"),
        CONSTRAINT "FK_discussion_threads_course" FOREIGN KEY ("courseId") REFERENCES "courses"("id"),
        CONSTRAINT "FK_discussion_threads_author" FOREIGN KEY ("authorId") REFERENCES "users"("id")
      )
    `);

    // Discussion Replies
    await queryRunner.query(`
      CREATE TABLE "discussion_replies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "threadId" uuid NOT NULL,
        "authorId" uuid NOT NULL,
        "body" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_discussion_replies" PRIMARY KEY ("id"),
        CONSTRAINT "FK_discussion_replies_thread" FOREIGN KEY ("threadId")
          REFERENCES "discussion_threads"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_discussion_replies_author" FOREIGN KEY ("authorId") REFERENCES "users"("id")
      )
    `);

    // Extension for uuid
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "discussion_replies"`);
    await queryRunner.query(`DROP TABLE "discussion_threads"`);
    await queryRunner.query(`DROP TABLE "attempt_answers"`);
    await queryRunner.query(`DROP TABLE "attempts"`);
    await queryRunner.query(`DROP TYPE "public"."attempts_status_enum"`);
    await queryRunner.query(`DROP TABLE "choices"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "quizzes"`);
    await queryRunner.query(`DROP TABLE "enrollments"`);
    await queryRunner.query(`DROP TYPE "public"."enrollments_status_enum"`);
    await queryRunner.query(`DROP TABLE "content_items"`);
    await queryRunner.query(`DROP TYPE "public"."content_items_type_enum"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TYPE "public"."courses_level_enum"`);
    await queryRunner.query(`DROP TYPE "public"."courses_module_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
