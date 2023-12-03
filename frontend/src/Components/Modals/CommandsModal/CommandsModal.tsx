import React from "react";
import {Modal} from "antd";
import {ModalsProps} from "../../../Model/Modal";
import CommandsList from "../../Misc/Commands";
import {Bot} from "../../../Model/Bot";

interface CommandsModalProps extends ModalsProps {
    bot: Bot,
}

const CommandsModal: React.FC<CommandsModalProps> = (props: CommandsModalProps) => {
    return (
        <Modal
            title="Commands"
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            className="commands-modal"
            footer={null}
            width={480}
            destroyOnClose
        >
            <CommandsList selectedBots={[props.bot]} />
        </Modal>
    );
};

export default CommandsModal;
