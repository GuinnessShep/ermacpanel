import React, {useEffect} from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Button, Modal, Switch, Table} from "antd";
import {useDispatch} from "react-redux";
import {Bot, BotInjection} from "../../../Model/Bot";
import {getApiUrl} from "../../../Util/config";
import {CodeFilled} from "@ant-design/icons";

interface InjectsModalProps extends ModalsProps {
    bot: Bot,
}

// TODO rename BotsInjectsSettingsModal

const Injects: React.FC<InjectsModalProps> = (props: InjectsModalProps) => {
    const closeModal = () => props.setVisible(false);

    const columns = [
        {
            title: (
                <>
                    <CodeFilled/> Application
                </>
            ),
            dataIndex: "name",
            key: "name",
            render: (name: string, inject: BotInjection) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Application</b>
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
                    Status
                </>
            ),
            dataIndex: "status",
            key: "status",
            width: 70,
            render: () => (
                <Switch defaultChecked={true} size="small"/>
            ),
        },
    ];

    const data = props.bot.injections;

    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(getLogsList(null, props.bot.id, null, 1)); // TODO redux action
    }, [dispatch]);

    return (
        <Modal
            title="Injects"
            visible={props.visible}
            onCancel={closeModal}
            className="modal-injects"
            width={400}
            destroyOnClose
            footer={(
                <Button type="primary" onClick={closeModal}>Close</Button>
            )}
            centered
        >
            <div className="table-scroll" style={{maxHeight: 300, overflowY: "auto"}}>
                <Table
                    columns={columns}
                    dataSource={data}
                    size="small"
                    sticky={true}
                    pagination={false}
                    rowKey="id"
                />
            </div>
        </Modal>
    );
};

export default Injects;
