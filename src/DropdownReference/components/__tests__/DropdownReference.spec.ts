import { shallow } from "enzyme";
import { createElement } from "react";
import * as classNames from "classnames";

import Select from "react-select";
import { Label } from "../../../SharedResources/components/Label";
import { DropdownReference } from "../DropdownReference";
import { DropdownProps } from "../../../SharedResources/utils/ContainerUtils";
import { Alert } from "../../../SharedResources/components/Alert";

describe("DropdownReference", () => {
    const render = (props: DropdownProps) => shallow(createElement(DropdownReference, props));
    const ReferenceProps: DropdownProps = {
        asyncData: jasmine.any(Function),
        emptyOptionCaption: "Select city",
        labelWidth: 3,
        data: [ { value: "KampalaId" , label: "kampala" }, { value: "AmsterdamId" , label: "Amsterdam" } ],
        labelCaption: "City",
        location: "content",
        showLabel: true,
        isClearable: true,
        isReadOnly: false,
        selectType: "normal",
        lazyFilter: "startWith",
        selectedValue: { value: "Kampala" , label: "kampalaId" } || null,
        handleOnchange: jasmine.createSpy("onClick"),
        readOnlyStyle: "control",
        labelOrientation: "horizontal",
        alertMessage: "No text",
        loadingText: "loading",
        minimumCharacter: 1,
        searchPromptText: "Type to search"
    };

    it("renders the structure correctly", () => {
        const DropdownReferenceComponent = render(ReferenceProps);

        expect(DropdownReferenceComponent).toBeElement(
            createElement(Label, { caption: "City" , orientation: "horizontal" , width: 3 },
                createElement("div", { className: classNames("widget-dropdown-reference", "has-error"), onClick: jasmine.any(Function) },
                createElement(Select, {
                    clearable: true,
                    noResultsText: "No results found",
                    disabled: false,
                    value: { value: "Kampala" , label: "kampalaId" },
                    onChange: jasmine.any(Function) as any,
                    clearValueText: "Clear value",
                    options: [ { value: "KampalaId" , label: "kampala" }, { value: "AmsterdamId" , label: "Amsterdam" } ]
                }),
                createElement(Alert, { className: "widget-dropdown-type-ahead-alert", bootstrapStyle: "danger" }, "No text"))
            )
        );
    });

    it("with no label caption renders the structure correctly", () => {
        const DropdownReferenceComponent = render(ReferenceProps);

        DropdownReferenceComponent.setProps({ labelCaption: "", showLabel: false });
        expect(DropdownReferenceComponent).toBeElement(
            createElement("div", { className: classNames("widget-dropdown-reference", "has-error"), onClick: jasmine.any(Function) },
            createElement(Select, {
                clearable: true,
                noResultsText: "No results found",
                disabled: false,
                value: { value: "Kampala" , label: "kampalaId" },
                onChange: jasmine.any(Function) as any,
                clearValueText: "Clear value",
                options: [ { value: "KampalaId" , label: "kampala" }, { value: "AmsterdamId" , label: "Amsterdam" } ]
                }),
                createElement(Alert, { className: "widget-dropdown-type-ahead-alert", bootstrapStyle: "danger" }, "No text"))
        );
    });
});
