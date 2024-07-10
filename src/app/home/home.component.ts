import { Component, computed, inject, signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';

import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]);
  private coursesService = inject(CoursesService);
  dialog = inject(MatDialog);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  constructor() {
    this.loadCourses();
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      alert('Error loading courses!');
      console.error(err);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    this.#courses.update((courses) => courses.map((course) => {
      return course.id === updatedCourse.id ? updatedCourse : course;
    }));
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      this.#courses.update((courses) => courses.filter((course) => course.id !== courseId));
    } catch (err) {
      alert('Error deleting courses!');
      console.error(err);
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, { mode: 'create', title: 'Create new course' });
    this.#courses.update((courses) => [...courses, newCourse]);
  }
}
