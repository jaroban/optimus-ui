import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="angle-up"]',
    standalone: true,
    templateUrl: './angleupicon.html'
})
export class AngleUpIcon extends BaseIcon {}
