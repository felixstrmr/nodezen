import { useQueryStates } from "nuqs";
import {
  createLoader,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export type ExecutionsParams = {
  start: number;
  end: number;
  instanceId: string;
  workflowId: string;
  status: string[];
  mode: string[];
};

export const executionsParams = {
  start: parseAsInteger.withDefault(0),
  end: parseAsInteger.withDefault(100),
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
