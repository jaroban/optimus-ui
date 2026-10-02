import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, inject, InjectionToken, Input, NgModule, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MenuItem, PrimeTemplate, SharedModule, TranslationKeys } from '@openng/optimus-ui/api';
import { Badge } from '@openng/optimus-ui/badge';
import { BaseComponent, PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { Bind } from '@openng/optimus-ui/bind';
import { ChevronRightIcon, HomeIcon } from '@openng/optimus-ui/icons';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { BreadcrumbItemClickEvent, BreadcrumbItemTemplateContext, BreadcrumbPassThrough } from '@openng/optimus-ui/types/breadcrumb';
import { BreadCrumbStyle } from './style/breadcrumbstyle';

const BREADCRUMB_INSTANCE = new InjectionToken<Breadcrumb>('BREADCRUMB_INSTANCE');

/**
 * Breadcrumb provides contextual information about page hierarchy.
 * @group Components
 */
@Component({
    selector: 'p-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, TooltipModule, ChevronRightIcon, HomeIcon, SharedModule, Bind, Badge],
    templateUrl: './breadcrumb.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BreadCrumbStyle, { provide: BREADCRUMB_INSTANCE, useExisting: Breadcrumb }, { provide: PARENT_INSTANCE, useExisting: Breadcrumb }],
    hostDirectives: [Bind]
})
export class Breadcrumb extends BaseComponent<BreadcrumbPassThrough> {
    componentName = 'Breadcrumb';

    bindDirectiveInstance = inject(Bind, { self: true });
    /**
     * An array of menuitems.
     * @group Props
     */
    @Input() model: MenuItem[] | undefined;
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * MenuItem configuration for the home icon.
     * @group Props
     */
    @Input() home: MenuItem | undefined;
    /**
     * Defines a string that labels the home icon for accessibility. Defaults to the `aria.home` translation when the home item has no visible label.
     * @group Props
     */
    @Input() homeAriaLabel: string | undefined;
    /**
     * Fired when an item is selected.
     * @param {BreadcrumbItemClickEvent} event - custom click event.
     * @group Emits
     */
    @Output() onItemClick: EventEmitter<BreadcrumbItemClickEvent> = new EventEmitter<BreadcrumbItemClickEvent>();

    _componentStyle = inject(BreadCrumbStyle);

    router = inject(Router);

    get homeLinkAriaLabel(): string | undefined {
        if (this.homeAriaLabel) {
            return this.homeAriaLabel;
        }

        // A visible label already names the link, so an aria-label would only override it.
        return this.home?.label ? undefined : this.config.getTranslation(TranslationKeys.ARIA)?.home;
    }

    onClick(event: MouseEvent, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }

        this.onItemClick.emit({
            originalEvent: event,
            item: item
        });
    }

    /**
     * Custom item template.
     * @group Templates
     */
    @ContentChild('item') itemTemplate: TemplateRef<BreadcrumbItemTemplateContext> | undefined;

    /**
     * Custom separator template.
     * @group Templates
     */
    @ContentChild('separator') separatorTemplate: TemplateRef<void> | undefined;

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    _separatorTemplate: TemplateRef<void> | undefined;

    _itemTemplate: TemplateRef<BreadcrumbItemTemplateContext> | undefined;

    onAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'separator':
                    this._separatorTemplate = item.template;
                    break;

                case 'item':
                    this._itemTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    getPTOptions(item: MenuItem, index: number, key: string) {
        return this.ptm(key, {
            context: {
                item,
                index
            }
        });
    }

    isCurrentPage(index: number): boolean {
        if (!this.model) {
            return false;
        }

        for (let i = this.model.length - 1; i >= 0; i--) {
            if (this.model[i]?.visible !== false) {
                return i === index;
            }
        }

        return false;
    }
}

@NgModule({
    imports: [Breadcrumb, SharedModule],
    exports: [Breadcrumb, SharedModule]
})
export class BreadcrumbModule {}
