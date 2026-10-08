import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    InjectionToken,
    Injector,
    Input,
    NgModule,
    numberAttribute,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { getSelection } from '@openng/optimus-ui-utils';
import { PrimeTemplate, SharedModule } from '@openng/optimus-ui/api';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { PARENT_INSTANCE } from '@openng/optimus-ui/basecomponent';
import { BaseInput } from '@openng/optimus-ui/baseinput';
import { Bind, BindModule } from '@openng/optimus-ui/bind';
import { AngleDownIcon, AngleUpIcon, TimesIcon } from '@openng/optimus-ui/icons';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Nullable } from '@openng/optimus-ui/ts-helpers';
import type { InputNumberInputEvent, InputNumberPassThrough } from '@openng/optimus-ui/types/inputnumber';
import { InputNumberStyle } from './style/inputnumberstyle';

export interface InputNumberDataAdapter<T> {
    fromString: (value: string) => T | null;
    toString: (value: T | null) => string;
    isLessThan: (value: T, other: T) => boolean;
    add: (value: T, step: T) => T;
}

export const INPUTNUMBER_DATA_ADAPTER_NUMBER: InputNumberDataAdapter<number> = {
    fromString: (value: string) => {
        const parsedValue = parseFloat(value);
        return isNaN(parsedValue) ? null : parsedValue;
    },
    toString: (value: number | null) => (value != null ? value.toString() : ''),
    isLessThan: (value: number, other: number) => value < other,
    add: (value: number, step: number) => value + step
};

export const INPUTNUMBER_DATA_ADAPTER_BIGINT: InputNumberDataAdapter<bigint> = {
    fromString: (value: string) => {
        try {
            return BigInt(value);
        } catch {
            return null;
        }
    },
    toString: (value: bigint | null) => (value != null ? value.toString() : ''),
    isLessThan: (value: bigint, other: bigint) => value < other,
    add: (value: bigint, step: bigint) => value + step
};

const INPUTNUMBER_INSTANCE = new InjectionToken<InputNumber>('INPUTNUMBER_INSTANCE');

export const INPUTNUMBER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputNumber),
    multi: true
};

interface InternalRepresentation {
    text: string;
    justNumber?: string;
    value: number | bigint | null;
}

/**
 * InputNumber is an input component to provide numerical input.
 * @group Components
 */
