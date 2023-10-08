import * as React from "react";
import { log } from "../utility/log-utility";

export enum OperationStatus {
    Dormant,
    InProgress,
    Completed,
    Failed
}

export type OperationResult = any;

export type RWContext = React.Context<IExecutionContext>;

export interface IExecutionContext {
    status?: OperationStatus;
    result?: OperationResult;
    data?: any;
    index?: number;
}

// export const ExecutionContext = React.createContext<IExecutionContext>({});
const ContextMap: {
    [key: string]: RWContext
} = {};

export function useRWContext(contextName: string = 'default'): [IExecutionContext, RWContext] {
    let reactContext = React.useMemo(() => {
        if (!contextName) {
            // return ExecutionContext;
            contextName = 'default';
        }

        if (!ContextMap[contextName]) {
            ContextMap[contextName] = React.createContext<IExecutionContext>({});
        }

        return ContextMap[contextName];
    }, [contextName]);

    // reactContext = ExecutionContext;

    log.message('RWContext', reactContext, ContextMap);
    const lastContext = React.useContext(reactContext);

    return [lastContext, reactContext];
}