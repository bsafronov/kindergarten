"use client";

import { CreateGroupFormModal } from "@/features/group";
import { useEffect, useState } from "react";

export function ModalProvider() {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateGroupFormModal />
    </>
  );
}
