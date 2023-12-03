import React, {useEffect} from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Button, message, Modal, Table} from "antd";
import {RedoOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";
import {Bot} from "../../../Model/Bot";

interface PushLog {
    text: string,
    package: string,
    ticker: string,
    notification: string,
}

interface PushListProps extends ModalsProps {
    bot: Bot,
}

const PushList: React.FC<PushListProps> = (props: PushListProps) => {
    const dispatch = useDispatch();
    const logsReducer = useSelector((state: AppState) => state.logs);

    useEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("pushlist", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        }
    }, [dispatch, props.bot.id, props.visible]);

    const closeModal = () => {
        props.setVisible(false);
    };

    const refreshPushList = () => {
        dispatch(getLogsList("pushlist", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        message.success("Success refresh push list");
    };

    const columns = [
        {
            title: "Package",
            dataIndex: "package",
            key: "package",
            render: (text: string, log: PushLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Package</b>
                    </div>
                    <div className="table-col-item">
                        {log.package}
                    </div>
                </div>
            ),
        },
        {
            title: "Text",
            dataIndex: "text",
            key: "text",
            render: (text: string, log: PushLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Text</b>
                    </div>
                    <div className="table-col-item">
                        {log.text}
                    </div>
                </div>
            ),
        },
        {
            title: "Notification",
            dataIndex: "notification",
            key: "notification",
            render: (text: string, log: PushLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Notification</b>
                    </div>
                    <div className="table-col-item">
                        {log.notification}
                    </div>
                </div>
            ),
        },
        {
            title: "Ticker",
            dataIndex: "ticker",
            key: "ticker",
            render: (text: string, log: PushLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Ticker</b>
                    </div>
                    <div className="table-col-item">
                        {log.ticker}
                    </div>
                </div>
            ),
        },
    ];

    let dataSource: PushLog[] = [];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as PushLog[];
    } else {
        dataSource = [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "pushlist" && logsReducer.botId === props.bot.id;

    return (
        <Modal
            title="Push list"
            visible={props.visible}
            onCancel={closeModal}
            width={900}
            className="modal-injects"
            destroyOnClose
            footer={[
                <>
                    <Button
                        type="primary"
                        onClick={refreshPushList}
                        icon={<RedoOutlined />}
                    >
                        Refresh push list
                    </Button>
                    <Button
                        type="primary"
                        onClick={closeModal}
                        danger
                    >
                        Close
                    </Button>
                </>,
            ]}
        >
            <div className="table-scroll" style={{maxHeight: 250, overflowY: "auto"}}>
                <Table
                    columns={columns}
                    dataSource={isLoaded ? dataSource : []}
                    size="small"
                    pagination={false}
                    sticky={true}
                    loading={!isLoaded}
                />
            </div>
        </Modal>
    );
};

export default PushList;
