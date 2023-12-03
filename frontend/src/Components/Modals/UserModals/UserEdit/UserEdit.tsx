import React, {useEffect} from "react";
import {DatePicker, Form, Input, Modal, Select} from "antd";
import {ModalsProps} from "../../../../Model/Modal";
import {User} from "../../../../Model/User";
import {useDispatch, useSelector} from "react-redux";
import {editUser} from "../../../../Store/Users/Actions";
import moment from "moment";
import {AppState} from "../../../../Store/RootReducer";
import {hasAccess} from "../../../../Util/hasAccess";

const {Option} = Select;

interface UserEditProps extends ModalsProps {
    user: User,
    tags: string[],
}

const UserEdit: React.FC<UserEditProps> = (props: UserEditProps) => {
    const [userEditForm] = Form.useForm();
    const dispatch = useDispatch();

    const authReducer = useSelector((state: AppState) => state.auth);

    useEffect(() => {
        userEditForm.setFieldsValue({
            tags: props.user.tags,
            role: props.user.role,
            name: props.user.name,
            token: props.user.token,
            email: props.user.email,
            expired_at: props.user.expired_at ? moment(props.user.expired_at) : null,
        });
    });

    const formSubmitHandler = () => {
        let formValues = userEditForm.getFieldsValue();
        formValues = {
            ...formValues,
            expired_at: moment(formValues.expired_at)
                .format("YYYY-MM-DD HH:mm:ss"),
        };

        dispatch(editUser(props.user.id, formValues));

        userEditForm.submit();
        props.setVisible(false);
    };

    return (
        <>
            <Modal
                forceRender={true}
                title="Edit user"
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                onOk={formSubmitHandler}
                destroyOnClose
            >
                <Form
                    form={userEditForm}
                    layout="vertical"
                >
                    {hasAccess(authReducer.user, "users.token") && (
                        <Form.Item label="Token" name="token">
                            <Input placeholder="Token"/>
                        </Form.Item>
                    )}
                    <Form.Item label="Name" name="name">
                        <Input placeholder="Name"/>
                    </Form.Item>
                    <Form.Item label="Role" name="role">
                        <Select placeholder="Role">
                            <Option value="root">root</Option>
                            <Option value="admin">admin</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Tags" name="tags">
                        <Select mode="multiple" allowClear placeholder="Tag">
                            {props.tags.map((tag: string, key: number) => (
                                <Option value={tag} key={key}>{tag}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input placeholder="email@example.com"/>
                    </Form.Item>
                    <Form.Item label="Expiration date" name="expired_at">
                        <DatePicker placeholder="Account expire date" style={{width: "100%"}} showTime={true}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserEdit;
