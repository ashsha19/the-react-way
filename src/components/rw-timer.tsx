import * as React from 'react';
import { useRWContext } from '../context/execution-context';
import { IRWInternalComponentProps } from './rw-component';
import * as hooks from '../utility/hooks-utility';

interface IRWTimerProps extends IRWInternalComponentProps {
    internal: number;
    until?: (data: any, index: number) => boolean;
    cancelWith?: any;
    // children?: React.ReactNode;
}

export function RWTimer(props: IRWTimerProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext, ExecutionContext] = useRWContext(props.contextName);
    const data = lastContext.data;

    const [timeoutInfo, updateTimeoutNumber] = React.useState({ timeoutNumber: 0, index: 0 });

    // React.useEffect(() => {
    hooks.ue((data) => {
        let _timeoutNumber = 0;
        let counter = 0;

        function startTimeout() {
            return setTimeout(() => {
                if (props.until !== undefined) {
                    if (props.until(data, counter)) {
                        _timeoutNumber = startTimeout();
                    }
                }
                else {
                    _timeoutNumber = startTimeout();
                }

                counter++;
                updateTimeoutNumber({ timeoutNumber: _timeoutNumber, index: counter });
            }, props.internal);
        }

        _timeoutNumber = startTimeout();
        updateTimeoutNumber({ timeoutNumber: _timeoutNumber, index: counter });

        return () => {
            clearTimeout(timeoutInfo.timeoutNumber);
        };
        // }, [props.internal]);
    }, [props.internal], data);

    React.useEffect(() => {
        if (props.cancelWith !== undefined) {
            clearTimeout(timeoutInfo.timeoutNumber);
        }
    }, [props.cancelWith]);

    return timeoutInfo.timeoutNumber > 0 ?
        <ExecutionContext.Provider value={{ data, index: timeoutInfo.index }}>
            {/* changing key of fragment component to initiate rerender */}
            <React.Fragment key={timeoutInfo.timeoutNumber}>{props.children}</React.Fragment>
        </ExecutionContext.Provider> : null;
}
