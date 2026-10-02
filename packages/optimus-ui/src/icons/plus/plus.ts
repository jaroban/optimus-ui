import { ChangeDetectionStrategy, Component } from '@angular/core';
import { uuid } from '@openng/optimus-ui-utils';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="plus"]',
    standalone: true,
    templateUrl: './plusicon.html'
})
export class PlusIcon extends BaseIcon {
    pathId: string;

    onInit() {
        this.pathId = 'url(#' + uuid() + ')';
    }
}
