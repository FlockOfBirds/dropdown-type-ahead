import { Component, createElement } from "react";
import * as classNames from "classnames";
import Select, { Async } from "react-select";

import { Alert } from "../../SharedResources/components/Alert";
import { Label } from "../../SharedResources/components/Label";
import { DropdownProps, debounce, hideDropDown } from "../../SharedResources/utils/ContainerUtils";

import "react-select/dist/react-select.css";
import "../../SharedResources/ui/Dropdown.scss";

export class DropdownReference extends Component<DropdownProps> {
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
            (document.getElementsByClassName("widget-dropdown-reference")[0] as HTMLElement).style.overflow = "hidden";
            scrollContainer.addEventListener("scroll", () => { hideDropDown(); });
        }
    }

    componentWillUnmount() {
        const scrollContainer = document.querySelector(".mx-window-body");
        if (scrollContainer && this.props.location === "popup") {
            (document.getElementsByClassName("widget-dropdown-reference")[0] as HTMLElement).style.overflow = "hidden";
            scrollContainer.removeEventListener("scroll", () => { hideDropDown(); });
        }
    }

    private renderSelector() {
        const commonProps = {
            clearable: this.props.isClearable,
            disabled: this.props.isReadOnly,
            onChange: this.props.handleOnchange as () => void,
            ...this.createSelectorProp()
        };

        if (this.props.readOnlyStyle === "control" || (this.props.readOnlyStyle === "text" && !this.props.isReadOnly)) {
            const loadOptions = (input?: string) => (this.props.asyncData as (input?: string) => Promise<{}>)(input);

            return createElement("div", {
                className: "widget-dropdown-reference",
                onClick: this.setDropdownSize
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
                createElement(Alert, { className: "widget-dropdown-reference-alert" }, this.props.alertMessage)
            );
        } else {
            return createElement("p", { className: classNames("form-control-static", "read-only-text") },
                this.props.selectedValue ? this.props.selectedValue.label : "");
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
        if (this.props.selectedValue && this.props.selectedValue.value) {
            return { value: this.props.selectedValue };
        }

        return { placeholder: this.props.emptyOptionCaption };
    }
}
