import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="eye"]',
    standalone: true,
    templateUrl: './eyeicon.html'
})
export class EyeIcon extends BaseIcon {}
