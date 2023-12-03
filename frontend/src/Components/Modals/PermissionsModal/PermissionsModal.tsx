import React, {useEffect} from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Checkbox, Form, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {getPermissionsList} from "../../../Store/Permissions/Actions";
import {AppState} from "../../../Store/RootReducer";
import {User} from "../../../Model/User";
import {permissionNames, PermissionsDataSource} from "../../Misc/PermissionsList";

interface PermissionModalProps extends ModalsProps {
    user: User
}

const PermissionsModal: React.FC<PermissionModalProps> = (props: PermissionModalProps) => {
    const closeModal = () => {
        props.setVisible(false);
    };
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const permissionsReducer = useSelector((state: AppState) => state.permissions);


    useEffect(() => {
        const formValues: Record<string, boolean> = {};
        form.setFieldsValue({...formValues});
    }, [form, permissionsReducer.permissions, props.user]);

    const columns = [
        {
            title: "Permission name",
            key: "permission",
            dataIndex: "permission",
            render: (permission: string) => {
                return (
                    <>{permissionNames[permission] ?? "Undefined"}</>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 60,
            render: (status: boolean, permission: PermissionsDataSource) => {
                return (
                    <Form.Item
                        name={permission.permission}
                        valuePropName="checked"
                        style={{marginBottom: 0}}
                    >
                        <Checkbox/>
                    </Form.Item>
                );
            },
        },
    ];

    const formSubmitHandler = () => {
    };

    useEffect(() => {
        if (!permissionsReducer.isLoaded) {
            dispatch(getPermissionsList());
        }
    });

    return (
        <Modal
            title="User permissions"
            className="modal-injects"
            visible={props.visible}
            onCancel={closeModal}
            onOk={formSubmitHandler}
            okText="Save"
            destroyOnClose
        >
            <div className="table-scroll" style={{maxHeight: 400, overflowY: "auto"}}>
                <Form form={form}>
                    {Object.keys(permissionsReducer.permissions).map((group: string, key: number) => {
                        const dataSource: PermissionsDataSource[] = [];

                        Object.keys(permissionsReducer.permissions[group]).forEach((permission: string, index: number) => {
                            /*
                            dataSource.push({
                                key: index,
                                permission: permissionsReducer.permissions[group][permission as any],
                            });
                             */
                        });

                        return (
                            <div key={key}>
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                    pagination={false}
                                    size="small"
                                    title={() => group}
                                    showHeader={false}
                                    rowKey={"key"}
                                    className="table-permissions-modal"
                                    style={{
                                        marginBottom: 20,
                                    }}
                                />
                            </div>
                        );
                    })}
                </Form>
            </div>
        </Modal>
    );
};

export default PermissionsModal;
