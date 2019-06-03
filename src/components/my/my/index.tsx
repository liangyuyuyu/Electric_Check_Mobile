import { Route, Switch, match } from "dva/router";

import { MyPage, MyComponent } from "./my";

export { MyPage, MyComponent };

export function myRoutes() {
    return (
        <Route
            path={`/my`}
            render={({ match }) => (
                <>
                    <Route path={match.path} component={MyPage} />
                </>
            )}
        />
    );
}
