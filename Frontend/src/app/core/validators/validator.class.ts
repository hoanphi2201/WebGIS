import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class IValidators {
  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }
  static fromToValidator(control: AbstractControl) {
    const period_fromdateYMD: any = control.get('period_fromdateYMD').value;
    const hourFromDate: any = control.get('hourFromDate').value;
    const period_todateYMD: any = control.get('period_todateYMD').value;
    const hourToDate: any = control.get('hourToDate').value;
    if (period_fromdateYMD && period_todateYMD && hourFromDate && hourToDate) {
      const fromDate = new Date(
        period_fromdateYMD.getFullYear(),
        period_fromdateYMD.getMonth(),
        period_fromdateYMD.getDate(),
        hourFromDate.getHours(),
        hourFromDate.getMinutes(),
        hourFromDate.getSeconds()
      );
      const toDate = new Date(
        period_todateYMD.getFullYear(),
        period_todateYMD.getMonth(),
        period_todateYMD.getDate(),
        hourToDate.getHours(),
        hourToDate.getMinutes(),
        hourToDate.getSeconds()
      );
      if (fromDate.getTime() >= toDate.getTime()) {
        control.get('period_fromdateYMD').setErrors({ fromToValidator: true });
        control.get('period_todateYMD').setErrors({ toFromValidator: true });
      } else {
        control.get('period_fromdateYMD').setErrors(null);
        control.get('period_todateYMD').setErrors(null);
      }
    }
  }
  static includeSpaceStringValidator() {
    return function(input: FormControl) {
      if (input.value) {
        for (let t = 0; t < input.value.length; t++) {
          if (' '.indexOf(input.value[t]) >= 0) {
            return { validateIncludeSpaceString: true };
          }
        }
        return null;
      }
      return null;
    };
  }
  static spaceStringValidator() {
    return function(input: FormControl) {
      if (input.value) {
        return input.value.trim() === '' ? { validatespaceString: { valid: false } } : null;
      }
      return null;
    };
  }
  static phoneValidator() {
    return function(input: FormControl) {
      const PHONE_REGEXP = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
      if (input.value) {
        return PHONE_REGEXP.test(input.value) ? null : { validatePhone: { valid: false } };
      }
      return null;
    };
  }
  static emailValidator() {
    return function(input: FormControl) {
      const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if (input.value) {
        return EMAIL_REGEXP.test(input.value) ? null : { validateEmail: { valid: false } };
      }
      return null;
    };
  }
  static multyEmailValidator() {
    return function(input: FormControl) {
      const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if (input.value) {
        let arr_email = input.value.split(';');
        arr_email = arr_email
          .map((inc: any) => {
            return inc.trim();
          })
          .filter((inc: any) => {
            return inc !== '';
          });
        for (let i = 0; i < arr_email.length; i++) {
          if (arr_email.indexOf(arr_email[i]) !== i) {
            return { validateDuplicate: { valid: false } };
          }
        }

        for (let i = 0; i < arr_email.length; i++) {
          if (!EMAIL_REGEXP.test(arr_email[i])) {
            return { validateEmail: { valid: false } };
          }
        }
        return null;
      }
      return null;
    };
  }
  static positiveIntegerValidator() {
    return function(input: FormControl) {
      if (input.value) {
        return Number(input.value) % 1 === 0 ? null : { validatePositiveInteger: { valid: false } };
      }
      return null;
    };
  }
}
