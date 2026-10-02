import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="caret-right"]',
    standalone: true,
    templateUrl: './caretrighticon.html'
})
export class CaretRightIcon extends BaseIcon {}
