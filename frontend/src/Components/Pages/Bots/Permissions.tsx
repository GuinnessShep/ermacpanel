import React from "react";
import {Tooltip} from "antd";

import {Bot} from "../../../Model/Bot";

interface PermissionProps {
    bot: Bot,
}

const permissionActiveColor = {color: "#4aac16"}; // important important important

const Permissions: React.FC<PermissionProps> = (props: PermissionProps) => {
    return (
        <div className="bot-item-permissions">
            <Tooltip title="On screen" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.permissions.screen ?
                        <span className="icon-bot icon-Visibility" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-Visibility" />
                }
            </Tooltip>

            <Tooltip title="Accessibility" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.permissions.accessibility ?
                        <span className="icon-bot icon-SettingsAccessibility" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-SettingsAccessibility" />
                }
            </Tooltip>

            <Tooltip title="Contacts" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.set_contact_list ?
                        <span className="icon-bot icon-AccountBox" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-AccountBox" />
                }
            </Tooltip>

            <Tooltip title="On top" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.set_windows_fake ?
                        <span className="icon-bot icon-TableView" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-TableView"/>
                }
            </Tooltip>

            <Tooltip title="Module loaded" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.permissions.isKeyguardLocked ?
                        <span className="icon-bot icon-OfflineBolt" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-OfflineBolt" />
                }
            </Tooltip>

            <Tooltip title="Admin" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.permissions.admin ?
                        <span className="icon-bot icon-AdminPanelSettings" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-AdminPanelSettings" />
                }
            </Tooltip>

            <Tooltip title="SMS list" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.permissions.is_dozemode ?
                        <span className="icon-bot icon-MarkEmailRead" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-MarkEmailRead" />
                }
            </Tooltip>

            <Tooltip title="Hide SMS" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.settings.hideSMS ?
                        <span className="icon-bot icon-MarkEmailUnread" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-MarkEmailUnread" />
                }
            </Tooltip>

            <Tooltip title="Keylogger" placement="bottom" destroyTooltipOnHide>
                {
                    props.bot.settings.keylogger ?
                        <span className="icon-bot icon-KeyboardIconMD" style={permissionActiveColor} /> :
                        <span className="icon-bot icon-KeyboardIconMD" />
                }
            </Tooltip>
        </div>
    );
};

export default Permissions;
