import * as React from 'react';
import axios from "axios";
import { RWDataContext } from '../rw-data-context';
import { OperationStatus, useRWContext } from '../../context/execution-context';
import { IInternalComponentProps } from '../rw-component';
import { log } from '../../utility/log-utility';
import * as hooks from '../../utility/hooks-utility';

export interface IHttpPostProps extends IInternalComponentProps {
    endpoint: string;
    header?: { [key: string]: string };
    body?: any;
    // initiateSignal?: any;
    cancelSignal?: any;
}

export function HttpPost(props: IHttpPostProps) {
    const [lastContext, ExecutionContext] = useRWContext(props.contextName);
    let [{ data, status, updateSignal }, setDataContextObj] = React.useState({
        data: null,
        status: OperationStatus.Dormant,
        updateSignal: null
    });

    const abortController = React.useMemo(() => {
        return new AbortController();
    }, [props.updateSignal, lastContext.updateSignal]);

    hooks.ue((props: IHttpPostProps) => {
        // React.useEffect(() => {
        setDataContextObj((prevState) => {
            return { data: prevState.data, status: OperationStatus.InProgress, updateSignal: prevState.updateSignal }
        });

        (async () => {
            try {
                const { data, status } = await axios.post(props.endpoint,
                    props.body, {
                    headers: props.header || {
                        "Content-Type": 'application/json'
                    },
                    signal: abortController.signal
                });
                log.message('HttpPost', data);
                // lastContext.updateSignal = !lastContext.updateSignal;

                setDataContextObj((prevState) => {
                    return { data: data, status: OperationStatus.Completed, updateSignal: !prevState.updateSignal }
                });
            }
            catch {
                setDataContextObj((prevState) => {
                    return { data: prevState.data, status: OperationStatus.Failed, updateSignal: prevState.updateSignal }
                });
            }
        })();

        return () => {
            abortController?.abort();
        };
        // }, [props.initiateSignal]);
    }, [props.updateSignal, lastContext.updateSignal], props);

// checking for cancel signal to cancel request
    React.useEffect(() => {
        if (props.cancelSignal !== undefined) {
            abortController?.abort();
        }
    }, [props.cancelSignal]);

    return <RWDataContext contextName={props.contextName} data={data} status={status} updateSignal={updateSignal}>
        {props.children}
    </RWDataContext>;
}


// fix issue with react hook functions with JS libraries
// https://stackoverflow.com/questions/56663785/invalid-hook-call-hooks-can-only-be-called-inside-of-the-body-of-a-function-com
