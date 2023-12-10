import * as React from "react";
import { log } from "../utility/log-utility";
import { ue } from "../utility/hooks-utility";

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
    updateSignal?: any;
}

// export const ExecutionContext = React.createContext<IExecutionContext>({});
const ContextMap: {
    [key: string]: RWContext
} = {};

export function useRWContext(contextName: string = 'default'): [IExecutionContext, RWContext] {
    let [reactContext, isParentContextComponent] = React.useMemo(() => {
        let _isParentContextComponent = false;

        if (!contextName) {
            // return ExecutionContext;
            contextName = 'default';
        }

        if (!ContextMap[contextName]) {
            ContextMap[contextName] = React.createContext<IExecutionContext>({});
            _isParentContextComponent = true;
        }

        return [ContextMap[contextName], _isParentContextComponent];
    }, [contextName]);

    // // removing reference of context object on unmount
    // ue(() => {
    //     return () => {
    //         if (isParentContextComponent) {
    //             ContextMap[contextName] = null;
    //             delete ContextMap[contextName];
    //         }
    //     }
    // }, []);

    // log.message('RWContext', reactContext, ContextMap);
    const lastContext = React.useContext(reactContext);

    return [lastContext, reactContext];
}