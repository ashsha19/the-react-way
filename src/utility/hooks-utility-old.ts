import { DependencyList, useCallback, useEffect, useMemo } from 'react';

export const hooks = {
    ue: (callback: (...params: any) => any, dependencies: DependencyList, ...params) => {
        const boundCallback = callback.bind(null, ...params);
        useEffect(boundCallback, dependencies);
    },
    uc: (callback: (...params: any) => any, dependencies: DependencyList, ...params) => {
        const args = [...callback.arguments, ...params];
        const boundCallback = callback.bind(null, ...args);
        return useCallback(boundCallback, dependencies);
    },
    um: <T>(callback: (...params: any) => any, dependencies: DependencyList, ...params): T => {
        const boundCallback = callback.bind(null, ...params);
        return useMemo<T>(boundCallback, dependencies);
    },
    _um: <T>(callback: (...params: any) => any, dependencies: DependencyList, ...params): T => {
        const callbackRef = useMemo(() => new Callback(), []);

        callbackRef.updateParams(params);
        callbackRef.updateCallback(callback);

        return useMemo<T>(callbackRef.getCallback(), dependencies);
    }
};

class Callback {
    private _cb: (...params: any) => any;
    protected args = [];

    public updateCallback(callback: (...params: any) => any) {
        Callback.prototype['_cb'] = callback;
    }

    public getCallback() { return this._cb; }

    public updateParams(params: any[]) {
        this.args = params;
    }
}
