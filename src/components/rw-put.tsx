import * as React from 'react';
import axios from "axios";
import { RWData } from './rw-data';
import { OperationStatus } from '../context/execution-context';
import { IRWInternalComponentProps } from './rw-component';
import { log } from '../utility/log-utility';
import * as hooks from '../utility/hooks-utility';

export interface IRWPutProps extends IRWInternalComponentProps {
    endpoint: string;
    header?: { [key: string]: string };
    body?: any;
    initiateSignal?: any;
    cancelSignal?: any;
    // children?: React.ReactElement | React.ReactElement[];
}

export function RWPut(props: IRWPutProps) {
    // let lastContext = React.useContext(ExecutionContext);
    let [{ data, status }, setContextData] = React.useState({ data: null, status: OperationStatus.Dormant });
    // let children = props.children;

    const abortController = React.useMemo(() => {
        if (props.initiateSignal !== undefined) {
            return new AbortController();
        }
    }, [props.initiateSignal]);

    hooks.ue((props: IRWPutProps) => {
        // React.useEffect(() => {
        if (props.initiateSignal === undefined) {
            return;
        }

        setContextData((prevState) => { return { data: prevState.data, status: OperationStatus.InProgress } });

        (async () => {
            try {
                const { data, status } = await axios.put(props.endpoint,
                    props.body, {
                    headers: props.header || {
                        "Content-Type": 'application/json'
                    },
                    signal: abortController.signal
                });
                log.message(data);
                setContextData((prevState) => { return { data, status: OperationStatus.Completed } });
            }
            catch {
                setContextData((prevState) => { return { data: prevState.data, status: OperationStatus.Failed } });
            }
        })();

        return () => {
            abortController.abort();
        };
        // }, [props.initiateSignal]);
    }, [props.initiateSignal], props);

    React.useEffect(() => {
        if (props.cancelSignal !== undefined) {
            abortController.abort();
        }
    }, [props.cancelSignal]);

    return <RWData contextName={props.contextName} data={data} status={status}>{props.children}</RWData>;
}


// fix issue with react hook functions with JS libraries
// https://stackoverflow.com/questions/56663785/invalid-hook-call-hooks-can-only-be-called-inside-of-the-body-of-a-function-com
