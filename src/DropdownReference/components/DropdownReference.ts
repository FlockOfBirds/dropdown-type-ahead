import { Component, ReactNode, createElement } from "react";
import * as classNames from "classnames";
import Select, { Async } from "react-select";

import { Alert } from "../../SharedResources/components/Alert";
import { Label } from "../../SharedResources/components/Label";
import { DropdownProps, debounce, hideDropDown } from "../../SharedResources/utils/ContainerUtils";

import "react-select/dist/react-select.css";
import "../../SharedResources/ui/Dropdown.scss";

export class DropdownReference extends Component<DropdownProps> {
    render(): ReactNode {
        return this.props.showLabel
            ? createElement(Label, {
                class: this.props.className,
                caption: this.props.labelCaption,
                orientation: this.props.labelOrientation,
                style: this.props.styleObject,
                width: this.props.labelWidth
            }, this.renderSelector(true))
            : this.renderSelector();
    }

    componentDidMount() {
        const scrollContainer = document.querySelector(".mx-window-body");
        if (scrollContainer && this.props.location === "popup") {
            scrollContainer.addEventListener("scroll", hideDropDown);
        }
    }

    componentWillUnmount() {
        const scrollContainer = document.querySelector(".mx-window-body");
        if (scrollContainer && this.props.location === "popup") {
            scrollContainer.removeEventListener("scroll", hideDropDown);
        }
    }

    private renderSelector(hasLabel = false) {
        const commonProps = {
            clearable: this.props.isClearable,
            disabled: this.props.isReadOnly,
            onChange: this.props.handleOnchange,
            ...this.createSelectorProp()
        };

        if (this.props.readOnlyStyle === "control" || (this.props.readOnlyStyle === "text" && !this.props.isReadOnly)) {
            const loadOptions = (input?: string) => (this.props.asyncData as (input?: string) => Promise<{}>)(input);

            return createElement("div", {
                className: classNames(
                    "widget-dropdown-reference",
                    !hasLabel ? this.props.className : undefined,
                    {
                        "popup-fix": this.props.location === "popup",
                        "has-error": this.props.alertMessage
                    }
                ),
                onClick: this.setDropdownSize,
                style: !hasLabel ? this.props.styleObject : undefined
            },
                this.props.selectType === "normal"
                    ? createElement(Select, {
                        options: this.props.data,
                        ...commonProps
                    })
                    : createElement(Async, {
                        searchPromptText: this.props.searchPromptText,
                        loadOptions: debounce(loadOptions, 200),
                        ...commonProps
                    }),
                createElement(Alert, { className: classNames("widget-dropdown-reference-alert") }, this.props.alertMessage)
            );
        } else {
            return createElement("p", { className: classNames("form-control-static", "read-only-text") },
                this.props.selectedValue ? this.props.selectedValue.label : "");
        }
    }

    private setDropdownSize = () => {
        const dropdown = document.getElementsByClassName("Select-menu-outer");
        const dropdownElement = dropdown[0] as HTMLElement; // We pick the first element because only one dropdown can be opened at a time
        if (dropdownElement && dropdownElement.style.visibility !== "visible" && this.props.location === "popup") {
            dropdownElement.style.visibility = "hidden";
            const dropdownDimensions = dropdownElement.getBoundingClientRect();
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
        if (this.props.selectedValue && this.props.selectedValue.value) {
            return { value: this.props.selectedValue };
        }

        return { placeholder: this.props.emptyOptionCaption };
    }
}
