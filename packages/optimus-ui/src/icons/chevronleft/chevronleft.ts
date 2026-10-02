import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="chevron-left"]',
    standalone: true,
    templateUrl: './chevronlefticon.html'
})
export class ChevronLeftIcon extends BaseIcon {}
