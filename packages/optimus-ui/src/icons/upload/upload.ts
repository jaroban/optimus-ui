import { ChangeDetectionStrategy, Component } from '@angular/core';
import { uuid } from '@openng/optimus-ui-utils';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="upload"]',
    standalone: true,
    templateUrl: './uploadicon.html'
})
export class UploadIcon extends BaseIcon {
    pathId: string;

    onInit() {
        this.pathId = 'url(#' + uuid() + ')';
    }
}
