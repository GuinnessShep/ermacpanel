import React, {useEffect} from "react";
import {Form, Spin, Switch, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {PermissionsDataSource} from "../../Misc/PermissionsList";
import {getPermissionsList, updatePermission} from "../../../Store/Permissions/Actions";

const Permissions: React.FC = () => {
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const permissionsReducer = useSelector((state: AppState) => state.permissions);

    const updatePermissionRole = (checked: boolean, permission: PermissionsDataSource, role: string) => {
        let roles = permission.roles;

        if (checked && !roles.includes(role)) {
            roles.push(role);
        } else if (!checked && roles.includes(role)) {
            roles = roles.filter((_role) => _role !== role);
        }

        dispatch(updatePermission(permission.permission, roles));
    };

    const columns = [
        {
            title: "Permission name",
            key: "permission",
            dataIndex: "permission",
            render: (text: string) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <b>Permission</b>
                        </div>
                        <div className="table-col-item">
                            {text}
                        </div>
                    </div>
                );
            },
        },
        {
            title: "root",
            dataIndex: "root",
            key: "root", // к этой залупе нет доступа? vidimo net
            width: 60,
            render: (status: boolean, permission: PermissionsDataSource) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>root</h3>
                        </div>
                        <div className="table-col-item">
                            <Form.Item
                                // name={permission.permission}
                                valuePropName="checked"
                                style={{marginBottom: 0}}
                            >
                                <Switch
                                    checked={permission.roles.includes("root")}
                                    size="small"
                                    onChange={(checked: boolean) => updatePermissionRole(checked, permission, "root")}/>
                            </Form.Item>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "admin",
            dataIndex: "admin",
            key: "admin",
            width: 60,
            render: (status: boolean, permission: PermissionsDataSource) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>admin</h3>
                        </div>
                        <div className="table-col-item">
                            <Form.Item
                                // name={permission.permission}
                                valuePropName="checked"
                                style={{marginBottom: 0}}
                            >
                                <Switch
                                    checked={permission.roles.includes("admin")}
                                    size="small"
                                    onChange={(checked: boolean) => updatePermissionRole(checked, permission, "admin")}/>
                            </Form.Item>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "seo",
            dataIndex: "seo",
            key: "seo",
            width: 60,
            render: (status: boolean, permission: PermissionsDataSource) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>seo</h3>
                        </div>
                        <div className="table-col-item">
                            <Form.Item
                                // name={permission.permission}
                                valuePropName="checked"
                                style={{marginBottom: 0}}
                            >
                                <Switch
                                    checked={permission.roles.includes("seo")}
                                    size="small"
                                    onChange={(checked: boolean) => updatePermissionRole(checked, permission, "seo")}/>
                            </Form.Item>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "user",
            dataIndex: "user",
            key: "user",
            width: 60,
            render: (status: boolean, permission: PermissionsDataSource) => {
                return (
                    <div className="table-col">
                        <div className="table-col-item">
                            <h3>user</h3>
                        </div>
                        <div className="table-col-item">
                            <Form.Item
                                // name={permission.permission}
                                valuePropName="checked"
                                style={{marginBottom: 0}}
                            >
                                <Switch
                                    checked={permission.roles.includes("user")}
                                    size="small"
                                    onChange={(checked: boolean) => updatePermissionRole(checked, permission, "user")}/>
                            </Form.Item>
                        </div>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (!permissionsReducer.isLoaded) {
            dispatch(getPermissionsList());
        }
    });


    return (
        <>
            <div className="panel-header">
                <h2 className="panel-title">Permissions</h2>
            </div>

            <div className="panel-content">
                {permissionsReducer.isLoaded ? (
                    <div className="table-inner" style={{maxWidth: 600}}>
                        <Form form={form}>
                            {Object.keys(permissionsReducer.permissions).map((group: string, key: number) => {
                                const dataSource: PermissionsDataSource[] = [];

                                Object.keys(permissionsReducer.permissions[group]).forEach((permission: string, index: number) => {
                                    dataSource.push({
                                        key: index,
                                        permission: permission,
                                        roles: permissionsReducer.permissions[group][permission],
                                    });
                                });

                                return (
                                    <div key={key} style={{marginBottom: 40}}>
                                        <Table
                                            columns={columns}
                                            dataSource={dataSource}
                                            pagination={false}
                                            size="small"
                                            title={() => group}
                                            rowKey={"key"}
                                            className="not-responsive"
                                        />
                                    </div>
                                );
                            })}
                        </Form>
                    </div>
                ) : (
                    <Spin />
                )}
            </div>
        </>
    );
};

export default Permissions;
