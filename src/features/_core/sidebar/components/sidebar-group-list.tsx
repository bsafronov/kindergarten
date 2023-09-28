"use client";

import { Group } from "@prisma/client";
import { Loader2, Plus, Users2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { cn } from "@/shared/lib/utils";
import { useParams } from "next/navigation";
import { useGetUserGroups } from "@/features/group/hooks/useGetUserGroups";

export function UserGroupList() {
  const { data, isLoading, isSuccess } = useGetUserGroups<Group[]>();
  const { pushQuery } = useQueryParams();
  const { groupId } = useParams();
  return (
    <div className="border-b">
      <h5 className="px-4 py-1 font-semibold border-b flex items-center justify-between">
        <span>Мои группы </span>
        {isLoading && (
          <Loader2 className="animate-spin w-4 h-4 text-blue-600" />
        )}
        {isSuccess && (
          <span className="text-slate-500 text-xs">{data.length}</span>
        )}
      </h5>
      {isSuccess && (
        <ul className="divide-y divide-slate-50 border-b">
          {data.map((group) => (
            <li key={group.id} className="">
              <Link
                href={`/${group.id}`}
                className={cn(
                  "px-4 py-1 text-sm w-full flex gap-1 items-center text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                  {
                    "text-blue-600 hover:text-blue-700 ": groupId === group.id,
                  }
                )}
              >
                <Users2 className="w-4 h-4" />
                {group.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="p-2 flex justify-center">
        <Button
          className="gap-1"
          variant={"default"}
          onClick={() => pushQuery({ modal: "create-group" })}
        >
          <Plus className="w-4 h-4" />
          Создать группу
        </Button>
      </div>
    </div>
  );
}
