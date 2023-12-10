import React, { ReactNode } from "react";
import { IInternalComponentProps } from "./rw-component";
import { RWDataContext } from "./rw-data-context";
import { Iterate } from "./rw-iterate";
import { useRWContext } from "../context/execution-context";
import { um } from "../utility/hooks-utility";
import { log } from "../utility/log-utility";
import { IHttpGetProps, HttpGet } from "./http/get";
import { HttpPost, IHttpPostProps } from "./http/post";
import { HttpDelete, IHttpDeleteProps } from "./http/delete";
import { HttpPut, IHttpPutProps } from "./http/put";


type AllJSXElementName = keyof React.JSX.IntrinsicElements;

interface JSXElementToProps {
    div: React.HTMLAttributes<HTMLDivElement>;
    p: React.HTMLAttributes<HTMLParagraphElement>;
    ul: React.HTMLAttributes<HTMLUListElement>;
    ol: React.OlHTMLAttributes<HTMLOListElement>;
    table: React.TableHTMLAttributes<HTMLTableElement>;
    select: React.SelectHTMLAttributes<HTMLSelectElement>;

    input: React.InputHTMLAttributes<HTMLInputElement>;
    label: React.LabelHTMLAttributes<HTMLLabelElement>;
    span: React.HTMLAttributes<HTMLSpanElement>;
    a: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    button: React.ButtonHTMLAttributes<HTMLButtonElement>;

    [key: string]: React.HTMLAttributes<HTMLElement>;
}

interface RWElementsToProps {
    get: IHttpGetProps;
    post: IHttpPostProps;
    put: IHttpPutProps;
    delete: IHttpDeleteProps;
}

type RWJSXElementName = (AllJSXElementName & keyof JSXElementToProps) | keyof RWElementsToProps;

export type IRWElementProps<T extends RWJSXElementName> = {
    jsxType?: T;
    data?: any[];

    asIterator?: boolean;

    [key: string]: any;
} & (JSXElementToProps & RWElementsToProps)[T] & IInternalComponentProps;

export function RWElement<T extends RWJSXElementName>(props: IRWElementProps<T>) {
    let { jsxType, data, contextName, asIterator, ...listProps } = props;
    const [lastContext, ExecutionContext] = useRWContext(contextName);

    if (data === undefined) {
        data = lastContext.data;
    }

    const elementProps = um((listProps: IRWElementProps<T>, lastContext, data) => {
        log.message('RWElement.1', jsxType);

        const elementProps = {};
        for (let propKey in listProps) {
            const propValue = listProps[propKey];
            const propValueType = typeof propValue;

            if (propKey.substring(0, 3) === '_on') {
                const actualPropKey = propKey.substring(1);

                elementProps[actualPropKey] = (...args) => propValue?.(...args, data, lastContext.index);
            }
            else if (propKey[0] === '_') {
                const actualPropKey = propKey.substring(1);

                if (propValueType === 'string') {
                    elementProps[actualPropKey] = data?.[propValue];
                }
                else if (propValueType === 'function') {
                    elementProps[actualPropKey] = propValue?.(data, lastContext.index);
                }
            }
            else {
                elementProps[propKey] = propValue;
            }
        }
        return elementProps;
    }, [props.updateSignal, lastContext.updateSignal], listProps, lastContext, data);

    const children = um((children: ReactNode) => {
        return asIterator ? <Iterate>{children}</Iterate> : children;
    }, [asIterator, props.updateSignal, lastContext.updateSignal], props.children);

    // determine the element or component to use
    const elementToRender: React.FunctionComponent | React.ComponentClass | string = um(() => {
        switch (jsxType) {
            case 'get':
                return HttpGet;
            case 'post':
                return HttpPost;
            case 'put':
                return HttpPut;
            case 'delete':
                return HttpDelete;
        }
        return jsxType;
    }, [jsxType]);

    const listElement = React.createElement(elementToRender, elementProps, children);
    log.message('RWElement.2', jsxType, elementProps);
    // const listElement = React.createElement(jsxType, elementProps, children);
    // const newListElement = React.cloneElement(listElement, elementProps, children);

    // log.message('RWElement', jsxType, elementProps, listElement.props, newListElement.props)

    return <RWDataContext contextName={contextName} data={data} updateSignal={lastContext.updateSignal}>
        {listElement}
    </RWDataContext>;
    // <ExecutionContext.Provider value={{ ...lastContext, data }}>
    // </ExecutionContext.Provider>;
}

export const Div = (props: IRWElementProps<'div'>) => <RWElement jsxType="div" {...props}>{props.children}</RWElement>;
export const P = (props: IRWElementProps<'p'>) => <RWElement jsxType="p" {...props}>{props.children}</RWElement>;
export const UL = (props: IRWElementProps<'ul'>) => <RWElement jsxType="ul" {...props}>{props.children}</RWElement>;
export const OL = (props: IRWElementProps<'ol'>) => <RWElement jsxType="ol" {...props}>{props.children}</RWElement>;
export const Table = (props: IRWElementProps<'table'>) => <RWElement jsxType="table" {...props}>{props.children}</RWElement>;
export const THead = (props: IRWElementProps<'thead'>) => <RWElement jsxType="thead" {...props}>{props.children}</RWElement>;
export const TBody = (props: IRWElementProps<'tbody'>) => <RWElement jsxType="tbody" {...props}>{props.children}</RWElement>;
export const TR = (props: IRWElementProps<'tr'>) => <RWElement jsxType="tr" {...props}>{props.children}</RWElement>;
export const TD = (props: IRWElementProps<'td'>) => <RWElement jsxType="td" {...props}>{props.children}</RWElement>;
export const Select = (props: IRWElementProps<'select'>) => <RWElement jsxType="select" {...props}>{props.children}</RWElement>;

export const Input = (props: IRWElementProps<'input'>) => <RWElement jsxType="input" {...props}>{props.children}</RWElement>;
export const Label = (props: IRWElementProps<'label'>) => <RWElement jsxType="label" {...props}>{props.children}</RWElement>;
export const Span = (props: IRWElementProps<'span'>) => <RWElement jsxType="span" {...props}>{props.children}</RWElement>;
export const Anch = (props: IRWElementProps<'a'>) => <RWElement jsxType="a" {...props}>{props.children}</RWElement>;
export const Button = (props: IRWElementProps<'button'>) => <RWElement jsxType="button" {...props}>{props.children}</RWElement>;

export const Get = (props: IRWElementProps<'get'>) => <RWElement jsxType="get" {...props}>{props.children}</RWElement>;
export const Post = (props: IRWElementProps<'post'>) => <RWElement jsxType="post" {...props}>{props.children}</RWElement>;
export const Put = (props: IRWElementProps<'put'>) => <RWElement jsxType="put" {...props}>{props.children}</RWElement>;
export const Delete = (props: IRWElementProps<'delete'>) => <RWElement jsxType="delete" {...props}>{props.children}</RWElement>;
