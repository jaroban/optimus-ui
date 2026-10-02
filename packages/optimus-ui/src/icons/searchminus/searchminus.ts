import { ChangeDetectionStrategy, Component } from '@angular/core';
import { uuid } from '@openng/optimus-ui-utils';
import { BaseIcon } from '@openng/optimus-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="search-minus"]',
    standalone: true,
    templateUrl: './searchminusicon.html'
})
export class SearchMinusIcon extends BaseIcon {
    pathId: string;

    onInit() {
        this.pathId = 'url(#' + uuid() + ')';
    }
}
