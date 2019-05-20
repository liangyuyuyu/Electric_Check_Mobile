import { Route, Switch, match } from "dva/router";

import { ContactPage, ContactComponent } from "./contact";
import { ContactGroupingPage, ContactGroupingComponent } from "./contact.grouping";

export { ContactPage, ContactComponent, ContactGroupingPage, ContactGroupingComponent };

export function contactRoutes() {
    return (
        <Route
            path={`/contact`}
            render={({ match }) => (
                <>
                    <Route path={match.path} component={ContactPage} />
                    <Route path={`${match.path}/contactGrouping`} component={ContactGroupingPage} />
                </>
            )}
        />
    );
}
