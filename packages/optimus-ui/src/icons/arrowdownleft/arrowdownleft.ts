import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="arrow-down-left"]',
    standalone: true,
    templateUrl: './arrowdownlefticon.html'
})
export class ArrowDownLeftIcon extends BaseIcon {}
