import React from 'react';
import { IInternalComponentProps } from '../rw-component';
import { um } from '../../utility/hooks-utility';
import { ReadStorage } from './read-storage';
import { IHttpGetProps } from '../http/get';
import { IHttpPostProps } from '../http/post';
import { IHttpPutProps } from '../http/put';
import { WriteStorage } from './write-storage';

interface ICacheStorage extends IInternalComponentProps {
    type: 'local' | 'session';
    storageKey: string;
    validFor: number;
    children: React.ReactElement<IHttpGetProps | IHttpPostProps | IHttpPutProps>;
}

export function CacheStorage(props: ICacheStorage) {
    const storageType = props.type + 'Storage';
    const expiryTime = window[storageType][props.storageKey + '_expiry'];

    let expired = !expiryTime;

    if (!expiryTime) {
        const expiryTime = new Date();
        expiryTime.setSeconds(expiryTime.getSeconds() + props.validFor);
        window[storageType][props.storageKey + '_expiry'] = expiryTime.getTime();
    }

    if (props.validFor) {
        const currentTime = new Date();
        expired = currentTime >= new Date(window[storageType][props.storageKey + '_expiry']);
    }

    const children = um(() => {
        let _c;

        if (expired) {
            const _childrenOfchild = React.Children.toArray(props.children.props.children).
                push(<WriteStorage contextName={props.contextName} updateSignal={props.updateSignal}
                    storageKey={props.storageKey} type={props.type}></WriteStorage>);

            _c = React.createElement(props.children.type, props.children.props, _childrenOfchild);
        }
        else {
            _c = <ReadStorage contextName={props.contextName} updateSignal={props.updateSignal}
                storageKey={props.storageKey} type={props.type}>
                {props.children.props.children}
            </ReadStorage>;
        }

        return _c;
    }, [expired]);

    return <>{children}</>;
}