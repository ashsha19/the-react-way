import React from 'react';
import { IInternalComponentProps } from '../rw-component';
import { RWDataContext } from '../rw-data-context';
import { OperationStatus } from '../../context/execution-context';
import * as hooks from '../../utility/hooks-utility';

interface IReadStorage extends IInternalComponentProps {
    type: 'local' | 'session';
    storageKey: string;
}

export function ReadStorage(props: IReadStorage) {
    const data = hooks.um(() => {
        const storageType = props.type + 'Storage';
        const _data = window[storageType][props.storageKey];

        if (_data !== undefined) {
            return JSON.parse(_data);
        }
    }, [props.storageKey, props.updateSignal]);

    return <RWDataContext contextName={props.contextName} data={data} status={OperationStatus.Completed}>{props.children}</RWDataContext>;
}