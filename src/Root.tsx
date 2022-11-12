import React from "react"
import { Provider } from "react-redux"
import configureStore from "./Store"
import { Route, Switch, Redirect } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import { AuthRoles } from "./interfaces/AuthRoles"
import SecureRoute from "./components/SecureRoute"
import Config from './Config'
import { ConnectedRouter } from "connected-react-router"
import { createBrowserHistory } from "history"
import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { ApolloProvider } from '@apollo/react-hooks'
import { createUploadLink } from "apollo-upload-client"
import { onError } from "@apollo/client/link/error";

// styles
import './styles/index.scss'
import 'react-toastify/dist/ReactToastify.css'

// views
import Dashboard from "./views/Dashboard"
import Members from "./views/Members"
import Contact from "./views/Contact"
import Orders from "./views/Orders"
import Order from "./views/Order"
import BillingReports from "./views/BillingReports"
import Compensations from "./views/Compensations"
import AddBillingReport from "./views/AddBillingReport"
import Login from "./views/Login"
import Users from "./views/Users"
import User from "./views/User"
import BillingReport from "./views/BillingReport"
import AddCompensation from "./views/AddCompensation"
import Compensation from "./views/Compensation"
import Error404 from "./components/Errors/404"
import MailingLists from "./views/MailingLists"
import CollectionPoints from "./views/CollectionPoints"
import AddCollectionPoint from "./views/AddCollectionPoint"
import Payouts from "./views/Payouts"
import Payout from "./views/Payout"
import PayoutMember from "./views/PayoutMember"
import AddPayout from "./views/AddPayout"
import Logoffs from "./views/Logoffs"
import Logoff from "./views/Logoff"
import AddLogoff from "./views/AddLogoff"
import { UI } from "./actions/UIActions"
import Products from "./views/Warehouse/Products"
import Product from "./views/Warehouse/Product"
import Warehouses from "./views/Warehouse/Warehouses"
import AddWarehouse from './views/Warehouse/AddWarehouse'
import MaterialChangelogs from "./views/Warehouse/MaterialChangelogs"
import AddMaterialChangelog from "./views/Warehouse/AddMaterialChangelog"
import introspectionQueryResultData from './graphql.fragmentTypes.json'
import MaterialChangelog from "./views/Warehouse/MaterialChangelog"
import Warehouse from "./views/Warehouse/Warehouse"
import QRCodeGenerator from "./views/Warehouse/QRCodeGenerator"
import BillingReportSign from "./views/BillingReportSign"

