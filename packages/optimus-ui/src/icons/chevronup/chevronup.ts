import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="chevron-up"]',
    standalone: true,
    templateUrl: './chevronupicon.html'
})
export class ChevronUpIcon extends BaseIcon {}
