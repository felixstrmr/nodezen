import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";

export const executionsFilterParams = {
  instanceId: parseAsString,
  workflowId: parseAsString,
};

export function useExecutionsFilterParams() {
  const [filter, setFilter] = useQueryStates(executionsFilterParams);

  return {
    filter,
    setFilter,
  };
}

export const loadExecutionsFilterParams = createLoader(executionsFilterParams);
