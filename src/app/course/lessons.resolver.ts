import { ResolveFn } from '@angular/router';
import { Course } from '../models/course.model';
import { inject } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { LessonsService } from '../services/lessons.service';
import { Lesson } from '../models/lesson.model';

export const lessonsResolver: ResolveFn<Lesson[] | null> = async (route, state) => {
  const courseId = route.paramMap.get('courseId');
  if (!courseId) {
    return null;
  }
  const lessonsService = inject(LessonsService);
  return lessonsService.loadLessons({ courseId });
};
