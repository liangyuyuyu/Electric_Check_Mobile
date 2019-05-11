import { Route, Switch, match } from "dva/router";

import { HomePage, HomeComponent } from "./home";

export { HomePage, HomeComponent };

// export default ({ match }) => (
//     <>
//         <Route path={match.path} component={HomePage} />
//     </>
// );

export function homeRoutes() {
    return (
        <Route
            path={`/home`}
            render={({ match }) => (
                <>
                    <Route path={match.path} component={HomePage} />
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
