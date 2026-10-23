import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { clsx } from "clsx";
import type { CSSProperties } from "react";
import "./Button.scss";

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";

type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

type ButtonProps = ButtonPrimitive.Props & {
    variant?: ButtonVariant;
    size?: ButtonSize | number;
};

const SIZE_SCALE: Record<ButtonSize, number> = {
    default: 1,
    xs: 0.75,
    sm: 0.875,
    lg: 1.125,
    icon: 1,
    "icon-xs": 0.75,
    "icon-sm": 0.875,
    "icon-lg": 1.125,
};

function Button({ className, style, variant = "default", size = "default", ...props }: ButtonProps) {
    const scale = typeof size === "number" ? size : SIZE_SCALE[size];
    const sizeStyle = { "--button-size": scale } as CSSProperties;

    return (
        <ButtonPrimitive
            data-slot="button"
            className={(state: ButtonPrimitive.State) =>
                clsx(
                    "button",
                    `button--${variant}`,
                    typeof size === "string" && `button--size-${size}`,
                    typeof className === "function" ? className(state) : className,
                )
            }
            style={(state: ButtonPrimitive.State) => ({
                ...sizeStyle,
                ...(typeof style === "function" ? style(state) : style),
            })}
            {...props}
        />
    );
}

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
