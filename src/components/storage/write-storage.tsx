import React from 'react';
import { IInternalComponentProps } from '../rw-component';
import { RWDataContext } from '../rw-data-context';
import { OperationStatus, useRWContext } from '../../context/execution-context';
import * as hooks from '../../utility/hooks-utility';

interface IWriteStorage extends IInternalComponentProps {
    type: 'local' | 'session';
    storageKey: string;
    data?: any;
}

export function WriteStorage(props: IWriteStorage) {
    const [lastContext] = useRWContext(props.contextName);
    let data = props.data;

    if (data === undefined) {
        data = lastContext.data;
    }

    hooks.um(() => {
        const storageType = props.type + 'Storage';
        window[storageType][props.storageKey] = JSON.stringify(data);
    }, [props.storageKey, props.updateSignal, lastContext.updateSignal]);

    return <RWDataContext contextName={props.contextName} data={data} status={OperationStatus.Completed}>{props.children}</RWDataContext>;
}
