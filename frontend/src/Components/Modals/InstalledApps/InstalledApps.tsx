import React, {useEffect} from "react";
import {BotModalProps} from "../../../Model/Modal";
import {Button, message, Modal, Table} from "antd";
import {RedoOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";
import {getApiUrl} from "../../../Util/config";

interface InstalledApplicationLog {
    application: string,
    image: string,
    name: string,
}

const InstalledApps: React.FC<BotModalProps> = (props: BotModalProps) => {
    const logsReducer = useSelector((state: AppState) => state.logs);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("applist", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        }
    }, [dispatch, props.bot.id, props.visible]);


    const closeModal = () => {
        props.setVisible(false);
    };

    const refreshAppsList = () => {
        dispatch(getLogsList("applist", props.bot.id, null, logsReducer.filters, logsReducer.sort, 1));
        message.success("Success refresh apps list");
    };

    const columns = [
        {
            title: "Application",
            dataIndex: "app",
            render: (text: string, log: InstalledApplicationLog) => (
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
            ),
        },
        {
            title: "Name",
            dataIndex: "app_id",
            render: (text: string, log: InstalledApplicationLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Package</b>
                    </div>
                    <div className="table-col-item">
                        <code>{log.name}</code>
                    </div>
                </div>
            ),
        },
    ];

    let dataSource: InstalledApplicationLog[] = [];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as InstalledApplicationLog[];
    } else {
        dataSource= [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "applist" && logsReducer.botId === props.bot.id;

    return (
        <Modal
            title="Installed apps"
            visible={props.visible}
            onCancel={closeModal}
            width={400}
            className="modal-injects"
            destroyOnClose
            footer={[
                <>
                    <Button
                        type="primary"
                        onClick={refreshAppsList}
                        icon={<RedoOutlined/>}
                    >
                        Refresh apps list
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

export default InstalledApps;
