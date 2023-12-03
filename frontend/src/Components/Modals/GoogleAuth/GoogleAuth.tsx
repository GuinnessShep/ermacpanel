import React, {useEffect} from "react";
import {BotModalProps} from "../../../Model/Modal";
import {Button, message, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";
import {BotLog} from "../../../Model/BotLog";
import {RedoOutlined} from "@ant-design/icons";

const GoogleAuth: React.FC<BotModalProps> = (props: BotModalProps) => {
    const closeModal = () => {
        props.setVisible(false);
    };

    const logsReducer = useSelector((state: AppState) => state.logs);

    const dispatch = useDispatch();

    useEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("googleauth", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        }
    }, [dispatch, props.bot.id, props.visible]);

    const columns = [
        {
            title: "# ID",
            dataIndex: "id",
            key: "id",
            width: 56,
            render: (text: string) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>ID</h3>
                    </div>
                    <div className="table-col-item" style={{textAlign: "center"}}>
                        {text}
                    </div>
                </div>,
        },
        {
            title: "Data",
            dataIndex: "data",
            key: "data",
            render: (text: string, log: BotLog) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>Data</h3>
                        </div>
                        <div className="table-col-item">
                            <div className="code">{JSON.stringify(log.log, null, 2)}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Created",
            dataIndex: "created_at",
            key: "created_at",
            width: 200,
            render: (text: string) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>ID</h3>
                    </div>
                    <div className="table-col-item" style={{textAlign: "center"}}>
                        {text}
                    </div>
                </div>,
        },
    ];

    const refreshGoogleAuth = () => {
        dispatch(getLogsList("googleauth", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        message.success("Success refresh google auth logs");
    };

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "googleauth" && logsReducer.botId === props.bot.id;

    return (
        <Modal
            title="Google Auth"
            visible={props.visible}
            onCancel={closeModal}
            className="modal-injects"
            destroyOnClose
            footer={(
                <>
                    <Button type="primary" onClick={refreshGoogleAuth} icon={<RedoOutlined />}>
                        Refresh Google auth
                    </Button>

                    <Button type="primary" onClick={closeModal}>
                        Close
                    </Button>
                </>
            )}
            centered
            width={600}
        >
            <div className="table-scroll" style={{maxHeight: 300, overflowY: "auto"}}>
                <Table
                    columns={columns}
                    dataSource={isLoaded ? logsReducer.logs : []}
                    size="small"
                    pagination={false}
                    loading={!isLoaded}
                />
            </div>
        </Modal>
    );
};

export default GoogleAuth;
