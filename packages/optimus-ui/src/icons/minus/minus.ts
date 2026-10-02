import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="minus"]',
    standalone: true,
    templateUrl: './minusicon.html'
})
export class MinusIcon extends BaseIcon {}
