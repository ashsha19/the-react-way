import React from "react";
import { IRWInternalComponentProps } from "./rw-component";
import { OperationStatus, useRWContext } from "../context/execution-context";

export function RWIfTrue(props: IRWInternalComponentProps) {
    // return <>{props.children}</>;
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return Boolean(lastContext?.result) ? <>{props.children}</> : null;
}

export function RWElse(props: IRWInternalComponentProps) {
    // return <>{props.children}</>;
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return Boolean(lastContext?.result) ? null : <>{props.children}</>;
}

export function RWComplete(props: IRWInternalComponentProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return lastContext?.status === OperationStatus.Completed ? <>{props.children}</> : null;
}

export function RWInProgress(props: IRWInternalComponentProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return lastContext?.status === OperationStatus.InProgress ? <>{props.children}</> : null;
}

export function RWFailed(props: IRWInternalComponentProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return lastContext?.status === OperationStatus.Failed ? <>{props.children}</> : null;
}
