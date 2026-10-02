import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="arrow-right"]',
    standalone: true,
    templateUrl: './arrowrighticon.html'
})
export class ArrowRightIcon extends BaseIcon {}
