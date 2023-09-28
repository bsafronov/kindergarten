"use client";

import { forwardRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { buttonVariants } from "./button";

type Props = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  onAction: (values?: any) => void;
};

export const Confirm = forwardRef<
  React.ElementRef<typeof AlertDialogContent>,
  Props
>(({ onAction, children, description, title, variant }: Props, ref) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent ref={ref}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Вы уверены?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || "Это действие нельзя будет отменить."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            className={buttonVariants({ variant })}
          >
            {variant === "default" ? "Подтвердить" : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
