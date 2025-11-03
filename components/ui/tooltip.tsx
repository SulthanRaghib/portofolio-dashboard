"use client";

import * as React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export function Tooltip({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Content
          side="top"
          align="center"
          className="z-50 rounded-md bg-neutral-900 text-white px-2 py-1 text-sm shadow-md"
        >
          {content}
          <RadixTooltip.Arrow className="fill-neutral-900" />
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
