import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:() => import('./components/course-table/course-table.component').then(c => c.CourseTableComponent),
    }
];
