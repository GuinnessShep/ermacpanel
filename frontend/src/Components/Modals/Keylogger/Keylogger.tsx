import React, {useLayoutEffect, useRef} from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Button, Modal, Pagination, Radio, RadioChangeEvent, Table} from "antd";
import {Bot} from "../../../Model/Bot";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {changeLogsFilters, getLogsList, setLogsPage} from "../../../Store/Logs/Actions";
import {RedoOutlined} from "@ant-design/icons";

interface KeyloggerLog {
    text: string,
    time: string,
    action: string,
    length?: number,
}

interface KeyloggerProps extends ModalsProps {
    bot: Bot,
}

const Keylogger: React.FC<KeyloggerProps> = (props: KeyloggerProps) => {
    const dispatch = useDispatch();
    const logsReducer = useSelector((state: AppState) => state.logs);
    const tableRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (props.visible) {
            dispatch(getLogsList("datakeylogger", props.bot.id, null, logsReducer.filters, logsReducer.sort, logsReducer.page, logsReducer.per_page, {
                keyloggerAction: logsReducer.filters.keyloggerAction,
            }));
        }
    }, [dispatch, props.bot.id, props.visible, logsReducer.page, logsReducer.per_page, logsReducer.filters.keyloggerAction]);


    const closeModal = () => {
        props.setVisible(false);
    };

    const onChangeAction = (e: RadioChangeEvent) => {
        dispatch(changeLogsFilters({
            keyloggerAction: e.target.value,
        }));
    };

    const columns = [
        {
            title: "Text",
            dataIndex: "text",
            key: "text",
            render: (text: string, log: KeyloggerLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Package</b>
                    </div>
                    <div className="table-col-item">
                        {log.text}
                    </div>
                </div>
            ),
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
            render: (text: string, log: KeyloggerLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Text</b>
                    </div>
                    <div className="table-col-item">
                        {log.time}
                    </div>
                </div>
            ),
        },
    ];

    let dataSource: KeyloggerLog[];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as KeyloggerLog[];
    } else {
        dataSource = [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "datakeylogger" && logsReducer.botId === props.bot.id;

    const keyloggerActions = [
        {label: "Write Text", value: "[Write Text]"},
        {label: "Click", value: "[Click]"},
        {label: "KeyLog", value: "[KeyLog]"},
        {label: "Focused", value: "[Focused]"},
        {label: "Selected", value: "[Selected]"},
    ];

    const logsPaginationHandler = (pageNumber: number, size: number) => {
        if (logsReducer.isLoaded &&
            logsReducer.page === logsReducer.loaded_page &&
            logsReducer.page === logsReducer.loaded_page &&
            logsReducer.loaded_per_page === logsReducer.per_page) {
            if (tableRef.current) {
                tableRef.current.scrollTo(0, 0);
            }

            dispatch(setLogsPage(pageNumber, size));
        }
    };

    const refreshKeylogger = () => {
        dispatch(getLogsList("datakeylogger", props.bot.id, null, logsReducer.filters, logsReducer.sort, logsReducer.page, logsReducer.per_page, {
            keyloggerAction: logsReducer.filters.keyloggerAction,
        }));
    };

    return (
        <Modal
            title="Keylogger logs"
            className="modal-injects"
            visible={props.visible}
            onCancel={closeModal}
            width={600}
            destroyOnClose
            footer={[
                <>
                    <Pagination
                        total={logsReducer.total}
                        defaultPageSize={logsReducer.per_page}
                        onChange={logsPaginationHandler}
                        current={logsReducer.page}
                        showSizeChanger={true}
                        disabled={logsReducer.loaded_page !== logsReducer.page || logsReducer.loaded_per_page !== logsReducer.per_page}
                        style={{marginBottom: 15}}
                    />

                    <Button
                        type="primary"
                        onClick={refreshKeylogger}
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
            <div className="table-scroll" style={{maxHeight: 600, overflowY: "auto"}} ref={tableRef}>
                <div style={{
                    padding: "15px 0",
                }}>
                    <h4 style={{textAlign: "center"}}>Logs type:</h4>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        <Radio.Group
                            options={keyloggerActions}
                            optionType="button"
                            value={logsReducer.filters.keyloggerAction}
                            onChange={onChangeAction}
                            buttonStyle="solid"
                            className="keylogger-radio"
                        />
                    </div>
                </div>

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

export default Keylogger;
