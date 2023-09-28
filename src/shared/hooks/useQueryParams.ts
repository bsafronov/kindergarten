import { useRouter } from "next/navigation";
import queryString from "query-string";

type Props = {
  [key: string]: string | string[] | boolean;
};

export function useQueryParams() {
  const router = useRouter();

  const pushQuery = (query: Props) => {
    const parsed = queryString.parseUrl(location.href);
    const newUrl = queryString.stringifyUrl(
      {
        url: parsed.url,
        query: {
          ...parsed.query,
          ...query,
        },
      },
      { arrayFormat: "comma" }
    );
    router.push(newUrl);
  };

  return {
    pushQuery,
  };
}