export default function Root() {
    Config.loadConfig()
    const history = createBrowserHistory({ basename: '/webapp/' })
    const { store } = configureStore(history)
    store.getState()

    const uploadLink = createUploadLink({ credentials: 'include', uri: `${Config.apiEndpoint}/graphql` })
    const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
        if (graphQLErrors)
            graphQLErrors.map(({ message, path }) => {
                if (path && path[0] === 'me' && message.indexOf('Access denied!') > -1 && history.location.pathname !== '/login') {
                    history.push('/login', { unAuthenticated: true, prevLocation: history.location.pathname })
                    return
                }

                console.error(`[GraphQL error]: Message: ${message}, Operation: ${operation.operationName}, Path: ${path}`)
            })
        if (networkError) {
            store.dispatch(UI.showError('Etwas ist schief gelaufen'))
            console.error(`[Network error]: ${networkError}`)
        }
    })
    const apolloClient = new ApolloClient({
        // ignore it for now. It works :sweat_smile:
        link: from([uploadLink as any, errorLink]),
        cache: new InMemoryCache({
            possibleTypes: introspectionQueryResultData.__schema.types.map((type) => { return { name: type.name, types: type.possibleTypes.map(t => t.name) } }).reduce((p, c) => { p[c.name] = c.types; return p }, {} as { [type: string]: string[] })
        })
    })

    return (
        <Provider store={store}>
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
                <ConnectedRouter history={history} >
                    <ApolloProvider client={apolloClient as any}>
                        <Switch>
                            <Route exact path="/" component={() => { return (<Redirect to="/login" />) }} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/login?source=:source" component={Login} />
                            <SecureRoute exact path="/dashboard" roles={[AuthRoles.AUTHENTICATED]} component={Dashboard} />
                            <SecureRoute exact path="/members" roles={[AuthRoles.MEMBERS_READ]} component={Members} />
                            <SecureRoute exact path="/mailing-lists" roles={[AuthRoles.MAILING_LISTS]} component={MailingLists} />
                            <SecureRoute exact path="/draft/collection-points" roles={[AuthRoles.COLLECTIONPOINT_READ]} component={CollectionPoints} />
                            <SecureRoute exact path="/draft/collection-point/add" roles={[AuthRoles.COLLECTIONPOINT_EDIT, AuthRoles.COLLECTIONPOINT_CREATE]} component={AddCollectionPoint} />
                            <SecureRoute exact path="/draft/logoffs" roles={[AuthRoles.LOGOFFS_READ]} component={Logoffs} />
                            <SecureRoute exact path="/draft/logoff/add" roles={[AuthRoles.AUTHENTICATED]} component={AddLogoff} />
                            <SecureRoute exact path="/draft/logoff/:id" roles={[AuthRoles.LOGOFFS_READ, AuthRoles.AUTHENTICATED]} component={Logoff} />
                            <SecureRoute exact path="/contact/:id" roles={[AuthRoles.CONTACTS_READ, AuthRoles.MEMBERS_READ, AuthRoles.AUTHENTICATED]} component={Contact} />
                            <SecureRoute exact path="/orders" roles={[AuthRoles.ORDERS_READ]} component={Orders} />
                            <SecureRoute exact path="/order/:id" roles={[AuthRoles.ORDERS_READ]} component={Order} />
                            <SecureRoute exact path="/billing-reports" roles={[AuthRoles.BILLINGREPORTS_READ, AuthRoles.BILLINGREPORTS_CREATE]} component={BillingReports} />
                            <SecureRoute exact path="/billing-reports/add" roles={[AuthRoles.BILLINGREPORTS_CREATE]} component={AddBillingReport} />
                            <SecureRoute exact path="/billing-report/:id" roles={[AuthRoles.BILLINGREPORTS_CREATE, AuthRoles.BILLINGREPORTS_READ]} component={BillingReport} />
                            <SecureRoute exact path="/billing-report/sign/:id" roles={[AuthRoles.BILLINGREPORTS_CREATE]} component={BillingReportSign} />
                            <SecureRoute exact path="/compensations" roles={[AuthRoles.COMPENSATIONS_READ]} component={Compensations} />
                            <SecureRoute exact path="/compensations/add" roles={[AuthRoles.COMPENSATIONS_CREATE]} component={AddCompensation} />
                            <SecureRoute exact path="/compensation/:id" roles={[AuthRoles.COMPENSATIONS_READ, AuthRoles.AUTHENTICATED]} component={Compensation} />
                            <SecureRoute exact path="/payouts" roles={[AuthRoles.PAYOUTS_READ]} component={Payouts} />
                            <SecureRoute exact path="/payouts/add" roles={[AuthRoles.PAYOUTS_CREATE]} component={AddPayout} />
                            <SecureRoute exact path="/payout/:id" roles={[AuthRoles.PAYOUTS_READ]} component={Payout} />
                            <SecureRoute exact path="/payout/:id/:memberId" roles={[AuthRoles.PAYOUTS_READ]} component={PayoutMember} />
                            <SecureRoute exact path="/users" roles={[AuthRoles.ADMIN]} component={Users} />
                            <SecureRoute exact path="/user/:id" roles={[AuthRoles.ADMIN]} component={User} />
                            <SecureRoute exact path="/warehouse/products" roles={[AuthRoles.PRODUCT_READ]} component={Products} />
                            <SecureRoute exact path="/warehouse/product/:id" roles={[AuthRoles.PRODUCT_READ]} component={Product} />
                            <SecureRoute exact path="/warehouse/warehouses" roles={[AuthRoles.WAREHOUSE_READ]} component={Warehouses} />
                            <SecureRoute exact path="/warehouse/add" roles={[AuthRoles.WAREHOUSE_CREATE]} component={AddWarehouse} />
                            <SecureRoute exact path="/warehouse/changelogs" roles={[AuthRoles.MATERIAL_CHANGELOG_READ]} component={MaterialChangelogs} />
                            <SecureRoute exact path="/warehouse/changelogs/add" roles={[AuthRoles.MATERIAL_CHANGELOG_CREATE]} component={AddMaterialChangelog} />
                            <SecureRoute exact path="/warehouse/changelog/:id" roles={[AuthRoles.MATERIAL_CHANGELOG_READ]} component={MaterialChangelog} />
                            <SecureRoute exact path="/warehouse/qr-code" roles={[AuthRoles.WAREHOUSE_READ, AuthRoles.PRODUCT_READ, AuthRoles.MATERIAL_CHANGELOG_READ]} component={QRCodeGenerator} />
                            <SecureRoute exact path="/warehouse/:id" roles={[AuthRoles.WAREHOUSE_READ, AuthRoles.WAREHOUSE_CREATE]} component={Warehouse} />
                            <Route path="/*" component={Error404} />
                        </Switch>
                    </ApolloProvider>
                </ConnectedRouter>
            </div>
        </Provider>
    )
}