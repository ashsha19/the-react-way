import React from "react";
import { useRWEventContext } from "../../context/event-context";
import { IInternalComponentProps } from "../rw-component";

export interface IEventBaseProps extends IInternalComponentProps {

}

export function EventBase(props: IEventBaseProps) {
    // just initialize the context for collector and emitter to use
    const [eventBaseContext, EventContext] = useRWEventContext(props.contextName);

    return <EventContext.Provider value={eventBaseContext}>{props.children}</EventContext.Provider>;
}
