import React from "react";
import { IEventContext, useRWEventContext } from "../../context/event-context";
import { IInternalComponentProps } from "../rw-component";
import { um } from "../../utility/hooks-utility";

export interface IEventCollectorProps extends IInternalComponentProps {
    collect: string;
    onCollect?: (eventName: string, event: Event) => void
}

export function EventCollector(props: IEventCollectorProps) {
    const [eventBaseContext] = useRWEventContext(props.contextName);
    const eventsToCollect = um(() => props.collect.split(',').map(eventName => eventName.toLowerCase()), [props.collect]);

    const children = um((eventBaseContext: IEventContext) => {
        return React.Children.toArray(props.children).map((child: React.ReactElement) => {
            const _props = { ...child.props };

            eventsToCollect.forEach((eventName) => {
                const _eName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);

                _props[_eName] = (e) => {
                    props.onCollect?.(_eName, e);

                    const _ret = child.props[_eName]?.(e);

                    eventBaseContext.eventCollectorMap[eventName]?.forEach(handler => {
                        handler(e);
                    });

                    return _ret;
                }
            });

            return React.cloneElement(child, _props);
        });
    }, [props.collect], eventBaseContext);

    return <>{children}</>;
}
