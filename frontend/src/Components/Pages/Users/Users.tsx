import React, {useEffect, useState} from "react";
import {Button, Divider, Modal, Pagination, Space, Table, Tag, Tooltip} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PauseOutlined,
    PlayCircleOutlined,
    PlusSquareOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import UserEditModal from "../../Modals/UserModals/UserEdit/UserEditModal";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, editUser, getUsersList} from "../../../Store/Users/Actions";
import {AppState} from "../../../Store/RootReducer";
import {User} from "../../../Model/User";
import {scrollToTop} from "../../../Util/scrollToTop";
import {hasAccess} from "../../../Util/hasAccess";
import UserAddModal from "../../Modals/UserModals/UserAdd/UserAddModal";

const Users: React.FC = () => {
    const dispatch = useDispatch();
    // const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const openEditUserModal = (user: User) => {
        setSelectedUser(user);
        setShowEditUserModal(true);
    };

    const openUserPermissionsModal = (user: User) => {
        setSelectedUser(user);
        // setShowPermissionsModal(true);
    };

    const usersReducer = useSelector((state: AppState) => state.users);

    const authReducer = useSelector((state: AppState) => state.auth);

    const columns = [
        {
            title: () => (
                <div style={{textAlign: "center"}}>
                    Token
                </div>
            ),
            dataIndex: "token",
            key: "token",
            render: (token: string) => hasAccess(authReducer.user, "users.token") && (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Token</h3>
                    </div>
                    <div className="table-col-item" style={{textAlign: "center"}}>
                        {token}
                    </div>
                </div>
            ),

        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name: string) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>Name</h3>
                        </div>
                        <div className="table-col-item">
                            <Tag>{name}</Tag>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Role",
            key: "role",
            dataIndex: "role",
            render: (role: string) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>Role</h3>
                        </div>
                        <div className="table-col-item">
                            <Tag>{role.toUpperCase()}</Tag>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Tag",
            key: "tags",
            dataIndex: "tags",
            filters: [
                {
                    text: "tag1",
                    value: "tag1",
                },
                {
                    text: "tag2",
                    value: "tag2",
                },
                {
                    text: "tag3",
                    value: "tag3",
                },
                {
                    text: "tag4",
                    value: "tag4",
                },
            ],
            onFilter: (value: any, record: any) => record.tags.indexOf(value) === 0,
            render: (tags: string[]) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Tags</h3>
                    </div>
                    <div className="table-col-item">
                        {tags.map((item: string) => {
                            return (
                                <Tag color="#1263ae" key={item}>
                                    {item.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </div>
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email: string) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Email</h3>
                    </div>
                    <div className="table-col-item">
                        <a href="/" onClick={(e) => e.preventDefault()}>{email}</a>
                    </div>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Date</h3>
                    </div>
                    <div className="table-col-item">
                        {date}
                    </div>
                </div>
            ),
        },
        {
            title: "Expired date",
            dataIndex: "expired_at",
            key: "expired_at",
            render: (date: string) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Expired date</h3>
                    </div>
                    <div className="table-col-item">
                        {date ? date : "Never"}
                    </div>
                </div>
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (text: string, user: User) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <h3>Actions</h3>
                    </div>
                    <div className="table-col-item">
                        <Space size={10}>
                            {hasAccess(authReducer.user, "users.edit") && (
                                <Tooltip title="Edit user" destroyTooltipOnHide>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EditOutlined/>}
                                        onClick={() => openEditUserModal(user)}
                                        style={{backgroundColor: "#d2871b", borderColor: "#d2871b"}}
                                    />
                                </Tooltip>
                            )}

                            {authReducer.user.id !== user.id && (
                                <>
                                    {hasAccess(authReducer.user, "users.delete") && (
                                        <Tooltip title="Delete user" destroyTooltipOnHide>
                                            <Button
                                                danger
                                                type="primary"
                                                shape="circle"
                                                icon={<DeleteOutlined/>}
                                                onClick={() => Modal.confirm({
                                                    title: "Delete user?",
                                                    content: "This action can't be undone",
                                                    okText: "Delete",
                                                    onOk: () => {
                                                        dispatch(deleteUser(user.id));
                                                    },
                                                })}
                                            />
                                        </Tooltip>
                                    )}
                                    {hasAccess(authReducer.user, "permissions.change") && false && (
                                        <Tooltip title="Edit user permissions" destroyTooltipOnHide>
                                            <Button
                                                type="primary"
                                                shape="circle"
                                                icon={<UserAddOutlined/>}
                                                onClick={() => openUserPermissionsModal(user)}
                                            />
                                        </Tooltip>
                                    )}

                                    {hasAccess(authReducer.user, "users.edit") && (
                                        <Tooltip title="Suspend user" destroyTooltipOnHide>
                                            <Button
                                                type="primary"
                                                shape="circle"
                                                icon={user.is_paused ? <PlayCircleOutlined/> : <PauseOutlined/>}
                                                onClick={() => {
                                                    user.is_paused ? Modal.confirm({
                                                        title: "Activate user?",
                                                        content: "This action will activate user account",
                                                        okText: "Yes",
                                                        onOk: () => dispatch(editUser(user.id, {
                                                            is_paused: !user.is_paused,
                                                        })),
                                                    }) : Modal.confirm({
                                                        title: "Suspend user?",
                                                        content: "This action will suspend user account",
                                                        okText: "Yes",
                                                        onOk: () => dispatch(editUser(user.id, {
                                                            is_paused: !user.is_paused,
                                                        })),
                                                    });
                                                }}
                                                style={{backgroundColor: "#c4b023", borderColor: "#c4b023"}}
                                            />
                                        </Tooltip>
                                    )}
                                </>
                            )}
                        </Space>
                    </div>
                </div>
            ),
        },
    ];

    useEffect(() => {
        dispatch(getUsersList(usersReducer.page, usersReducer.per_page));
    }, [dispatch, usersReducer.page, usersReducer.per_page]);

    const paginationHandler = (pageNumber: number, size: number) => {
        scrollToTop();
        dispatch(getUsersList(pageNumber, size));
    };

    return (
        <>
            <div className="panel-header">
                <h2 className="panel-title">Users</h2>
            </div>

            <div className="panel-content">
                {hasAccess(authReducer.user, "users.create") && (
                    <>
                        <Button
                            type="primary"
                            icon={<PlusSquareOutlined/>}
                            onClick={() => setShowAddUserModal(true)}
                        >
                            New user
                        </Button>

                        <Divider/>
                    </>
                )}

                <Table
                    columns={columns}
                    dataSource={usersReducer.users}
                    size="small"
                    loading={!usersReducer.isLoaded}
                    rowKey={"id"}
                    pagination={false}
                    className="users-table"
                />

                <br/>

                <Pagination
                    total={usersReducer.total}
                    defaultPageSize={usersReducer.per_page}
                    onChange={paginationHandler}
                    showSizeChanger={true}
                    current={usersReducer.page}
                />
            </div>

            {selectedUser && (
                <>
                    <UserEditModal tags={usersReducer.tags} visible={showEditUserModal} setVisible={setShowEditUserModal}
                        user={selectedUser}/>
                </>
            )}

            {showAddUserModal && (
                <UserAddModal tags={usersReducer.tags} visible={showAddUserModal} setVisible={setShowAddUserModal}/>
            )}

        </>
    );
};

export default Users;
