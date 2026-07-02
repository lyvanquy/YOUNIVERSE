import type { ReactNode } from "react";

import { cx } from "../lib/ui";

const toneMap = {
  neutral: "badge--neutral",
  blue: "badge--blue",
  amber: "badge--amber",
  green: "badge--green",
  red: "badge--red",
  purple: "badge--purple",
};

export default function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof toneMap;
}) {
  return <span className={cx("badge", toneMap[tone])}>{children}</span>;
}
