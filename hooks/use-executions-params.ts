import { useQueryStates } from "nuqs";
import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";

export const executionsParams = {
  instanceId: parseAsString,
  workflowId: parseAsString,
  status: parseAsArrayOf(parseAsString),
  mode: parseAsArrayOf(parseAsString),
};

export function useExecutionsParams() {
  const [params, setParams] = useQueryStates(executionsParams, {
    shallow: false,
  });

  return {
    params,
    setParams,
  };
}

export const loadExecutionsParams = createLoader(executionsParams);
