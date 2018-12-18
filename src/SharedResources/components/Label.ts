import { CSSProperties, FunctionComponent, createElement } from "react";
import * as classNames from "classnames";

export interface LabelProps {
    class?: string;
    caption: string;
    width: number;
    style?: CSSProperties;
    orientation?: "horizontal" | "vertical";
}

export const Label: FunctionComponent<LabelProps> = ({ children, class: className, caption: label, style, width: weight, orientation }) => {
    weight = (weight > 11 || weight < 1) ? 3 : weight;
    const labelWeight = orientation === "horizontal" ? `col-sm-${weight}` : "";
    const childrenWeight = orientation === "horizontal" ? `col-sm-${12 - weight}` : "";

    return createElement("div", { className: classNames("form-group", className), style },
        createElement("label", { className: classNames("control-label", labelWeight) }, label),
        createElement("div", { className: `${childrenWeight}` }, children)
    );
};

Label.defaultProps = { width: 3 };
Label.displayName = "Label";
