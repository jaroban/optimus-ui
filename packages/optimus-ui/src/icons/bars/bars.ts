import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="bars"]',
    standalone: true,
    templateUrl: './barsicon.html'
})
export class BarsIcon extends BaseIcon {}
