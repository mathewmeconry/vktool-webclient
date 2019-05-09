import React, { Component, SyntheticEvent } from "react";
import { Provider } from "react-redux";
import configureStore from "./Store";
import { Store, AnyAction } from "redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { AuthRoles } from "./interfaces/AuthRoles";
import { SecureRoute } from "./components/SecureRoute";
import Config from './Config'
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory, History } from "history";

// styles
import './styles/index.scss'
import 'react-toastify/dist/ReactToastify.css'

// views
import { Dashboard } from "./views/Dashboard";
import { Members } from "./views/Members";
import { Contact } from "./views/Contact";
import { Orders } from "./views/Orders";
import { Order } from "./views/Order";
import { BillingReports } from "./views/BillingReports";
import { Compensations } from "./views/Compensations";
import { AddBillingReport } from "./views/AddBillingReport";
import { Login } from "./views/Login";
import { Users } from "./views/Users";
import { User } from "./views/User";
import { BillingReport } from "./views/BillingReport";
import { AddCompensation } from "./views/AddCompensation";
import { Compensation } from "./views/Compensation";
import { Error404 } from "./components/Errors/404";
import { MailingLists } from "./views/MailingLists";
import { CollectionPoints } from "./views/CollectionPoints";
import { AddCollectionPoint } from "./views/AddCollectionPoint";
import { Memberlist } from "./views/Pdfs/Memberlist";

export default class Root extends Component<{}, {}> {
    private store: Store<any, AnyAction>
    private history: History

    constructor(props: {}, state: {}) {
        super(props, state)
        Config.loadConfig()
        this.history = createBrowserHistory()
        this.store = configureStore(this.history)
        this.store.getState()
    }

    render() {
        return (
            <Provider store={this.store}>
                <div className="body">
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick
                        rtl={false}
                        draggable={true}
                        pauseOnHover={true}
                    />
                    <ConnectedRouter history={this.history}>
                        <Switch>
                            <Route exact path="/" component={() => { return (<Redirect to="/login" />) }} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/login?source=:source" component={Login} />
                            <SecureRoute exact path="/dashboard" roles={[AuthRoles.AUTHENTICATED]} component={Dashboard} />
                            <SecureRoute exact path="/me" roles={[AuthRoles.AUTHENTICATED]} component={User} />
                            <SecureRoute exact path="/members" roles={[AuthRoles.MEMBERS_READ]} component={Members} />
                            <SecureRoute exact path="/members/pdf" roles={[AuthRoles.MEMBERS_READ]} component={Memberlist} />
                            <SecureRoute exact path="/mailing-lists" roles={[AuthRoles.MAILING_LISTS]} component={MailingLists} />
                            <SecureRoute exact path="/draft/collection-points" roles={[AuthRoles.DRAFT_READ]} component={CollectionPoints} />
                            <SecureRoute exact path="/draft/collection-points/add" roles={[AuthRoles.DRAFT_EDIT, AuthRoles.DRAFT_CREATE]} component={AddCollectionPoint} />
                            <SecureRoute exact path="/contact/:id" roles={[AuthRoles.CONTACTS_READ, AuthRoles.MEMBERS_READ]} component={Contact} />
                            <SecureRoute exact path="/orders" roles={[AuthRoles.ORDERS_READ]} component={Orders} />
                            <SecureRoute exact path="/order/:id" roles={[AuthRoles.ORDERS_READ]} component={Order} />
                            <SecureRoute exact path="/billing-reports" roles={[AuthRoles.BILLINGREPORTS_READ, AuthRoles.BILLINGREPORTS_CREATE]} component={BillingReports} />
                            <SecureRoute exact path="/billing-reports/add" roles={[AuthRoles.BILLINGREPORTS_CREATE]} component={AddBillingReport} />
                            <SecureRoute exact path="/billing-report/:id" roles={[AuthRoles.BILLINGREPORTS_CREATE, AuthRoles.BILLINGREPORTS_READ]} component={BillingReport} />
                            <SecureRoute exact path="/compensations" roles={[AuthRoles.COMPENSATIONS_READ]} component={Compensations} />
                            <SecureRoute exact path="/compensations/add" roles={[AuthRoles.COMPENSATIONS_CREATE]} component={AddCompensation} />
                            <SecureRoute exact path="/compensation/:id" roles={[AuthRoles.COMPENSATIONS_READ]} component={Compensation} />
                            <SecureRoute exact path="/users" roles={[AuthRoles.ADMIN]} component={Users} />
                            <SecureRoute exact path="/user/:id" roles={[AuthRoles.ADMIN]} component={User} />
                            <Route path="/*" component={Error404} />
                        </Switch>
                    </ConnectedRouter>
                </div>
            </Provider>
        )
    }
}