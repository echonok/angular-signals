import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { Course } from '../models/course.model';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CoursesService } from '../services/courses.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { firstValueFrom } from 'rxjs';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {

  dialogRef = inject(MatDialogRef);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  coursesService = inject(CoursesService);
  form = this.fb.group({
    title: [''],
    longDescription: [''],
    iconUrl: [''],
  });
  category = signal<CourseCategory>('BEGINNER');

  constructor() {
    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      iconUrl: this.data?.course?.iconUrl,
    });
    this.category.set(this.data?.course?.category ?? 'BEGINNER');
  }

  onClose() {
    this.dialogRef.close();
  }

  async onSave() {
    const courseProps = this.form.value as Partial<Course>;
    courseProps.category = this.category();
    switch (this.data?.mode) {
      case 'update': {
        await this.saveCourse(this.data?.course!.id, courseProps);
        break;
      }
      case 'create': {
        await this.createCourse(courseProps);
        break;
      }
    }
  }

  async createCourse(course: Partial<Course>): Promise<void> {
    try {
      const newCourse = await this.coursesService.createCourse(course);
      this.dialogRef.close(newCourse);
    } catch (err) {
      console.error(err);
      alert('Failed to create the course!');
    }
  }

  async saveCourse(courseId: string, course: Partial<Course>): Promise<void> {
    try {
      const updatedCourse = await this.coursesService.saveCourse(courseId, course);
      this.dialogRef.close(updatedCourse);
    } catch (err) {
      console.error(err);
      alert('Failed to save the course!');
    }
  }
}

export async function openEditCourseDialog(dialog: MatDialog, data: EditCourseDialogData) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;

  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();
  return firstValueFrom(close$);
}
