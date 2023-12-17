import * as React from 'react';
import { useRWContext } from '../context/execution-context';
import { IContextBasedComponentProps } from './rw-component';
import { log } from '../utility/log-utility';

interface IRWCallbackProps extends IContextBasedComponentProps {
    once?: boolean;
    call: (data: any, index?: number) => void;
}

export function RWCallback(props: IRWCallbackProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    const status = lastContext.status;
    const data = lastContext.data;
    const index = lastContext.index;

    const [called, setCalled] = React.useState(false);

    if (props.once === undefined || (props.once && !called)) {
        log.message('RWCallback');
        setCalled(true);
        props.call(data, index);
    }

    return null;
}
