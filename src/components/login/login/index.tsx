import { Route, Switch } from "dva/router";

import LoginPage, { LoginComponent } from "./login";

export { LoginPage, LoginComponent };

// export default ({ match }) => (
//     <>
//         <Route path={match.path} component={LoginPage} />
//     </>
// );

export function loginRoutes() {
    return (
        <Route
            path={`/login`}
            render={({ match }) => (
                <>
                    <Route path={match.path} component={LoginPage} />
                    {/* <Route path={`${match.path}/activityDetail/:id`} component={ActivityDetailsPage} /> */}
                    {/* <Route
                        path={`${match.path}/list/:id/:cateId`}
                        render={({ match }) => (
                            <>
                                <Route path={match.path} component={FeedbackListPage} />
                                <Route path={`${match.path}/details/:id`} component={FeedbackDetailsPage} />
                            </>
                        )}
                    /> */}
                </>
            )}
        />
    );
}