import React from "react";
import { IInternalComponentProps } from "./rw-component";
import { OperationStatus, useRWContext } from "../context/execution-context";

export function IfTrue(props: IInternalComponentProps) {
    // return <>{props.children}</>;
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return Boolean(lastContext?.result) ? <>{props.children}</> : null;
}

export function Else(props: IInternalComponentProps) {
    // return <>{props.children}</>;
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return Boolean(lastContext?.result) ? null : <>{props.children}</>;
}

export function Complete(props: IInternalComponentProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return lastContext?.status === OperationStatus.Completed ? <>{props.children}</> : null;
}

export function InProgress(props: IInternalComponentProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return lastContext?.status === OperationStatus.InProgress ? <>{props.children}</> : null;
}

export function Failed(props: IInternalComponentProps) {
    // const lastContext = React.useContext(ExecutionContext);
    const [lastContext] = useRWContext(props.contextName);
    return lastContext?.status === OperationStatus.Failed ? <>{props.children}</> : null;
}
