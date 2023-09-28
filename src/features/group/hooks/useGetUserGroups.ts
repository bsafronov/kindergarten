import { Group } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetUserGroups<T>() {
  return useQuery<T>({
    queryKey: ["user-groups"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/groups`);
      return data;
    },
  });
}
