import { ChangeDetectionStrategy, Component } from '@angular/core';
import { uuid } from '@openng/optimus-ui-utils';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="window-minimize"]',
    standalone: true,
    templateUrl: './windowminimizeicon.html'
})
export class WindowMinimizeIcon extends BaseIcon {
    pathId: string;

    onInit() {
        this.pathId = 'url(#' + uuid() + ')';
    }
}
