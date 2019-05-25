import { Route } from "dva/router";

import { LoginPage, LoginComponent } from "./login";

export { LoginPage, LoginComponent };

export function loginRoutes() {
    return (
        <Route
            path={`/login`}
            render={({ match }) => (
                <>
                    <Route path={match.path} component={LoginPage} />
                </>
            )}
        />
    );
}