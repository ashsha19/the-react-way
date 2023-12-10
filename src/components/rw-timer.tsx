import * as React from 'react';
import { useRWContext } from '../context/execution-context';
import { IInternalComponentProps } from './rw-component';
import * as hooks from '../utility/hooks-utility';

interface ITimerProps extends IInternalComponentProps {
    internal: number;
    until?: (data: any, index: number) => boolean;
    cancelWith?: any;
}

export function Timer(props: ITimerProps) {
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
    
    // clear timeout if any, when unmount
    React.useEffect(() => {
        clearTimeout(timeoutInfo.timeoutNumber);
    }, []);

    return timeoutInfo.timeoutNumber > 0 ?
        <ExecutionContext.Provider value={{ data, index: timeoutInfo.index, updateSignal: timeoutInfo.timeoutNumber }}>
            {/* changing key of fragment component to initiate rerender */}
            <React.Fragment key={timeoutInfo.timeoutNumber}>{props.children}</React.Fragment>
        </ExecutionContext.Provider> : null;
}
