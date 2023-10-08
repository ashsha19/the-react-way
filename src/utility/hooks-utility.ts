import { DependencyList, useCallback, useEffect, useMemo } from 'react';

export function ue(callback: (...params: any) => any, dependencies: DependencyList, ...params) {
    const boundCallback = callback.bind(null, ...params);
    useEffect(boundCallback, dependencies);
}

// not yet used and tested
export function uc(callback: (...params: any) => any, dependencies: DependencyList, ...params) {
    const args = [...callback.arguments, ...params];
    const boundCallback = callback.bind(null, ...args);
    return useCallback(boundCallback, dependencies);
}

export function um<T>(callback: (...params: any) => any, dependencies: DependencyList, ...params): T {
    const boundCallback = callback.bind(null, ...params);
    return useMemo<T>(boundCallback, dependencies);
}