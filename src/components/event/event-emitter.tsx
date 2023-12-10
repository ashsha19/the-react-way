import React, { useState } from "react";
import { IEventContext, useRWEventContext } from "../../context/event-context";
import { IInternalComponentProps } from "../rw-component";
import { ue, um } from "../../utility/hooks-utility";

export interface IEventEmitterProps extends IInternalComponentProps {
    emit: string;
    handler: (...args) => any
}

export function EventEmitter(props: IEventEmitterProps) {
    const [eventBaseContext, EventContext] = useRWEventContext(props.contextName);
    const [handlerCallback, changeHandler] = useState(props.handler);
    const eventsToHandle = um(() => props.emit.split(','), [props.emit]);

    ue((eventBaseContext: IEventContext) => {
        eventsToHandle.forEach((eventName) => {
            eventBaseContext.eventCollectorMap[eventName].push(props.handler);
        });

        changeHandler(props.handler);

        return () => {
            eventsToHandle.forEach((eventName) => {
                const previousHandlerIndex = eventBaseContext.eventCollectorMap[eventName]?.
                    findIndex(handler => handler === handlerCallback);
                if (previousHandlerIndex !== null && previousHandlerIndex !== -1) {
                    eventBaseContext.eventCollectorMap[eventName].splice(previousHandlerIndex, 1);
                }
            });
        };
    }, [props.emit, props.handler], eventBaseContext);

    return null;
}
