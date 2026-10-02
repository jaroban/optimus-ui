import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="angle-double-left"]',
    standalone: true,
    templateUrl: './angledoublelefticon.html'
})
export class AngleDoubleLeftIcon extends BaseIcon {}
