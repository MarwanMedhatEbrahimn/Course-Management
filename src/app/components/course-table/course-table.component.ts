import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/Course.model';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePipe } from '../../pipes/date.pipe';
import { SubCourse } from '../../models/SubCourse.model';

@Component({
  selector: 'app-course-table',
  imports: [
    TableModule,
    DialogModule,
    FormErrorsComponent,
    ReactiveFormsModule,
    DatePickerModule, 
    DatePipe
  ],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.scss'
})
export class CourseTableComponent {
  courses: Course[] = [];
  expandedRows: { [key: string]: boolean } = {};

  visible: boolean = false;
  courseForm!: FormGroup;

  isAdd: boolean = false;

  course?: Course | null;
  subCourse?: SubCourse | null;
  
  maxStartDate?: Date | null = null;
  maxEndDate?: Date | null = null;
  minStartDate?: Date | null = null;
  minEndDate?: Date | null = null;
  courseId?: number | null = null;
  dialogTitle: string = 'Add New Course';
  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courses = this.courseService.getCourses();
    this.expandedRows = this.courses.reduce(
      (acc:any, p:any) => (acc[p.id] = true) && acc, {}
    );
    this.courseForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      startDate: new FormControl(null,[
        Validators.required
      ]),
      endDate: new FormControl(null,[
        Validators.required, 
        this.endDateAfterStartDateValidator(),
      ])
      
    })
  }
  endDateAfterStartDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const endDate = control.value;
      const parent = control.parent;
      if (!parent) return null;
      const startDate = parent.get('startDate')?.value;
      if (!startDate || endDate && new Date(endDate) < new Date(startDate)) {
        return { endBeforeStart: true, invalid: true };
      }
      return null;
    };
  }
  overlapWithSubcoursesValidator(existingSubcourses: SubCourse[], field: 'startDate' | 'endDate', editingId?: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newDate = new Date(control.value).getTime();
      if (isNaN(newDate)) return null;
  
      const hasOverlap = existingSubcourses.some(sub => {
        if (sub.id === editingId) return false;
  
        const subStart = new Date(sub.startDate).getTime();
        const subEnd = new Date(sub.endDate).getTime();
  
        return newDate >= subStart && newDate <= subEnd;
      });
  
      return hasOverlap ? { overlappingDates: true, invalid: true } : null;
    };
  }

  openAddEditCourse(isAdd: boolean, course?: Course){    
    this.reset();
    this.isAdd = isAdd;
    this.course = course;
    this.dialogTitle = isAdd ? "Add New Course":"Edit Course"; 
    if(!isAdd){
      this.courseForm.patchValue({
        ...course
      })
      this.courseForm.get('endDate')?.enable();
    }
    this.visible = true;

  }
  openAddEditSubCourse(isAdd: boolean, course: Course, subCourse?: SubCourse ){
    this.reset();
    this.isAdd = isAdd;
    this.subCourse = subCourse;
    this.dialogTitle = isAdd ? "Add New subcourse":"Edit subcourse"; 

    this.courseId = course?.id;
    this.maxStartDate = course?.endDate;
    this.minStartDate = course?.startDate;
    this.maxEndDate = course?.endDate;
    this.minEndDate = course?.startDate;

    if(!isAdd){
      this.courseForm.patchValue({
        ...subCourse,
      })
      this.courseForm.get('endDate')?.enable();
    }
    this.courseForm.get('startDate')?.setValidators([
      Validators.required,
      this.overlapWithSubcoursesValidator(course?.subCourses, 'startDate', subCourse?.id)
    ]);
  
    this.courseForm.get('endDate')?.setValidators([
      Validators.required,
      this.endDateAfterStartDateValidator(),
      this.overlapWithSubcoursesValidator(course?.subCourses, 'endDate', subCourse?.id)
    ]);
    this.visible = true;
  }

  submit(){
    if(this.courseForm.invalid){
      this.courseForm.markAllAsTouched()
      return;
    }
    let course!: { name: string, startDate: Date, endDate: Date }; 
    course = {
      ...this.courseForm.value
    }
    console.log(this.isAdd , this.subCourse , this.courseId)
    if(this.isAdd  && !this.courseId){
      this.courseService.addCourse(course);
    }
    else if(this.isAdd && this.courseId){
      this.courseService.addSubcourse(this.courseId, {...course, courseId: this.courseId});
    }
    else if(!this.isAdd && this.course){
      this.courseService.updateCourse({...course, id : this.course.id, subCourses:this.course.subCourses});
    }
    else if(!this.isAdd && this.subCourse && this.courseId){
      this.courseService.updateSubcourse(this.courseId,{...course, id: this.subCourse.id, courseId : this.courseId});
    }
    this.courses = this.courseService.getCourses();
    this.expandedRows = this.courses.reduce(
      (acc:any, p:any) => (acc[p.id] = true) && acc, {}
    );
    this.reset();
  }

  reset(){
    this.courseForm.reset();
    this.courseForm.get('startDate')?.setValidators([
      Validators.required,
    ]);
    this.courseForm.get('endDate')?.setValidators([
      Validators.required,
      this.endDateAfterStartDateValidator(),
    ]);
    this.courseForm.get('endDate')?.disable();
    this.courseId = null;
    this.subCourse = null;
    this.course = null;
    this.visible = false;
    this.maxStartDate = null;
    this.minStartDate = null;
    this.maxEndDate = null;
    this.minEndDate = null;
  }

  onChangeStartDate(){
    this.minEndDate = this.courseForm.value.startDate;
    this.courseForm.get('endDate')?.updateValueAndValidity();
    this.courseForm.get('endDate')?.enable();
  }
  
}
