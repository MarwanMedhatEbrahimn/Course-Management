import { Injectable } from '@angular/core';
import { Course } from '../models/Course.model';
import { BehaviorSubject } from 'rxjs';
import { SubCourse } from '../models/SubCourse.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private courses: Course[] = [
    {
      id: 1,
      name: 'Frontend Development',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-05-01'),
      subCourses: [
        {
          id: 1,
          name: 'HTML & CSS',
          startDate: new Date('2025-04-01'),
          endDate: new Date('2025-04-10'),
          courseId: 1
        },
        {
          id: 2,
          name: 'JavaScript Basics',
          startDate: new Date('2025-04-11'),
          endDate: new Date('2025-04-20'),
          courseId: 1
        }
      ]
    },
    {
      id: 2,
      name: 'Backend Development',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-07-01'),
      subCourses: [
        {
          id: 1,
          name: 'Node.js',
          startDate: new Date('2025-06-01'),
          endDate: new Date('2025-06-10'),
          courseId: 2
        },
        {
          id: 2,
          name: 'Express.js',
          startDate: new Date('2025-06-11'),
          endDate: new Date('2025-06-20'),
          courseId: 2
        }
      ]
    }
  ];

  constructor() {}

  getCourses(): Course[] {
    return this.courses;
  }

  addCourse(course: { name: string, startDate: Date, endDate: Date }): void {
    this.courses.push({ ...course, subCourses: [], id: this.courses.length + 1});
  }

  updateCourse(updatedCourse: Course): void {
    const index = this.courses.findIndex(c => c.id === updatedCourse.id);
    if (index !== -1) {
      this.courses[index] = { ...updatedCourse };
    }
  }

  deleteCourse(courseId: number): void {
    this.courses = this.courses.filter(c => c.id !== courseId);
  }

  addSubcourse(courseId: number, subcourse: { name: string, startDate: Date, endDate: Date, courseId: number}): void {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.subCourses.push({...subcourse, id:  course.subCourses.length + 1});
    }
  }

  updateSubcourse(courseId: number, updatedSubcourse: SubCourse): void {
    const course = this.courses.find(c => c.id === courseId);

    if (course) {
      const index = course.subCourses.findIndex(sc => sc.id === updatedSubcourse.id);
      if (index !== -1) {
        course.subCourses[index] = { ...updatedSubcourse };
      }
    }
  }

  deleteSubcourse(courseId: number, subcourseId: number): void {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.subCourses = course.subCourses.filter(sc => sc.id !== subcourseId);
    }
  }
}
