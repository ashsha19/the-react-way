import * as React from "react";
import { log } from "../utility/log-utility";
import { ue } from "../utility/hooks-utility";

export type RWEventContext = React.Context<IEventContext>;

export interface IEventContext {
    eventCollectorMap: {
        [event: string]: ((...args) => any)[]
    }
}

const ContextMap: {
    [key: string]: RWEventContext
} = {};

export function useRWEventContext(contextName: string = 'default'): [IEventContext, RWEventContext] {
    let [reactContext, isParentContextComponent] = React.useMemo(() => {
        let _isParentContextComponent = false;

        if (!contextName) {
            // return ExecutionContext;
            contextName = 'default';
        }

        if (!ContextMap[contextName]) {
            ContextMap[contextName] = React.createContext<IEventContext>({ eventCollectorMap: {} });
            _isParentContextComponent = true;
        }

        return [ContextMap[contextName], _isParentContextComponent];
    }, [contextName]);

    // removing reference of context object on unmount
    ue(() => {
        return () => {
            if (isParentContextComponent) {
                ContextMap[contextName] = null;
                delete ContextMap[contextName];
            }
        }
    }, []);

    // log.message('RWEventContext', reactContext, ContextMap);
    const lastContext = React.useContext(reactContext);

    return [lastContext, reactContext];
}