import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="check"]',
    standalone: true,
    templateUrl: './checkicon.html'
})
export class CheckIcon extends BaseIcon {}
