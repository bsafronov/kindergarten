import { SidebarGroupList } from "@/features/group";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Plus } from "lucide-react";

export async function Sidebar() {
  return (
    <Card className="sticky top-0">
      <SidebarGroupList />
      <div className="border-b">
        <h5 className="px-4 py-2">Мои дети</h5>
        <div>{/* TODO:KidList */}</div>
        <div className="p-2 border-t">
          <Button variant={"ghost"} className="gap-1">
            <Plus className="w-4 h-4" />
            Добавить ребёнка
          </Button>
        </div>
      </div>
    </Card>
  );
}
