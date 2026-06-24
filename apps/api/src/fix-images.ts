import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Course } from './modules/courses/course.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const courseRepo = dataSource.getRepository(Course);

  const courses = await courseRepo.find();
  let updated = 0;

  for (const course of courses) {
    if (course.thumbnailUrl && course.thumbnailUrl.includes('localhost:3000')) {
      course.thumbnailUrl = course.thumbnailUrl.replace(
        'http://localhost:3000',
        'https://najdawi-platform.onrender.com'
      );
      await courseRepo.save(course);
      updated++;
    }
  }

  console.log(`Successfully fixed ${updated} course image URLs!`);
  await app.close();
}
bootstrap();
