"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useSearchParams } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";
import { useQueryParams } from "../hooks/useQueryParams";

type Props = {
  title: string;
  description?: string;
  query: string;
  children?: React.ReactNode;
};

export const Modal = forwardRef<React.ElementRef<typeof DialogContent>, Props>(
  ({ children, description, title, query }, ref) => {
    const [isMounted, setMounted] = useState(false);
    const { pushQuery } = useQueryParams();
    const isOpen = useSearchParams().get("modal") === query;

    useEffect(() => {
      setMounted(true);
    }, []);
    if (!isMounted) return null;

    return (
      <Dialog open={isOpen} onOpenChange={() => pushQuery({ modal: [] })}>
        <DialogContent ref={ref}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);
