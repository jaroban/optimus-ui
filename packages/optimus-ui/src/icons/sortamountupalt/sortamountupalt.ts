import { ChangeDetectionStrategy, Component } from '@angular/core';
import { uuid } from '@openng/optimus-ui-utils';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="sort-amount-up-alt"]',
    standalone: true,
    templateUrl: './sortamountupalticon.html'
})
export class SortAmountUpAltIcon extends BaseIcon {
    pathId: string;

    onInit() {
        this.pathId = 'url(#' + uuid() + ')';
    }
}
