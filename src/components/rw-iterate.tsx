import * as React from 'react';
import { IExecutionContext, useRWContext } from '../context/execution-context';
import { IInternalComponentProps } from './rw-component';
import * as hooks from '../utility/hooks-utility';
import { RWDataContext } from './rw-data-context';

export interface IIterateProps extends IInternalComponentProps {
    until?: (data: any[], index: number) => boolean;
    updateSignal?: any;
}

export function Iterate(props: IIterateProps) {
    // let lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    console.log('Iterate', lastContext);

    const elements = hooks.um((props: IIterateProps, lastContext: IExecutionContext) => {
        let elements = [];
        let counter = 0;

        if (props.until !== undefined) {
            while (props.until(lastContext.data, counter)) {
                let dataItem = lastContext.data && lastContext.data[counter];

                if (!dataItem)
                    dataItem = lastContext.data;

                elements.push(prepareElements(props.contextName, dataItem, counter, props.children, lastContext.updateSignal));
                counter++;
            }
        }
        else {
            if (lastContext.data?.length) {
                elements = lastContext.data.map((item, index) => prepareElements(props.contextName, item, index, props.children, lastContext.updateSignal));
            }
        }

        return elements;
        // }, props.updateSignal === undefined ? props.updateSignal : [props.updateSignal, lastContext.updateSignal], props, lastContext, ExecutionContext);
    }, [props.updateSignal, lastContext.updateSignal], props, lastContext);

    return <>{elements}</>;
}

function prepareElements(
    // ExecutionContext: React.Context<IExecutionContext>, 
    contextName,
    dataItem, index, children, updateSignal) {
    // return <ExecutionContext.Provider key={index} value={{ data: dataItem, index, updateSignal }}>
    //     {children}
    // </ExecutionContext.Provider>;
    return <RWDataContext key={index} contextName={contextName} data={dataItem} index={index} updateSignal={updateSignal}>
        {children}</RWDataContext>;
}
