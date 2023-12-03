import React from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Button, Modal, Switch, Table} from "antd";
import {useDispatch} from "react-redux";
import {Bot, BotInjection} from "../../../Model/Bot";
import {getApiUrl} from "../../../Util/config";
import {CodeFilled, PoweroffOutlined} from "@ant-design/icons";
import {updateBotInjectIsActive} from "../../../Store/Bots/Actions";

interface InjectsModalProps extends ModalsProps {
    bot: Bot,
}

const BotInjectsModal: React.FC<InjectsModalProps> = (props: InjectsModalProps) => {
    const closeModal = () => props.setVisible(false);

    const dispatch = useDispatch();

    const onChangeInjectIsActive = (application: string, is_active: boolean) => {
        dispatch(updateBotInjectIsActive(props.bot.id, application, is_active));
    };

    const columns = [
        {
            title: (
                <>
                    <CodeFilled /> Application
                </>
            ),
            dataIndex: "name",
            key: "name",
            render: (name: string, inject: BotInjection) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Application</h3>
                    </div>
                    <div className="table-col-item">
                        <img
                            src={getApiUrl(`/injects/images/${inject.type}/${inject.application}.png`)}
                            alt={name}
                            width={16}
                        /> {name}
                    </div>
                </div>
            ),
        },
        {
            title: (
                <>
                    <PoweroffOutlined /> Status
                </>
            ),
            dataIndex: "is_active",
            key: "is_active",
            width: 100,
            render: (is_active: boolean, inject: BotInjection) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Status</h3>
                    </div>
                    <div className="table-col-item">
                        <Switch checked={is_active} size="small" onChange={(is_active: boolean) => onChangeInjectIsActive(inject.application, is_active)} />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Modal
            title="Bot Injects"
            visible={props.visible}
            onCancel={closeModal}
            className="modal-injects"
            destroyOnClose
            width={400}
            footer={[
                <Button type="primary" onClick={closeModal} key={1}>Close</Button>,
            ]}
            centered
        >
            <div className="table-scroll" style={{maxHeight: 300, overflowY: "auto"}}>
                <Table
                    columns={columns}
                    dataSource={props.bot.injections}
                    size="small"
                    sticky={true}
                    pagination={false}
                    rowKey={"name"}
                />
            </div>
        </Modal>
    );
};

export default BotInjectsModal;
