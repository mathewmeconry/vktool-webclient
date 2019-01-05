import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./Store";
import { Store, AnyAction } from "redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Header } from "./components/Header";
import { Navibar } from "./components/Navibar";
import { ToastContainer } from 'react-toastify';
import { AuthRoles } from "../shared/AuthRoles";
import { SecureRoute } from "./components/SecureRoute";
import Loading from "./components/Loading";

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


export default class Root extends Component<{}, {}> {
    private store: Store<any, AnyAction>

    constructor(props: {}, state: {}) {
        super(props, state)
        this.store = configureStore()
        this.store.getState()
    }

    render() {
        return (
            <Provider store={this.store}>
                <BrowserRouter>
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
                        <Header />
                        <Navibar />
                        <Switch>
                            <Route exact path="/" component={() => { return (<Redirect to="/login" />) }} />
                            <Route exact path="/login" component={Login} />
                            <SecureRoute exact path="/dashboard" role={AuthRoles.AUTHENTICATED} component={Dashboard} />
                            <SecureRoute exact path="/members" role={AuthRoles.MEMBERS_READ} component={Members} />
                            <SecureRoute exact path="/contact/:id" role={AuthRoles.CONTACTS_READ} component={Contact} />
                            <SecureRoute exact path="/orders" role={AuthRoles.ORDERS_READ} component={Orders} />
                            <SecureRoute exact path="/order/:id" role={AuthRoles.ORDERS_READ} component={Order} />
                            <SecureRoute exact path="/billing-reports" role={AuthRoles.BILLINGREPORTS_READ} component={BillingReports} />
                            <SecureRoute exact path="/billing-reports/add" role={AuthRoles.BILLINGREPORTS_CREATE} component={AddBillingReport} />
                            <SecureRoute exact path="/billing-report/:id" role={AuthRoles.BILLINGREPORTS_READ} component={BillingReport} />
                            <SecureRoute exact path="/compensations" role={AuthRoles.COMPENSATIONS_READ} component={Compensations} />
                            <SecureRoute exact path="/compensations/add" role={AuthRoles.COMPENSATIONS_CREATE} component={AddCompensation} />
                            <SecureRoute exact path="/users" role={AuthRoles.ADMIN} component={Users} />
                            <SecureRoute exact path="/user/:id" role={AuthRoles.ADMIN} component={User} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        )
    }
}