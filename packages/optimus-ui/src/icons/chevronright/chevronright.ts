import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="chevron-right"]',
    standalone: true,
    templateUrl: './chevronrighticon.html'
})
export class ChevronRightIcon extends BaseIcon {}
