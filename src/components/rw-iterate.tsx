import * as React from 'react';
import { IExecutionContext, useRWContext } from '../context/execution-context';
import { IRWInternalComponentProps } from './rw-component';
import * as hooks from '../utility/hooks-utility';

export interface IRWIterateProps extends IRWInternalComponentProps {
    until?: (data: any[], index: number) => boolean;
    updateSignal?: any;
}

export function RWIterate(props: IRWIterateProps) {
    // let lastContext = React.useContext(ExecutionContext);
    const [lastContext, ExecutionContext] = useRWContext(props.contextName);

    const elements = hooks.um((props: IRWIterateProps, lastContext: IExecutionContext, ExecutionContext) => {
        let elements = [];
        let counter = 0;

        if (props.until !== undefined) {
            while (props.until(lastContext.data, counter)) {
                let dataItem = lastContext.data && lastContext.data[counter];

                if (!dataItem)
                    dataItem = lastContext.data;

                elements.push(prepareElements(ExecutionContext, dataItem, counter, props.children));
                counter++;
            }
        }
        else {
            if (lastContext.data?.length) {
                elements = lastContext.data.map((item, index) => prepareElements(ExecutionContext, item, index, props.children));
            }
        }

        return elements;
    }, props.updateSignal === undefined ? props.updateSignal : [props.updateSignal], props, lastContext, ExecutionContext);

    return <>{elements}</>;
}

function prepareElements(ExecutionContext: React.Context<IExecutionContext>, dataItem, index, children) {
    return <ExecutionContext.Provider key={index} value={{ data: dataItem, index }}>
        {children}
    </ExecutionContext.Provider>;
}
