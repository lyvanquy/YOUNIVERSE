import { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "right" | "top";
}

export default function Tooltip({ content, children, side = "right" }: TooltipProps) {
  return (
    <span className="tooltip-wrapper">
      {children}
      <span className={`tooltip tooltip--${side}`}>{content}</span>
    </span>
  );
}
