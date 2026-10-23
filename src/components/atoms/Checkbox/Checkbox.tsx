import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { clsx } from "clsx";
import { Check, Minus } from "lucide-react";
import type { CSSProperties } from "react";
import "./Checkbox.scss";

type CheckboxSize = "default" | "sm" | "lg";

type CheckboxProps = CheckboxPrimitive.Root.Props & {
    size?: CheckboxSize | number;
};

const SIZE_SCALE: Record<CheckboxSize, number> = {
    default: 1,
    sm: 0.875,
    lg: 1.125,
};

function Checkbox({ className, style, size = "default", ...props }: CheckboxProps) {
    const scale = typeof size === "number" ? size : SIZE_SCALE[size];
    const sizeStyle = { "--checkbox-size": scale } as CSSProperties;

    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={(state: CheckboxPrimitive.Root.State) =>
                clsx(
                    "checkbox",
                    typeof size === "string" && `checkbox--size-${size}`,
                    typeof className === "function" ? className(state) : className,
                )
            }
            style={(state: CheckboxPrimitive.Root.State) => ({
                ...sizeStyle,
                ...(typeof style === "function" ? style(state) : style),
            })}
            {...props}
        >
            <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="checkbox__indicator">
                {props.indeterminate ? <Minus /> : <Check />}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
export type { CheckboxProps, CheckboxSize };
