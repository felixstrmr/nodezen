import { useQueryStates } from "nuqs";
import { parseAsArrayOf, parseAsString } from "nuqs/server";

export type ExecutionsParams = {
  instanceId: string;
  workflowId: string;
  status: string[];
  mode: string[];
};

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
