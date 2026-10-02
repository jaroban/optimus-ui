import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="times"]',
    standalone: true,
    templateUrl: './timesicon.html'
})
export class TimesIcon extends BaseIcon {}
