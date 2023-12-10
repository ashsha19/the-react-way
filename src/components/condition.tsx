import * as React from 'react';
import { useRWContext } from '../context/execution-context';
import { IInternalComponentProps } from './rw-component';
// import { IRWComponentProps } from './rw-component';

interface IConditionProps extends IInternalComponentProps {
    condition: (data: any, index: number) => boolean;
}

export function Condition(props: IConditionProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    const data = lastContext.data;
    const index = lastContext.index;
    let children = props.children;

    lastContext.result = props.condition(data, index);
    return <>{children}</>;
}


// fix issue with react hook functions with JS libraries
// https://stackoverflow.com/questions/56663785/invalid-hook-call-hooks-can-only-be-called-inside-of-the-body-of-a-function-com
