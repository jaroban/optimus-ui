import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="filter-fill"]',
    standalone: true,
    templateUrl: './filterfillicon.html'
})
export class FilterFillIcon extends BaseIcon {}
