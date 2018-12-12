import { Component, createElement } from "react";
import Select, { Async } from "react-select";
import * as classNames from "classnames";

import { Alert } from "../../SharedResources/components/Alert";
import { Label } from "../../SharedResources/components/Label";
import { DropdownProps, debounce, hideDropDown } from "../../SharedResources/utils/ContainerUtils";

import "react-select/dist/react-select.css";
import "../../SharedResources/ui/Dropdown.scss";

export interface ReferenceOption {
    value: string;
    label: string;
}

export class DropdownReferenceSet extends Component<DropdownProps> {
    render() {
        return this.props.showLabel
            ? createElement(Label, {
                className: this.props.className,
                label: this.props.labelCaption,
                orientation: this.props.labelOrientation,
                style: this.props.styleObject,
                weight: this.props.labelWidth
            }, this.renderSelector())
            : this.renderSelector();
    }

    componentDidMount() {
        const scrollContainer = document.querySelector(".mx-window-body");
        if (scrollContainer && this.props.location === "popup") {
            (document.getElementsByClassName("widget-dropdown-reference-set")[0] as HTMLElement).style.overflow = "hidden";
            scrollContainer.addEventListener("scroll", () => { hideDropDown(); });
        }
    }

    componentWillUnmount() {
        const scrollContainer = document.querySelector(".mx-window-body");
        if (scrollContainer && this.props.location === "popup") {
            (document.getElementsByClassName("widget-dropdown-reference-set")[0] as HTMLElement).style.overflow = "hidden";
            scrollContainer.removeEventListener("scroll", () => { hideDropDown(); });
        }
    }

    private renderSelector() {
        const commonProps = {
            clearable: this.props.isClearable,
            multi: true,
            removeSelected: true,
            disabled: this.props.isReadOnly,
            onChange: this.props.handleOnchange as () => void,
            ...this.createSelectorProp()
        };

        if (this.props.readOnlyStyle === "control" || (this.props.readOnlyStyle === "text" && !this.props.isReadOnly)) {
            const loadOptions = (input?: string) => (this.props.asyncData as (input?: string) => Promise<{}>)(input);

            return createElement("div", {
                className: "widget-dropdown-reference-set",
                onClick: this.setDropdownSize
            },
                this.props.selectType === "normal"
                    ? this.props.isReadOnly
                        ? createElement("input", {
                            type: "text",
                            readonly: "readonly",
                            className: "form-control",
                            disabled: "disabled",
                            value: this.processOptions()
                        })
                        : createElement(Select, {
                            options: this.props.data,
                            ...commonProps
                        })
                    : createElement(Async, {
                        autoload: false,
                        autoFocus: true,
                        loadOptions: debounce(loadOptions, 200),
                        searchPromptText: this.props.searchPromptText,
                        ...commonProps
                    }),
                createElement(Alert, { className: "widget-dropdown-type-ahead-alert" }, this.props.alertMessage)
            );
        } else {
            return createElement("p", { className: classNames("form-control-static", "read-only-text") },
                this.processOptions()
            );
        }
    }

    private setDropdownSize = () => {
        const dropdown = document.getElementsByClassName("Select-menu-outer");
        const dropdownElement = dropdown[0] as HTMLElement;
        if (dropdownElement && dropdownElement.style.visibility !== "visible" && this.props.location === "popup") {
            dropdownElement.style.visibility = "hidden";
            const dropdownDimensions = dropdown[0].getBoundingClientRect();
            if (dropdownDimensions) {
                dropdownElement.style.width = dropdownDimensions.width - .08 + "px";
                dropdownElement.style.left = dropdownDimensions.left + "px";
                dropdownElement.style.top = dropdownDimensions.top + "px";
                dropdownElement.style.visibility = "visible";
                dropdownElement.style.position = "fixed";
            }
        }
    }

    private createSelectorProp(): { placeholder?: string, value?: object } {
        if (this.props.selectedValue.length > 0) {
            return { value: this.props.selectedValue };
        }

        return { placeholder: this.props.emptyOptionCaption };
    }

    private processOptions() {
        let selectedLabel = "";
        let formatedOptions: string[] = [];

        if (this.props.selectedValue.length > 0) {
            formatedOptions = this.props.selectedValue.map((selectedGuid: ReferenceOption) => {
                if (this.props.selectedValue) {
                    this.props.selectedValue.forEach((dataObject: ReferenceOption) => {
                        const value = dataObject.value;
                        if (value === selectedGuid.value) {
                            selectedLabel = dataObject.label as string;
                        }
                    });
                }

                return selectedLabel;
            });
        }

        return formatedOptions.join(", ");
    }
}
