import {Injectable, Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'DateTimeFormat'
})

export class DateTimeFormat implements PipeTransform {
    transform(value: any, args?: string) {
      return moment(value).tz('Asia/Calcutta').format('DD/MM/YYYY hh:mm');
    }
}