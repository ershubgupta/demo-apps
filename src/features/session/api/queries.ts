import { queryOptions } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/query/query-keys";
import { getCurrentUser } from "./service";

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.session.currentUser,
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
}
