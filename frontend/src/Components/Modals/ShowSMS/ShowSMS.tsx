import React, {useEffect} from "react";
import {BotModalProps} from "../../../Model/Modal";
import {Button, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";
import {RedoOutlined} from "@ant-design/icons";

interface SMSLog {
    number: string,
    stexts: string,
    text?: string,
}

const ShowSMS: React.FC<BotModalProps> = (props: BotModalProps) => {
    const logsReducer = useSelector((state: AppState) => state.logs);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("smslist", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        }
    }, [dispatch, props.bot.id, props.visible]);

    const columns = [
        /*
        {
            title: "",
            dataIndex: "type",
            key: "type",
            width: 25,
            render: (text: string) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>#</h3>
                    </div>
                    <div className="table-col-item" style={{textAlign: "center"}}>
                        {text === "incoming" ? (
                            <LoginOutlined style={{color: "green"}} />
                        ) : (
                            <LogoutOutlined />
                        )}
                    </div>
                </div>,
        },
        */
        {
            title: "Number",
            dataIndex: "number",
            key: "number",
            render: (text: string, log: SMSLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Number</h3>
                    </div>
                    <div className="table-col-item">
                        {log.number}
                    </div>
                </div>,
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            render: (text: string, log: SMSLog) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>Message</h3>
                        </div>
                        <div className="table-col-item">
                            {log.stexts} {log.text}
                        </div>
                    </div>
                );
            },
        },
    ];

    const closeModal = () => {
        props.setVisible(false);
    };

    const refreshSMSList = async () => {
        dispatch(getLogsList("smslist", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        // await message.success("action callback");
    };

    let dataSource: SMSLog[] = [];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as SMSLog[];
    } else {
        dataSource= [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "smslist" && logsReducer.botId === props.bot.id;

    return (
        <Modal
            title="Show SMS"
            className="modal-injects"
            visible={props.visible}
            onCancel={closeModal}
            width={520}
            destroyOnClose
            footer={(
                <>
                    <Button
                        type="primary"
                        onClick={refreshSMSList}
                        icon={<RedoOutlined />}
                    >
                        Refresh SMS list
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
            <div className="table-scroll" style={{maxHeight: 200, overflowY: "auto"}}>
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

export default ShowSMS;
