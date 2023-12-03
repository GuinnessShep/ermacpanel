import React, {useEffect} from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Button, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";
import {Bot} from "../../../Model/Bot";
import {RedoOutlined} from "@ant-design/icons";

interface SMSLog {
    text: string,
    number: number,
    created_at: string,
}

interface HideSMSProps extends ModalsProps {
    bot: Bot,
}

const HideSMS: React.FC<HideSMSProps> = (props: HideSMSProps) => {
    const dispatch = useDispatch();
    const logsReducer = useSelector((state: AppState) => state.logs);

    useEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("hidesms", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        }
    }, [dispatch, props.bot.id, props.visible]);

    const closeModal = () => {
        props.setVisible(false);
    };

    const refreshHideSMS = () => {
        dispatch(getLogsList("hidesms", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
    };

    const columns = [
        {
            title: "Number",
            dataIndex: "number",
            key: "number",
            render: (text: string, log: SMSLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Number</b>
                    </div>
                    <div className="table-col-item">
                        {log.number}
                    </div>
                </div>
            ),
        },
        {
            title: "Text",
            dataIndex: "text",
            key: "text",
            render: (text: string, log: SMSLog) => (
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
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (text: string, log: SMSLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Date</b>
                    </div>
                    <div className="table-col-item">
                        {log.created_at}
                    </div>
                </div>
            ),
        },
    ];

    let dataSource: SMSLog[] = [];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as SMSLog[];
    } else {
        dataSource = [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "hidesms" && logsReducer.botId === props.bot.id;


    return (
        <Modal
            title="Hide SMS"
            visible={props.visible}
            onCancel={closeModal}
            width={400}
            className="modal-injects"
            destroyOnClose
            footer={(
                <>
                    <Button
                        type="primary"
                        onClick={refreshHideSMS}
                        icon={<RedoOutlined />}
                    >
                        Refresh contacts list
                    </Button>
                    <Button
                        type="primary"
                        onClick={closeModal}
                        danger
                    >
                        Close
                    </Button>
                </>
            )}
        >
            <div className="table-scroll" style={{maxHeight: 250, overflowY: "auto"}}>
                <Table
                    columns={columns}
                    dataSource={isLoaded ? dataSource : []}
                    loading={!isLoaded}
                    size="small"
                    pagination={false}
                    sticky={true}
                    className="not-responsive"
                />
            </div>
        </Modal>
    );
};

export default HideSMS;
