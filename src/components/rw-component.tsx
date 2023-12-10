import * as React from 'react';
import { useRWContext } from '../context/execution-context';
import * as hooks from '../utility/hooks-utility';
import { log } from '../utility/log-utility';
// import { useContext } from 'react';


export interface IContextBasedComponentProps {
    contextName?: string;
    updateSignal?: any;
}

export interface IInternalComponentProps extends IContextBasedComponentProps {
    // children?: React.ReactNode | React.ReactElement | React.ReactElement[];
    children?: React.ReactNode;
}

export interface IRWComponentProps extends IContextBasedComponentProps {
    contextName?: string;
    component: React.ReactElement;
    valueProps?: {
        [key: string]: (data: any, index: number) => any;
    }
    callbackProps?: {
        [key: string]: (...params) => any;
    }
}

export function RWComponent(props: IRWComponentProps) {
    // const context = useContext(ExecutionContext);
    let { contextName, component, valueProps, callbackProps } = props;
    const [context] = useRWContext(contextName);

    valueProps = valueProps || {};
    callbackProps = callbackProps || {};

    // const cloneCallbackProps = React.useMemo(() => {
    const cloneCallbackProps = hooks.um((context, callbackProps) => {
        const _cloneProps = {};

        for (const property in callbackProps) {
            _cloneProps[property] = (...args) => {
                args.push(context.data);
                args.push(context.index);

                return callbackProps[property](...args);
            }
        }

        return _cloneProps;
        // }, [contextName, component, callbackProps]);
    }, [contextName, props.updateSignal, context.updateSignal], context, callbackProps);

    // const cloneValueProps = React.useMemo(() => {
    const cloneValueProps = hooks.um((context, valueProps) => {
        const _cloneProps = {};

        for (const property in valueProps) {
            _cloneProps[property] = valueProps[property](context.data, context.index);
        }

        return _cloneProps;
        // }, [contextName, component, valueProps]);
    }, [contextName, props.updateSignal, context.updateSignal], context, valueProps);

    // log.message('RWComponent', component)

    // return React.cloneElement(component, { ...cloneValueProps, ...cloneCallbackProps });
    return React.createElement(component.type, { key: component.key, ...cloneValueProps, ...cloneCallbackProps }, component.props.children);
    // return (component);
}

// export const c = <RWComponent component={<input type='text' />} onClick={(data, index, e) => { }} />;
