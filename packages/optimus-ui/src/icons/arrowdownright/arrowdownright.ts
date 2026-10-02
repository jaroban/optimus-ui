import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="arrow-down-right"]',
    standalone: true,
    templateUrl: './arrowdownrighticon.html'
})
export class ArrowDownRightIcon extends BaseIcon {}
