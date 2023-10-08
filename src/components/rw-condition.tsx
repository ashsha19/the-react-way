import * as React from 'react';
import { useRWContext } from '../context/execution-context';
import { IRWInternalComponentProps } from './rw-component';
// import { IRWComponentProps } from './rw-component';

interface IRWConditionProps extends IRWInternalComponentProps {
    condition: (data: any, index: number) => boolean;
}

export function RWCondition(props: IRWConditionProps) {
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
