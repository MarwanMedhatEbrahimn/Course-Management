import { NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-errors',
  imports: [
    NgIf
  ],
  templateUrl: './form-errors.component.html',
  styleUrl: './form-errors.component.scss'
})
export class FormErrorsComponent {
  control = input.required<any>();
}
