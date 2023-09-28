"use client";

import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

const variants = cva(
  "flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "text-slate-500 hover:text-slate-600",
        success: "text-emerald-500 hover:text-emerald-600",
        destructive: "text-rose-500 hover:text-rose-600",
      },
      size: {
        default: "w-4 h-4",
        md: "w-6 h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type VariantsProps = VariantProps<typeof variants>;

type Props = VariantsProps & {
  icon: LucideIcon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ icon: Icon, size, variant, ...rest }: Props, ref) => {
    return (
      <button className={cn(variants({ variant }))} {...rest} ref={ref}>
        <Icon className={cn(variants({ size, variant }))} />
      </button>
    );
  }
);
