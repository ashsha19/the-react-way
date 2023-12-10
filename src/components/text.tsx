import * as React from 'react';
import { useRWContext } from '../context/execution-context';
import { IContextBasedComponentProps } from './rw-component';
import * as hooks from '../utility/hooks-utility';

interface ITextProps extends IContextBasedComponentProps {
    fieldname?: string;
    select?: (data: { [key: string]: any }, index: number) => string | number;
}

export function Text(props: ITextProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    const data = lastContext.data;
    const index = lastContext.index;

    if (props.select !== undefined) {
        // return React.useMemo(() => props.select(data, index), [props.updateSignal]);
        return hooks.um((data) => props.select(data, index), [props.updateSignal, lastContext.updateSignal], data);
    }

    return data?.[props.fieldname];
}


// fix issue with react hook functions with JS libraries
// https://stackoverflow.com/questions/56663785/invalid-hook-call-hooks-can-only-be-called-inside-of-the-body-of-a-function-com
