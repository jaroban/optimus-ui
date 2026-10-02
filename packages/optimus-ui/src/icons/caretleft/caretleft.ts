import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="caret-left"]',
    standalone: true,
    templateUrl: './caretlefticon.html'
})
export class CaretLeftIcon extends BaseIcon {}
