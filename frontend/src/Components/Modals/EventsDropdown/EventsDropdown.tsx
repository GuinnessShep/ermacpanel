import React, {useEffect, useState} from "react";
import {Dropdown, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getLogsList} from "../../../Store/Logs/Actions";
import {AndroidOutlined, BellOutlined, CodeOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {setCountAction} from "../../../Store/Counts/Actions";

interface EventsData {
    eventName: string,
    value: string,
    bot_id: string,
}

const EventsDropdown: React.FC = () => {
    const logsReducer = useSelector((state: AppState) => state.logs);
    const countsReducer = useSelector((state: AppState) => state.counts);

    // нужно добавить в countsReducer поле events новое, сможешь?
    const dispatch = useDispatch();

    const [eventsDropdownVisible, setEventsDropdownVisible] = useState(false);

    useEffect(() => {
        if (eventsDropdownVisible) {
            dispatch(getLogsList("events", null, null, logsReducer.filters, logsReducer.sort, 1));
        }
    }, [dispatch, eventsDropdownVisible]);

    const columns = [
        {
            title: (
                <>
                    <AndroidOutlined /> Bot ID
                </>
            ),
            dataIndex: "bot_id",
            key: "bot_id",
            width: 150,
            render: (text: string, log: EventsData) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Bot ID</h3>
                    </div>
                    <div className="table-col-item">
                        <a href="/" onClick={(e) => e.preventDefault()}>{log.bot_id}</a>
                    </div>
                </div>,
        },
        {
            title: (
                <>
                    <CodeOutlined /> Event name
                </>
            ),
            dataIndex: "eventName",
            key: "eventName",
            render: (text: string, log: EventsData) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Event name</h3>
                    </div>
                    <div className="table-col-item">
                        {log.eventName}
                    </div>
                </div>,
        },
        {
            title: (
                <>
                    <UnorderedListOutlined /> Value
                </>
            ),
            dataIndex: "value",
            key: "value",
            render: (text: string, log: EventsData) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Value</h3>
                    </div>
                    <div className="table-col-item">
                        {log.value}
                    </div>
                </div>,
        },
    ];


    let dataSource: EventsData[];

    if (logsReducer.logs.length > 0) {
        dataSource = (logsReducer.logs[0].log) as unknown as EventsData[];
    } else {
        dataSource= [];
    }

    const isLoaded = logsReducer.isLoaded && logsReducer.type === "events";


    return (
        <Dropdown
            overlay={(
                <div className="panel-drop-list">
                    <div className="panel-drop-inner">
                        <Table
                            columns={columns}
                            dataSource={isLoaded ? dataSource : []}
                            pagination={false}
                            sticky={true}
                            loading={!isLoaded}
                            size="small"
                        />
                    </div>
                </div>
            )}
            trigger={["click"]}
            placement="bottomRight"
            className="panel-drop-down"
            onVisibleChange={(visible: boolean) => {
                dispatch(setCountAction({
                    events: 0,
                }));
                setEventsDropdownVisible(visible);
            }}
        >
            <div className="panel-drop notifications">
                <BellOutlined />

                {countsReducer.events > 0 && (
                    <div className="panel-drop-newcount" />
                )}
            </div>
        </Dropdown>
    );
};

export default EventsDropdown;
