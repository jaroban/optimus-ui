import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="angle-down"]',
    standalone: true,
    templateUrl: './angledownicon.html'
})
export class AngleDownIcon extends BaseIcon {}
