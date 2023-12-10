import React from 'react';
import { IInternalComponentProps } from '../rw-component';
import { RWDataContext } from '../rw-data-context';
import { OperationStatus } from '../../context/execution-context';

interface IReadStorage extends IInternalComponentProps {
    type: 'local' | 'session';
    storageKey: string;
}

export function ReadStorage(props: IReadStorage) {
    const storageType = props.type + 'Storage';
    const data = window[storageType][props.storageKey];

    return <RWDataContext contextName={props.contextName} data={data} status={OperationStatus.Completed}>{props.children}</RWDataContext>;
}