import { ContainerProps } from "../../DropdownReference/components/DropdownReferenceContainer";
import { ContainerProps as ReferenceSetProps } from "../../DropdownReferenceSet/components/DropdownReferenceSetContainer";

export interface AttributeType {
    name: string;
    sort: string;
}

export interface ReferenceOption {
    value?: string | boolean;
    label?: string;
}

export interface DropdownProps {
    styleObject?: object;
    labelWidth: number;
    data: ReferenceOption[];
    labelCaption: string;
    showLabel: boolean;
    emptyOptionCaption: string;
    isClearable: boolean;
    isReadOnly: boolean;
    selectedValue: any;
    className?: string;
    alertMessage: string;
    loadingText: string;
    minimumCharacter: number;
    searchPromptText: string;
    selectType: "normal" | "asynchronous";
    lazyFilter: "startWith" | "contains";
    labelOrientation: "horizontal" | "vertical";
    location: string;
    readOnlyStyle: "control" | "text";
    asyncData: (input?: string) => Promise<{}>;
    handleOnchange?: (selectedOption: ReferenceOption | any) => void;
}

export function hideDropDown() {
    const dropdown = document.getElementsByClassName("Select-menu-outer");
    if (dropdown[0]) {
        (dropdown[0] as HTMLElement).style.visibility = "hidden";
    }
    const activeElement = document.activeElement;
    if (activeElement) {
        (activeElement as HTMLElement).blur();
    }
}

export function debounce(input: (input?: string) => Promise<{}>, wait = 0) {
    let timeout: any = null;
    let resolves: any = null;

    return (...args: []) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            resolves(input(...args));
            resolves = null;
        }, wait);

        return new Promise(resolve => resolves = resolve);
    };
}

export const parseStyle = (style = ""): { [key: string]: string } => {
    try {
        return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }

            return styleObject;
        }, {});
    } catch (error) {
        // tslint:disable-next-line no-console
        window.console.log("Failed to parse style", style, error);
    }

    return {};
};

export const validateProps = (props: ContainerProps | ReferenceSetProps): string => {
    const message: string[] = [];

    if (props.onChangeEvent === "callMicroflow" && !props.onChangeMicroflow) {
        message.push("On change event is set to 'Call a microflow' but no microflow is selected");
    } else if (props.onChangeEvent === "callNanoflow" && !props.onChangeNanoflow.nanoflow) {
        message.push("On change event is set to 'Call a nanoflow' but no nanoflow is selected");
    }

    if (props.source === "microflow" && !props.microflow) {
        message.push("Data source is set as 'microflow' but no microflow is selected");
    } else if (props.source === "nanoflow" && !props.nanoflow.nanoflow) {
        message.push("Data source is set as 'nanoflow' but no nanoflow is selected");
    }

    if (props.showLabel && (props.labelWidth > 11 || props.labelWidth < 1)) {
        message.push("Label width should be a value between 0 and 12");
    }

    if (props.selectType === "asynchronous" && props.minimumCharacter === 0) {
        message.push("Minimal search characters must be greater than 0");
    }

    if (message.length) {
        const errorMessage = `Configuration error in widget: ${message.join(", ")}`;

        return errorMessage;
    }

    return message.join(", ");
};
