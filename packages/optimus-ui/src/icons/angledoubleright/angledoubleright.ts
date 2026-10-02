import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="angle-double-right"]',
    standalone: true,
    templateUrl: './angledoublerighticon.html'
})
export class AngleDoubleRightIcon extends BaseIcon {}
