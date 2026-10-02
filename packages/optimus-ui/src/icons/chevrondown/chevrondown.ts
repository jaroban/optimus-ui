import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="chevron-down"]',
    standalone: true,
    templateUrl: './chevrondownicon.html'
})
export class ChevronDownIcon extends BaseIcon {}
