import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="angle-left"]',
    standalone: true,
    templateUrl: './anglelefticon.html'
})
export class AngleLeftIcon extends BaseIcon {}
