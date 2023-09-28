"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/shared/components/modal";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { Group } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(1, { message: "Обязательное поле" }),
});

type SchemaType = z.infer<typeof formSchema>;

export function CreateGroupFormModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: SchemaType) => {
    try {
      const res = await axios.post("/api/groups", values);
      const group = res.data as Group;
      // queryClient.invalidateQueries(["user-groups"]);
      router.refresh();
      router.push(`/${group.id}`);
    } catch {
      toast.error("Ой! Возникла ошибка...");
    }
  };

  return (
    <Modal
      query="create-group"
      title="Создание группы"
      description="Введите название вашей группы в детском саду"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end mt-4">
            <Button>Создать</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
