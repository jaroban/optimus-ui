import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="calendar"]',
    standalone: true,
    templateUrl: './calendaricon.html'
})
export class CalendarIcon extends BaseIcon {}
