import React from "react";
import {Layout} from "antd";
import {useSelector} from "react-redux";
import {AppState} from "../../Store/RootReducer";
import {hasAccess} from "../../Util/hasAccess";
import EventsDropdown from "../../Components/Modals/EventsDropdown/EventsDropdown";

const {Header} = Layout;

interface HeadProps {
    collapseAction: () => void,
    collapsedState: boolean,
}

const HeaderLayout: React.FC<HeadProps> = (props: HeadProps) => {
    const authReducer = useSelector((state: AppState) => state.auth);

    return (
        <Header className="layout-header" style={{padding: 0}}>
            <div className="header-inner">
                <div className={props.collapsedState ? "header-burger active" : "header-burger"}>
                    <div
                        className="header-burger-inner"
                        onClick={props.collapseAction}
                    >
                        <span />
                        <span />
                        <span />
                    </div>
                </div>

                <div className="header-logo">
                    ERMAC<br/>2.0
                </div>

                {hasAccess(authReducer.user, "events.list") && (
                    <EventsDropdown />
                )}
            </div>
        </Header>
    );
};

export default HeaderLayout;
