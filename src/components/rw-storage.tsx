import * as React from 'react';
import { OperationStatus } from '../context/execution-context';
import { RWData } from './rw-data';
import { RWEvent } from './rw-event';
import { IRWGetProps } from './rw-get';
import { IRWInternalComponentProps } from './rw-component';

interface IRWStorageProps extends IRWInternalComponentProps {
    storageKey: string;
    type: 'local' | 'session';
    validTill?: Date;
    children: React.ReactElement<IRWGetProps>;
}

export function RWStorage(props: IRWStorageProps) {
    // const lastContext = React.useContext(ExecutionContext);
    // const data = lastContext.data;
    const data = localStorage[props.storageKey];
    let expired = false;

    if (props.validTill) {
        expired = props.validTill <= new Date();
    }

    let childrenOfChildren = React.Children.toArray(props.children.props.children);
    childrenOfChildren = [<RWEvent onCompleted={(data) => {
        localStorage[props.storageKey] = data;
    }} />, ...childrenOfChildren];

    if (expired) {
        return <>{props.children}</>;
    }
    else {
        return <RWData contextName={props.contextName} data={data} status={OperationStatus.Completed}>{childrenOfChildren}</RWData>;
    }
}
