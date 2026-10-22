import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cn } from "@/lib/utils"
import "./Button.scss"

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"

type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"

type ButtonProps = ButtonPrimitive.Props & {
  variant?: ButtonVariant
  size?: ButtonSize
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={(state: ButtonPrimitive.State) =>
        cn(
          "button",
          `button--${variant}`,
          `button--size-${size}`,
          typeof className === "function" ? className(state) : className
        )
      }
      {...props}
    />
  )
}

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
