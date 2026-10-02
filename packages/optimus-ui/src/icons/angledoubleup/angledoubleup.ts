import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="angle-double-up"]',
    standalone: true,
    templateUrl: './angledoubleupicon.html'
})
export class AngleDoubleUpIcon extends BaseIcon {}
