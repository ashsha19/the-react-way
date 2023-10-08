import * as React from 'react';
import { useRWContext } from '../context/execution-context';
import * as hooks from '../utility/hooks-utility';
// import { useContext } from 'react';


export interface IRWContextBasedComponentProps {
    contextName?: string;
}

export interface IRWInternalComponentProps extends IRWContextBasedComponentProps {
    children?: React.ReactNode | React.ReactElement | React.ReactElement[];
}

export interface IRWComponentProps {
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
    const cloneCallbackProps = hooks.um<{}>((context, callbackProps) => {
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
    }, [contextName, component, callbackProps], context, callbackProps);

    // const cloneValueProps = React.useMemo(() => {
    const cloneValueProps = hooks.um<{}>((context, valueProps) => {
        const _cloneProps = {};

        for (const property in valueProps) {
            _cloneProps[property] = valueProps[property](context.data, context.index);
        }

        return _cloneProps;
        // }, [contextName, component, valueProps]);
    }, [contextName, component, valueProps], context, valueProps);

    return React.cloneElement(component, { ...cloneValueProps, ...cloneCallbackProps });
    // return (component);
}

// export const c = <RWComponent component={<input type='text' />} onClick={(data, index, e) => { }} />;