@Component({
    selector: 'p-inputNumber, p-inputnumber, p-input-number',
    standalone: true,
    imports: [CommonModule, InputText, AutoFocus, TimesIcon, AngleUpIcon, AngleDownIcon, SharedModule, BindModule],
    templateUrl: './inputnumber.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [INPUTNUMBER_VALUE_ACCESSOR, InputNumberStyle, { provide: INPUTNUMBER_INSTANCE, useExisting: InputNumber }, { provide: PARENT_INSTANCE, useExisting: InputNumber }],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass)",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class InputNumber extends BaseInput<InputNumberPassThrough> {
    componentName = 'InputNumber';

    $pcInputNumber: InputNumber | undefined = inject(INPUTNUMBER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    _componentStyle = inject(InputNumberStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Displays spinner buttons.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showButtons: boolean = false;
    /**
     * Whether to format the value.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) format: boolean = true;
    /**
     * Layout of the buttons, valid values are "stacked" (default), "horizontal" and "vertical".
     * @group Props
     */
    @Input() buttonLayout: string = 'stacked';
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    @Input() inputId: string | undefined;
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Advisory information to display on input.
     * @group Props
     */
    @Input() placeholder: string | undefined;
    /**
     * Specifies tab order of the element.
     * @group Props
     */
    @Input({ transform: numberAttribute }) tabindex: number | undefined;
    /**
     * Title text of the input text.
     * @group Props
     */
    @Input() title: string | undefined;
    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    @Input() ariaLabelledBy: string | undefined;
    /**
     * Specifies one or more IDs in the DOM that describes the input field.
     * @group Props
     */
    @Input() ariaDescribedBy: string | undefined;
    /**
     * Used to define a string that labels the input element.
     * @group Props
     */
    @Input() ariaLabel: string | undefined;
    /**
     * Used to indicate that user input is required on an element before a form can be submitted.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) ariaRequired: boolean | undefined;
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    @Input() autocomplete: string | undefined;
    /**
     * Style class of the increment button.
     * @group Props
     */
    @Input() incrementButtonClass: string | undefined;
    /**
     * Style class of the decrement button.
     * @group Props
     */
    @Input() decrementButtonClass: string | undefined;
    /**
     * Style class of the increment button.
     * @group Props
     */
    @Input() incrementButtonIcon: string | undefined;
    /**
     * Style class of the decrement button.
     * @group Props
     */
    @Input() decrementButtonIcon: string | undefined;
    /**
     * When present, it specifies that an input field is read-only.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) readonly: boolean | undefined;
    /**
     * Determines whether the input field is empty.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) allowEmpty: boolean = true;
    /**
     * Locale to be used in formatting.
     * @group Props
     */
    @Input() locale: string | undefined;
    /**
     * The locale matching algorithm to use. Possible values are "lookup" and "best fit"; the default is "best fit". See Locale Negotiation for details.
     * @group Props
     */
    @Input() localeMatcher: any;
    /**
     * Defines the behavior of the component, valid values are "decimal" and "currency".
     * @group Props
     */
    @Input() mode: 'decimal' | 'currency' = 'decimal';
    /**
     * The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as "USD" for the US dollar, "EUR" for the euro, or "CNY" for the Chinese RMB. There is no default value; if the style is "currency", the currency property must be provided.
     * @group Props
     */
    @Input() currency: string | undefined;
    /**
     * How to display the currency in currency formatting. Possible values are "symbol" to use a localized currency symbol such as €, ü"code" to use the ISO currency code, "name" to use a localized currency name such as "dollar"; the default is "symbol".
     * @group Props
     */
    @Input() currencyDisplay: string | undefined | any;
    /**
     * Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) useGrouping: boolean = true;
    /**
     * The minimum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number and percent formatting is 0; the default for currency formatting is the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information).
     * @group Props
     */
    @Input({ transform: (value: unknown) => numberAttribute(value, undefined) }) minFractionDigits: number | undefined;
    /**
     * The maximum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number formatting is the larger of minimumFractionDigits and 3; the default for currency formatting is the larger of minimumFractionDigits and the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information).
     * @group Props
     */
    @Input({ transform: (value: unknown) => numberAttribute(value, undefined) }) maxFractionDigits: number | undefined;
    /**
     * Text to display before the value.
     * @group Props
     */
    @Input() prefix: string | undefined;
    /**
     * Text to display after the value.
     * @group Props
     */
    @Input() suffix: string | undefined;
    /**
     * Inline style of the input field.
     * @group Props
     */
    @Input() inputStyle: any;
    /**
     * Style class of the input field.
     * @group Props
     */
    @Input() inputStyleClass: string | undefined;
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showClear: boolean = false;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) autofocus: boolean | undefined;
    /**
     * Custom data adapter for parsing and formatting the input value.
     * @group Props
     */
    @Input() dataAdapter: InputNumberDataAdapter<any> = INPUTNUMBER_DATA_ADAPTER_NUMBER;
    /**
     * Callback to invoke on input.
     * @param {InputNumberInputEvent} event - Custom input event.
     * @group Emits
     */
    @Output() onInput: EventEmitter<InputNumberInputEvent> = new EventEmitter<InputNumberInputEvent>();
    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onFocus: EventEmitter<Event> = new EventEmitter<Event>();
    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onBlur: EventEmitter<Event> = new EventEmitter<Event>();
    /**
     * Callback to invoke on input key press.
     * @param {KeyboardEvent} event - Keyboard event.
     * @group Emits
     */
    @Output() onKeyDown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
    /**
     * Callback to invoke when clear token is clicked.
     * @group Emits
     */
    @Output() onClear: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Custom clear icon template.
     * @group Templates
     */
    @ContentChild('clearicon', { descendants: false }) clearIconTemplate: Nullable<TemplateRef<void>>;
    /**
     * Custom increment button icon template.
     * @group Templates
     */
    @ContentChild('incrementbuttonicon', { descendants: false }) incrementButtonIconTemplate: Nullable<TemplateRef<void>>;

    /**
     * Custom decrement button icon template.
     * @group Templates
     */
    @ContentChild('decrementbuttonicon', { descendants: false }) decrementButtonIconTemplate: Nullable<TemplateRef<void>>;

    @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

    @ViewChild('input') input!: ElementRef<HTMLInputElement>;

    _clearIconTemplate: TemplateRef<void> | undefined;

    _incrementButtonIconTemplate: TemplateRef<void> | undefined;

    _decrementButtonIconTemplate: TemplateRef<void> | undefined;

    value: Nullable<number | bigint>;

    focused: Nullable<boolean>;

    initialized: Nullable<boolean>;

    groupChar: string = '';

    prefixChar: string = '';

    suffixChar: string = '';

    isSpecialChar: Nullable<boolean>;

    timer: any;

    lastValue: Nullable<string>;

    _numerals: string;

    numberFormat: any;

    _decimal: string;

    _group: string;

    _minusSign?: string;

    _currency?: string;

    _prefix?: string;

    _suffix?: string;

    private ngControl: NgControl | null = null;

    constructor(public readonly injector: Injector) {
        super();
    }

    onChanges(simpleChange: SimpleChanges) {
        const props = ['locale', 'localeMatcher', 'mode', 'currency', 'currencyDisplay', 'useGrouping', 'minFractionDigits', 'maxFractionDigits', 'prefix', 'suffix'];
        if (props.some((p) => !!simpleChange[p])) {
            this.updateConstructParser();
        }
    }

    onInit() {
        this.ngControl = this.injector.get(NgControl, null, { optional: true });

        this.constructParser();

        this.initialized = true;
    }

    onAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'clearicon':
                    this._clearIconTemplate = item.template;
                    break;

                case 'incrementbuttonicon':
                    this._incrementButtonIconTemplate = item.template;
                    break;

                case 'decrementbuttonicon':
                    this._decrementButtonIconTemplate = item.template;
                    break;
            }
        });
    }

    // Validate fraction digits according to Intl.NumberFormat specifications
    // Handle potential NaN, Infinity, or invalid values
    static validateFractionDigits(value: number | undefined, min: number, max: number) {
        if (value == null || isNaN(value) || !isFinite(value)) {
            return undefined;
        }
        return Math.max(min, Math.min(max, Math.floor(value)));
    }

    getOptions() {
        const minFractionDigits = InputNumber.validateFractionDigits(this.minFractionDigits, 0, 20);
        const maxFractionDigits = InputNumber.validateFractionDigits(this.maxFractionDigits, 0, 100);

        // Ensure minFractionDigits <= maxFractionDigits
        const validatedMinFractionDigits = minFractionDigits != null && maxFractionDigits != null && minFractionDigits > maxFractionDigits ? maxFractionDigits : minFractionDigits;

        return {
            localeMatcher: this.localeMatcher,
            style: this.mode,
            currency: this.currency,
            currencyDisplay: this.currencyDisplay,
            useGrouping: this.useGrouping,
            minimumFractionDigits: validatedMinFractionDigits,
            maximumFractionDigits: maxFractionDigits
        };
    }

    constructParser() {
        const options = this.getOptions();
        // Remove any properties with undefined or invalid values to let Intl.NumberFormat use defaults
        const cleanOptions = Object.fromEntries(Object.entries(options).filter(([_key, value]) => value !== undefined));
        this.numberFormat = new Intl.NumberFormat(this.locale, cleanOptions);
        this._numerals = [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse().join('');
        this._group = this.getGroupingExpression();
        this._minusSign = this.getMinusSignExpression();
        this._currency = this.getCurrencyExpression();
        this._decimal = this.getDecimalChar();
        this._suffix = this.getSuffixExpression();
        this._prefix = this.getPrefixExpression();
    }

    updateConstructParser() {
        if (this.initialized) {
            this.constructParser();
        }
    }

    getDecimalChar(): string {
        const formatter = new Intl.NumberFormat(this.locale, { ...this.getOptions(), useGrouping: false, maximumFractionDigits: 5 });
        return formatter.formatToParts(1.1).find((part) => part.type === 'decimal')?.value || '';
    }

    getGroupingExpression(): string {
        const formatter = new Intl.NumberFormat(this.locale, { useGrouping: true });
        this.groupChar = formatter.formatToParts(1000000).find((part) => part.type === 'group')?.value || '';
        return this.groupChar;
    }

    getMinusSignExpression(): string | undefined {
        const formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
        return formatter.formatToParts(-1).find((part) => part.type === 'minusSign')?.value;
    }

    getCurrencyExpression(): string | undefined {
        if (this.currency) {
            const formatter = new Intl.NumberFormat(this.locale, {
                style: 'currency',
                currency: this.currency,
                currencyDisplay: this.currencyDisplay,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            const currencyString = formatter.formatToParts(1).find((part) => part.type === 'currency')?.value;
            return currencyString;
        }

        return undefined;
    }

    getPrefixExpression(): string {
        this.prefixChar = '';

        if (this.prefix) {
            this.prefixChar = this.prefix;
        }

        if (this.mode === 'currency' && this.currency) {
            const formatter = new Intl.NumberFormat(this.locale, {
                style: this.mode,
                currency: this.currency,
                currencyDisplay: this.currencyDisplay
            });
            let parts = formatter.formatToParts(1);
            let currencyIndex = parts.findIndex((part) => part.type === 'currency');
            let integerIndex = parts.findIndex((part) => part.type === 'integer');
            if (currencyIndex !== -1 && integerIndex !== -1 && currencyIndex < integerIndex) {
                this.prefixChar += parts[currencyIndex].value;
            }
        }

        return this.prefixChar;
    }

    getSuffixExpression(): string {
        this.suffixChar = '';

        if (this.mode === 'currency' && this.currency) {
            const formatter = new Intl.NumberFormat(this.locale, {
                style: this.mode,
                currency: this.currency,
                currencyDisplay: this.currencyDisplay,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            let parts = formatter.formatToParts(1);
            let currencyIndex = parts.findIndex((part) => part.type === 'currency');
            let integerIndex = parts.findIndex((part) => part.type === 'integer');
            if (currencyIndex !== -1 && integerIndex !== -1 && currencyIndex > integerIndex) {
                this.suffixChar = parts[currencyIndex].value;
            }
        }

        if (this.suffix) {
            this.suffixChar += this.suffix;
        }

        return this.suffixChar;
    }

    // keep intermediate states like '.', '-.', '-', '1.', '1.000'
    isIntermediateState(ir: InternalRepresentation): boolean {
        return ir.justNumber !== undefined && (ir.justNumber === '-' || ir.justNumber.endsWith('.') || (!this.minFractionDigits && ir.justNumber.includes('.') && ir.justNumber.endsWith('0')));
    }

    // value -> justNumber, text
    formatValue(ir: InternalRepresentation): InternalRepresentation {
        if (this.isIntermediateState(ir)) {
            return ir;
        }

        if (ir.value !== null) {
            ir.justNumber = this.dataAdapter.toString(ir.value);

            if (this.format) {
                let options = this.getOptions();
                let formatter = new Intl.NumberFormat(this.locale, options);
                let parts = formatter.formatToParts(ir.value);

                let formattedValue = parts.map((part) => part.value).join('');

                if (this.prefix && ir.text != this.prefix) {
                    formattedValue = this.prefix + formattedValue;
                }

                if (this.suffix && ir.text != this.suffix) {
                    formattedValue = formattedValue + this.suffix;
                }

                ir.text = formattedValue;
            } else {
                ir.text = ir.justNumber;
            }
        } else {
            ir.text = '';
        }
        return ir;
    }

    // text -> justNumber, value
    parseValue(ir: InternalRepresentation): InternalRepresentation {
        let justNumber = ir.text;
        if (this._suffix) {
            justNumber = justNumber.replace(this._suffix, '');
        }
        if (this._prefix) {
            justNumber = justNumber.replace(this._prefix, '');
        }
        justNumber = justNumber.trim().replace(/\s/g, '');
        if (this._currency) {
            justNumber = justNumber.replace(this._currency, '');
        }
        if (this._group) {
            justNumber = justNumber.replaceAll(this._group, '');
        }
        if (this._minusSign) {
            justNumber = justNumber.replace(this._minusSign, '-');
        }
        if (this._decimal) {
            justNumber = justNumber.replace(this._decimal, '.');
        }
        justNumber = justNumber
            .split('')
            .map((d) => {
                let i = this._numerals.indexOf(d);
                return i !== -1 ? i : d;
            })
            .join('');
        ir.justNumber = justNumber;
        ir.value = this.dataAdapter.fromString(justNumber);
        return ir;
    }

    repeat(event: Event, interval: number | null, dir: number) {
        if (this.readonly) {
            return;
        }

        let i = interval || 500;

        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(event, 40, dir);
        }, i);

        this.spin(event, dir);
    }

    spin(event: Event, dir: number | bigint) {
        let step = this.step() ?? 1;
        step = dir > 0 ? step : -step;
        let currentValue = this.parseValue({ text: this.input?.nativeElement.value, value: null });
        let newValue = this.dataAdapter.add(currentValue.value ?? 0, step);
        let ir = this.validateValue({ text: '', value: newValue });
        const max = this.maxlength();
        if (max && max < this.formatValue(ir).text.length) {
            return;
        }

        this.updateInput(newValue, null, 'spin', null);
        this.updateModel(event, newValue);

        this.handleOnInput(event, currentValue.text, newValue, null);
    }

    clear() {
        this.value = null;
        this.onModelChange(this.value);
        this.onClear.emit();
    }

    onUpButtonMouseDown(event: MouseEvent) {
        if (event.button === 2) {
            this.clearTimer();
            return;
        }

        if (!this.$disabled()) {
            this.input?.nativeElement.focus();
            this.repeat(event, null, 1);
            event.preventDefault();
        }
    }

    onUpButtonMouseUp() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onUpButtonMouseLeave() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onUpButtonKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.repeat(event, null, 1);
        }
    }

    onUpButtonKeyUp() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onDownButtonMouseDown(event: MouseEvent) {
        if (event.button === 2) {
            this.clearTimer();
            return;
        }
        if (!this.$disabled()) {
            this.input?.nativeElement.focus();
            this.repeat(event, null, -1);
            event.preventDefault();
        }
    }

    onDownButtonMouseUp() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onDownButtonMouseLeave() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onDownButtonKeyUp() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onDownButtonKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.repeat(event, null, -1);
        }
    }

    onUserInput(event: InputEvent) {
        if (this.readonly) {
            return;
        }

        let data = this.input.nativeElement.value;
        if (data) {
            if (this.inputId === 'integeronly') {
                data = data.replace(/[^\d-]/g, '');
            }

            if (this.maxlength()) {
                data = data.substring(0, this.maxlength()!);
            }

            this.input.nativeElement.value = data;
        }

        if (event.inputType === 'insertFromPaste') {
            let pastedData = event.data ?? '';
            this.updateValue(event, data, pastedData, 'insert');
        }

        if (this.isSpecialChar) {
            (event.target as HTMLInputElement).value = this.lastValue as string;
        }
        this.isSpecialChar = false;
    }

    onInputKeyDown(event: KeyboardEvent) {
        if (this.readonly) {
            return;
        }

        this.lastValue = (event.target as HTMLInputElement).value;
        if ((event as KeyboardEvent).shiftKey || (event as KeyboardEvent).altKey) {
            this.isSpecialChar = true;
            return;
        }

        let selectionStart = (event.target as HTMLInputElement).selectionStart as number;
        let selectionEnd = (event.target as HTMLInputElement).selectionEnd as number;
        let inputValue = (event.target as HTMLInputElement).value as string;
        let newValueStr: any = null;

        if (event.altKey) {
            event.preventDefault();
        }

        switch (event.key) {
            case 'ArrowUp':
                this.spin(event, 1);
                event.preventDefault();
                break;

            case 'ArrowDown':
                this.spin(event, -1);
                event.preventDefault();
                break;

            case 'ArrowLeft':
                for (let index = selectionStart; index <= inputValue.length; index++) {
                    const previousCharIndex = index === 0 ? 0 : index - 1;
                    if (this.isNumeralChar(inputValue.charAt(previousCharIndex))) {
                        this.input.nativeElement.setSelectionRange(index, index);
                        break;
                    }
                }
                break;

            case 'ArrowRight':
                for (let index = selectionEnd; index >= 0; index--) {
                    if (this.isNumeralChar(inputValue.charAt(index))) {
                        this.input.nativeElement.setSelectionRange(index, index);
                        break;
                    }
                }
                break;

            case 'Tab':
            case 'Enter':
                let ir = this.validateValue(this.parseValue({ text: this.input.nativeElement.value, value: null }));
                this.formatValue(ir);
                this.input.nativeElement.value = ir.text;
                this.input.nativeElement.setAttribute('aria-valuenow', ir.value?.toString() ?? '');
                this.updateModel(event, ir);
                break;

            case 'Backspace': {
                event.preventDefault();

                if (selectionStart === selectionEnd) {
                    if ((selectionStart == 1 && this.prefix) || (selectionStart == inputValue.length && this.suffix)) {
                        break;
                    }

                    const deleteChar = inputValue.charAt(selectionStart - 1);
                    const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndices(inputValue);

                    if (this.isNumeralChar(deleteChar)) {
                        const decimalLength = this.getDecimalLength(inputValue);

                        if (deleteChar.includes(this._group)) {
                            newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
                        } else if (deleteChar.includes(this._decimal)) {
                            if (decimalLength) {
                                this.input?.nativeElement.setSelectionRange(selectionStart - 1, selectionStart - 1);
                            } else {
                                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                            }
                        } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                            const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? '' : '0';
                            newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
                        } else if (decimalCharIndexWithoutPrefix === 1) {
                            newValueStr = inputValue.slice(0, selectionStart - 1) + '0' + inputValue.slice(selectionStart);
                            newValueStr = (this.parseValue({ text: newValueStr, value: null }).value ?? 0) > 0 ? newValueStr : '';
                        } else {
                            newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                        }
                    } else if (this.mode === 'currency' && this._currency && deleteChar.indexOf(this._currency) != -1) {
                        newValueStr = inputValue.slice(1);
                    }

                    this.updateValue(event, newValueStr, null, 'delete-single');
                } else {
                    newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                    this.updateValue(event, newValueStr, null, 'delete-range');
                }

                break;
            }

            case 'Delete':
                event.preventDefault();

                if (selectionStart === selectionEnd) {
                    if ((selectionStart == 0 && this.prefix) || (selectionStart == inputValue.length - 1 && this.suffix)) {
                        break;
                    }
                    const deleteChar = inputValue.charAt(selectionStart);
                    const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndices(inputValue);

                    if (this.isNumeralChar(deleteChar)) {
                        const decimalLength = this.getDecimalLength(inputValue);

                        if (deleteChar.includes(this._group)) {
                            newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
                        } else if (deleteChar.includes(this._decimal)) {
                            if (decimalLength) {
                                this.input?.nativeElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
                            } else {
                                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                            }
                        } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                            const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? '' : '0';
                            newValueStr = inputValue.slice(0, selectionStart) + insertedText + inputValue.slice(selectionStart + 1);
                        } else if (decimalCharIndexWithoutPrefix === 1) {
                            newValueStr = inputValue.slice(0, selectionStart) + '0' + inputValue.slice(selectionStart + 1);
                            newValueStr = (this.parseValue({ text: newValueStr, value: null }).value ?? 0) > 0 ? newValueStr : '';
                        } else {
                            newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                        }
                    }

                    this.updateValue(event, newValueStr as string, null, 'delete-back-single');
                } else {
                    newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                    this.updateValue(event, newValueStr, null, 'delete-range');
                }
                break;

            case 'Home':
                let min = this.min();
                if (min) {
                    this.updateModel(event, { value: min, text: '' });
                    event.preventDefault();
                }
                break;

            case 'End':
                let max = this.max();
                if (max) {
                    this.updateModel(event, { value: max, text: '' });
                    event.preventDefault();
                }
                break;

            default:
                break;
        }

        this.onKeyDown.emit(event);
    }

    onInputKeyPress(event: KeyboardEvent) {
        if (this.readonly) {
            return;
        }

        let code = event.which || event.keyCode;
        if (code == 13) {
            return;
        }
        event.preventDefault();

        let char = String.fromCharCode(code);
        let isDecimalSign = this.isDecimalSign(char);
        const isMinusSign = this.isMinusSign(char);

        if (!isDecimalSign && event.code === 'NumpadDecimal') {
            isDecimalSign = true;
            char = this._decimal;
            code = char.charCodeAt(0);
        }
        const { value, selectionStart, selectionEnd } = this.input.nativeElement;
        const selectedValue = value.substring(selectionStart as number, selectionEnd as number);
        const selectedValueParsed = this.parseValue({ text: selectedValue, value: null });
        const selectedValueStr = selectedValueParsed.value != null ? selectedValueParsed.text : '';

        if (selectionStart !== selectionEnd && selectedValueStr.length > 0) {
            this.insert(event, char, { isDecimalSign, isMinusSign });
            return;
        }

        const maxLength = this.maxlength();
        const newValueStr = this.formatValue(this.parseValue({ text: value + char, value: null })).text;
        if (maxLength && newValueStr.length > maxLength) {
            return;
        }

        if ((48 <= code && code <= 57) || isMinusSign || isDecimalSign) {
            this.insert(event, char, { isDecimalSign, isMinusSign });
        }
    }

    allowMinusSign() {
        const min = this.min();

        return min == null || min < 0;
    }

    isMinusSign(char: string) {
        return (this._minusSign && this._minusSign.includes(char)) || char === '-';
    }

    isDecimalSign(char: string) {
        return char.includes(this._decimal);
    }

    isDecimalMode() {
        return this.mode === 'decimal';
    }

    getDecimalCharIndices(val: string) {
        let decimalCharIndex = val.indexOf(this._decimal);

        let filteredVal = this._prefix ? val.replaceAll(this._prefix, '') : val;
        filteredVal = filteredVal.trim().replace(/\s/g, '');
        if (this._currency) filteredVal = filteredVal.replaceAll(this._currency, '');

        const decimalCharIndexWithoutPrefix = filteredVal.indexOf(this._decimal);

        return { decimalCharIndex, decimalCharIndexWithoutPrefix };
    }

    getCharIndices(val: string) {
        return {
            decimalCharIndex: val.indexOf(this._decimal),
            minusCharIndex: this._minusSign ? val.indexOf(this._minusSign) : -1,
            suffixCharIndex: this._suffix ? val.indexOf(this._suffix) : -1,
            currencyCharIndex: this._currency ? val.indexOf(this._currency) : -1
        };
    }

    insert(event: Event, text: string, sign = { isDecimalSign: false, isMinusSign: false }) {
        const minusCharIndexOnText = this._minusSign ? text.indexOf(this._minusSign) : -1;
        if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
            return;
        }

        let selectionStart: any = this.input?.nativeElement.selectionStart;
        let selectionEnd: any = this.input?.nativeElement.selectionEnd;
        let inputValue = this.input?.nativeElement.value.trim();
        const { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex } = this.getCharIndices(inputValue);
        let newValueStr: string | null = null;

        if (sign.isMinusSign) {
            if (selectionStart === 0) {
                newValueStr = inputValue;
                if (minusCharIndex === -1 || selectionEnd !== 0) {
                    newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
                }

                this.updateValue(event, newValueStr, text, 'insert');
            }
        } else if (sign.isDecimalSign) {
            if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
                this.updateValue(event, inputValue, text, 'insert');
            } else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, 'insert');
            } else if (decimalCharIndex === -1 && this.maxFractionDigits) {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, 'insert');
            }
        } else {
            const maxFractionDigits = this.numberFormat.resolvedOptions().maximumFractionDigits;
            const operation = selectionStart !== selectionEnd ? 'range-insert' : 'insert';

            if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                const lastDecimalCharIndex = (selectionStart <= currencyCharIndex ? currencyCharIndex : selectionStart <= suffixCharIndex ? suffixCharIndex : inputValue.length) - 1;
                if (lastDecimalCharIndex - decimalCharIndex + text.length - (selectionEnd - selectionStart) <= maxFractionDigits) {
                    newValueStr = inputValue.slice(0, selectionStart) + text + inputValue.slice(selectionEnd);
                    this.updateValue(event, newValueStr, text, operation);
                }
            } else {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, operation);
            }
        }
    }

    insertText(value: string, text: string, start: number, end: number): string {
        let textSplit = text === this._decimal ? text : text.split(this._decimal);

        if (textSplit.length === 2) {
            let formattedValue = this.formatValue(this.parseValue({ text: text, value: null }));

            const decimalInOriginal = value.search(this._decimal) !== -1;
            const decimalInSelection = value.slice(start, end).search(this._decimal) !== -1;
            if (!decimalInOriginal || decimalInSelection) {
                // pasting a decimal number into a value that doesn't have a decimal point
                // or pasting a decimal number into a selection that already has a decimal point
                return value.slice(0, start) + formattedValue.text + value.slice(end);
            } else {
                // we'd end up with 2 decimal points, so we're not going to allow the insert
                return value ?? formattedValue.text;
            }
        } else if (end - start === value.length) {
            return this.formatValue(this.parseValue({ text: text, value: null })).text;
        } else if (start === 0) {
            return text + value.slice(end);
        } else if (end === value.length) {
            return value.slice(0, start) + text;
        } else {
            return value.slice(0, start) + text + value.slice(end);
        }
    }

    deleteRange(value: string, start: number, end: number) {
        let newValueStr;

        if (end - start === value.length) newValueStr = '';
        else if (start === 0) newValueStr = value.slice(end);
        else if (end === value.length) newValueStr = value.slice(0, start);
        else newValueStr = value.slice(0, start) + value.slice(end);

        return newValueStr;
    }

    initCursor() {
        let selectionStart: any = this.input?.nativeElement.selectionStart;
        let selectionEnd: any = this.input?.nativeElement.selectionEnd;
        let inputValue = this.input?.nativeElement.value;
        let valueLength = inputValue.length;
        let index: any = null;

        // remove prefix
        let prefixLength = (this.prefixChar || '').length;
        if (this._prefix) {
            inputValue = inputValue.replaceAll(this._prefix, '');
        }

        // Will allow selecting whole prefix. But not a part of it.
        // Negative values will trigger clauses after this to fix the cursor position.
        if (selectionStart === selectionEnd || selectionStart !== 0 || selectionEnd < prefixLength) {
            selectionStart -= prefixLength;
        }

        let char = inputValue.charAt(selectionStart);
        if (this.isNumeralChar(char)) {
            return selectionStart + prefixLength;
        }

        //left
        let i = selectionStart - 1;
        while (i >= 0) {
            char = inputValue.charAt(i);
            if (this.isNumeralChar(char)) {
                index = i + prefixLength;
                break;
            } else {
                i--;
            }
        }

        if (index !== null) {
            this.input?.nativeElement.setSelectionRange(index + 1, index + 1);
        } else {
            i = selectionStart;
            while (i < valueLength) {
                char = inputValue.charAt(i);
                if (this.isNumeralChar(char)) {
                    index = i + prefixLength;
                    break;
                } else {
                    i++;
                }
            }

            if (index !== null) {
                this.input?.nativeElement.setSelectionRange(index, index);
            }
        }

        return index || 0;
    }

    onInputClick() {
        const currentValue = this.input?.nativeElement.value;

        if (!this.readonly && currentValue !== getSelection()) {
            this.initCursor();
        }
    }

    isNumeralChar(char: string) {
        if (char.length === 1 && (this._numerals.includes(char) || char == this._decimal || char == this._group || char == this._minusSign)) {
            return true;
        }

        return false;
    }

    updateValue(event: Event, valueStr: Nullable<string>, insertedValueStr: Nullable<string>, operation: Nullable<string>) {
        let currentValue = this.input?.nativeElement.value;
        let newValue: any = null;

        if (valueStr != null) {
            newValue = this.parseValue({ text: valueStr, value: this.allowEmpty ? null : 0 });
            this.updateInput(newValue, insertedValueStr, operation, valueStr);

            this.handleOnInput(event, currentValue, newValue, valueStr);
        }
    }

    handleOnInput(event: Event, currentValue: string, newValue: InternalRepresentation, valueStr: Nullable<string>) {
        if (this.isValueChanged(currentValue, newValue) && !this.isIntermediateState(newValue)) {
            (this.input as ElementRef).nativeElement.value = this.formatValue(newValue).text;
            this.updateModel(event, newValue);
            this.input?.nativeElement.setAttribute('aria-valuenow', newValue.value?.toString() ?? '');
            this.onInput.emit({ originalEvent: event, value: newValue.value, formattedValue: newValue.text });
        }
    }

    isValueChanged(currentValue: string, newValue: InternalRepresentation) {
        if (newValue === null && currentValue !== null) {
            return true;
        }

        if (newValue != null) {
            // let parsedCurrentValue = this.parseValue({ text: currentValue, value: null });
            return newValue.value !== this.value;
        }

        return false;
    }

    validateValue(ir: InternalRepresentation): InternalRepresentation {
        const min = this.min();
        if (min != null && this.dataAdapter.isLessThan(ir.value, min)) {
            ir.value = min;
            return ir;
        }

        const max = this.max();
        if (max != null && this.dataAdapter.isLessThan(max, ir.value)) {
            ir.value = max;
            return ir;
        }

        return ir;
    }

    updateInput(value: InternalRepresentation, insertedValueStr: Nullable<string>, operation: Nullable<string>, valueStr: Nullable<string>) {
        insertedValueStr = insertedValueStr || '';

        let inputValue = this.input?.nativeElement.value;
        let newValue = this.formatValue(value);
        let currentLength = inputValue.length;

        if (currentLength === 0) {
            this.input.nativeElement.value = newValue.text;
            this.input.nativeElement.setSelectionRange(0, 0);
            const index = this.initCursor();
            const selectionEnd = index + insertedValueStr.length;
            this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
        } else {
            let selectionStart: any = this.input.nativeElement.selectionStart;
            let selectionEnd: any = this.input.nativeElement.selectionEnd;
            const maxlength = this.maxlength();
            if (maxlength && newValue.text.length > maxlength) {
                newValue.text = newValue.text.slice(0, maxlength);
                selectionStart = Math.min(selectionStart, maxlength);
                selectionEnd = Math.min(selectionEnd, maxlength);
            }

            if (maxlength && maxlength < newValue.text.length) {
                return;
            }

            this.input.nativeElement.value = newValue.text;
            let newLength = newValue.text.length;

            if (operation === 'range-insert') {
                const startValue = this.parseValue({ text: (inputValue || '').slice(0, selectionStart), value: null });
                const startValueStr = startValue !== null ? startValue.toString() : '';
                const startExpr = startValueStr.split('').join(`(${this.groupChar})?`);
                const sRegex = new RegExp(startExpr, 'g');
                sRegex.test(newValue.text);

                const tExpr = insertedValueStr.split('').join(`(${this.groupChar})?`);
                const tRegex = new RegExp(tExpr, 'g');
                tRegex.test(newValue.text.slice(sRegex.lastIndex));

                selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
                this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            } else if (newLength === currentLength) {
                if (operation === 'insert' || operation === 'delete-back-single') this.input.nativeElement.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
                else if (operation === 'delete-single') this.input.nativeElement.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
                else if (operation === 'delete-range' || operation === 'spin') this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            } else if (operation === 'delete-back-single') {
                let prevChar = inputValue.charAt(selectionEnd - 1);
                let nextChar = inputValue.charAt(selectionEnd);
                let diff = currentLength - newLength;
                let isGroupChar = nextChar == this._group;

                if (isGroupChar && diff === 1) {
                    selectionEnd += 1;
                } else if (!isGroupChar && this.isNumeralChar(prevChar)) {
                    selectionEnd += -1 * diff + 1;
                }

                this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            } else if (inputValue === '-' && operation === 'insert') {
                this.input.nativeElement.setSelectionRange(0, 0);
                const index = this.initCursor();
                const selectionEnd = index + insertedValueStr.length + 1;
                this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            } else {
                selectionEnd = selectionEnd + (newLength - currentLength);
                this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            }
        }

        this.input.nativeElement.setAttribute('aria-valuenow', value.value?.toString() ?? '');
    }

    getDecimalLength(value: string) {
        if (value) {
            const valueSplit = value.split(this._decimal);

            if (valueSplit.length === 2) {
                let decimalPart = valueSplit[1];
                if (this._suffix) {
                    decimalPart = decimalPart.replaceAll(this._suffix, '');
                }
                decimalPart = decimalPart.trim().replace(/\s/g, '');
                if (this._currency) {
                    decimalPart = decimalPart.replaceAll(this._currency, '');
                }
                return decimalPart.length;
            }
        }

        return 0;
    }

    onInputFocus(event: Event) {
        this.focused = true;
        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused = false;

        const ir = this.validateValue(this.parseValue({ text: this.input.nativeElement.value, value: null }));
        const newValueString = ir.value?.toString() ?? '';
        this.input.nativeElement.value = this.formatValue(ir).text;
        this.input.nativeElement.setAttribute('aria-valuenow', newValueString);
        this.updateModel(event, ir);
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    formattedValue() {
        const ir: InternalRepresentation = { value: !this.value && !this.allowEmpty ? 0 : (this.value ?? null), text: '' };
        return this.formatValue(ir).text;
    }

    updateModel(event: Event, ir: InternalRepresentation) {
        const isBlurUpdateOnMode = this.ngControl?.control?.updateOn === 'blur';

        if (this.value !== ir.value) {
            this.value = ir.value;

            if (!(isBlurUpdateOnMode && this.focused)) {
                this.onModelChange(ir.value);
            }
        } else if (isBlurUpdateOnMode) {
            this.onModelChange(ir.value);
        }
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value = value ? Number(value) : value;
        setModelValue(value);
        this.cd.markForCheck();
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    get dataP() {
        return this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused,
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            empty: !this.$filled(),
            [this.size() as string]: this.size(),
            [this.buttonLayout]: this.showButtons && this.buttonLayout
        });
    }
}

@NgModule({
    imports: [InputNumber, SharedModule],
    exports: [InputNumber, SharedModule]
})
export class InputNumberModule {}
