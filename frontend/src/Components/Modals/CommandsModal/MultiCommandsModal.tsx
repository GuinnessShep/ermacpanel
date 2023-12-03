import React from "react";
import {Modal} from "antd";
import {ModalsProps} from "../../../Model/Modal";
import CommandsList from "../../Misc/Commands";
import {useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";

const MultiCommandsModal: React.FC<ModalsProps> = (props: ModalsProps) => {
    const selectedBots = useSelector((state: AppState) => state.bots.selectedBots);

    return (
        <Modal
            title="Commands"
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            className="commands-modal"
            footer={null}
            destroyOnClose
        >
            <CommandsList selectedBots={selectedBots}/>
        </Modal>
    );
};

export default MultiCommandsModal;
