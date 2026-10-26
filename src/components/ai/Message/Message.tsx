import { clsx } from "clsx";
import type { ComponentProps } from "react";
import "./Message.scss";

type MessageAlign = "start" | "end";

type MessageProps = ComponentProps<"div"> & {
    align?: MessageAlign;
};

function MessageGroup({ className, ...props }: ComponentProps<"div">) {
    return <div data-slot="message-group" className={clsx("message__group", className)} {...props} />;
}

function Message({ className, align = "start", ...props }: MessageProps) {
    return (
        <div data-slot="message" data-align={align} className={clsx("message", className)} {...props} />
    );
}

function MessageAvatar({ className, ...props }: ComponentProps<"div">) {
    return <div data-slot="message-avatar" className={clsx("message__avatar", className)} {...props} />;
}

function MessageContent({ className, ...props }: ComponentProps<"div">) {
    return <div data-slot="message-content" className={clsx("message__content", className)} {...props} />;
}

function MessageHeader({ className, ...props }: ComponentProps<"div">) {
    return <div data-slot="message-header" className={clsx("message__header", className)} {...props} />;
}

function MessageFooter({ className, ...props }: ComponentProps<"div">) {
    return <div data-slot="message-footer" className={clsx("message__footer", className)} {...props} />;
}

export { Message, MessageGroup, MessageAvatar, MessageContent, MessageHeader, MessageFooter };
export type { MessageProps, MessageAlign };
