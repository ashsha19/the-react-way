import * as React from 'react';
import { OperationStatus, useRWContext } from '../context/execution-context';
import { IInternalComponentProps } from './rw-component';
import { log } from '../utility/log-utility';
import * as hooks from '../utility/hooks-utility';

interface IRWDataContextProps extends IInternalComponentProps {
    data?: any;
    index?: number;
    status?: OperationStatus;
    select?: (data: { [key: string]: any }, index: number) => any;
    filter?: (data: { [key: string]: any }, index: number) => boolean;
    transform?: (data: any) => any;
    updateSignal?: any;
}

export function RWDataContext(props: IRWDataContextProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext, ExecutionContext] = useRWContext(props.contextName);
    let data = props.data;
    let status = props.status;
    let index = props.index;

    if (data === undefined) {
        data = lastContext.data;
    }

    if (index === undefined) {
        index = lastContext.index;
    }

    if (status === undefined) {
        status = lastContext.status;
    }

    if (status === undefined) {
        status = OperationStatus.Dormant;
    }

    if (props.transform !== undefined) {
        // data = React.useMemo(() => props.transform(data), [props.updateSignal]);
        data = hooks.um((data) => props.transform(data), [props.updateSignal, lastContext.updateSignal], data);
    }

    if (props.filter !== undefined) {
        // data = React.useMemo(() => data?.filter((item, index) => props.filter(item, index)), [props.updateSignal]);
        data = hooks.um((data) => data?.filter((item, index) => props.filter(item, index)), [props.updateSignal, lastContext.updateSignal], data);
    }

    if (props.select !== undefined) {
        // data = React.useMemo(() => data?.map((item, index) => props.select(item, index)), [props.updateSignal]);
        data = hooks.um((data) => data?.map((item, index) => props.select(item, index)), [props.updateSignal, lastContext.updateSignal], data);
    }

    const contextValue = hooks.um((data) => {
        return { data, index, status, updateSignal: props.updateSignal };
    }, [data, index, status, props.updateSignal, lastContext.updateSignal], data);

    return <ExecutionContext.Provider value={contextValue}>
        {/* {propData} */}
        {props.children}
    </ExecutionContext.Provider>;
}


// fix issue with react hook functions with JS libraries
// https://stackoverflow.com/questions/56663785/invalid-hook-call-hooks-can-only-be-called-inside-of-the-body-of-a-function-com
