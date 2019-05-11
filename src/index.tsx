import { app } from './functions/app';

import createLoading from 'dva-loading';

import routers from "./router";

import "./components/login/models/index"
import "./components/home/models/index"


// 1. Initialize
// const app = dva({
//     history: createhistory(),
// });
// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./components/login/models/login.model').default);

// 4. Router
app.router(routers as any);

// 5. Start
app.start('#root');
