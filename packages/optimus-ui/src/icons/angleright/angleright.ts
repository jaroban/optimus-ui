import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="angle-right"]',
    standalone: true,
    templateUrl: './anglerighticon.html'
})
export class AngleRightIcon extends BaseIcon {}
