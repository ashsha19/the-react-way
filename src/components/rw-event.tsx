import * as React from 'react';
import { OperationStatus, useRWContext } from '../context/execution-context';
import { IRWContextBasedComponentProps } from './rw-component';
import { log } from '../utility/log-utility';

interface IRWEventProps extends IRWContextBasedComponentProps {
    onProgress?: () => void;
    onCompleted?: (data: any, index?: number) => void;
    onFailed?: () => void;
}

export function RWEvent(props: IRWEventProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    const status = lastContext.status;
    const data = lastContext.data;
    const index = lastContext.index;

    React.useEffect(() => {
        log.message('RWEvent.OperationStatus: ' + status);
        switch (status) {
            case OperationStatus.InProgress:
                // log.message('RWEvent.onProgress', data);
                if (props.onProgress)
                    props.onProgress();
                break;
            case OperationStatus.Completed:
                if (props.onCompleted)
                    props.onCompleted(data, index);
                break;
            case OperationStatus.Failed:
                if (props.onFailed)
                    props.onFailed();
                break;
        }
    }, [status]);

    return null;
}
