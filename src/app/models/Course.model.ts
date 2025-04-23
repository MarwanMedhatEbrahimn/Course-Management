import { SubCourse } from "./SubCourse.model";

export interface Course {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    subCourses: SubCourse[];
  }