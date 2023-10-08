import React from "react";

export function getHTTPTemplateChildren(children: React.ReactElement | React.ReactElement[]) {
    let _children = children;

    // let [progressComponent, completeComponent, ...remainingChildren] = React.Children.toArray(children);

    return React.useMemo(() => {
        let progressComponent = null;
        let completeComponent = null;

        React.Children.forEach(_children, (child) => {
            if (child.type === 'RWProgress') {
                progressComponent = child;
            }
            else if (child.type === 'RWComplete') {
                completeComponent = child;
            }
        });
        _children = null;
        return [progressComponent, completeComponent];
    }, [children]);
}