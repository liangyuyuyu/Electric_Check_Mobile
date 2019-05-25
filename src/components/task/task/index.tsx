import { Route, Switch, match } from "dva/router";

import { TaskPage, TaskComponent } from "./task";

export { TaskPage, TaskComponent };

export * from './common'

export function taskRoutes() {
    return (
        <Route
            path={`/task`}
            render={({ match }) => (
                <>
                    <Route path={match.path} component={TaskPage} />
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
