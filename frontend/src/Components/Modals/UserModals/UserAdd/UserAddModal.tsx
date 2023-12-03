import React, {useEffect} from "react";
import {DatePicker, Form, Input, Modal, Select} from "antd";
import {ModalsProps} from "../../../../Model/Modal";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {addUser} from "../../../../Store/Users/Actions";
import {inputRules} from "../../../../Util/config";
import {AppState} from "../../../../Store/RootReducer";
import {hasAccess} from "../../../../Util/hasAccess";

const {Option} = Select;

interface UserAddProps extends ModalsProps {
    tags: string[],
}

interface CustomTarget extends Node {
    title: string,
}

const UserAddModal: React.FC<UserAddProps> = (props: UserAddProps) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();


    useEffect(() => {
        const observer = new MutationObserver((mutations: MutationRecord[]) => {
            if (mutations.length >= 1 && mutations[0].target !== undefined) {
                const customTarget: CustomTarget = mutations[0].target as CustomTarget;
                if (customTarget.title !== undefined && customTarget.title !== null && customTarget.title) {
                    form.setFieldsValue({
                        expired_at2: moment(customTarget.title),
                    });
                }
            }
        });

        const item = document.getElementById("expired_at2"); // почему не находит?

        if (item) {
            observer.observe(item, {
                attributes: true,
            });
        }
    }, [form]);

    const authReducer = useSelector((state: AppState) => state.auth);

    const closeModal = () => {
        form.resetFields();
        props.setVisible(false);
    };

    const formSubmitHandler = () => {
        let formValues = form.getFieldsValue();
        formValues = {
            ...formValues,
            expired_at: formValues.expired_at2 ? moment(formValues.expired_at2)
                .format("YYYY-MM-DD HH:mm:ss") : null,
        };

        dispatch(addUser(formValues));

        closeModal();
    };

    return (
        <>
            <Modal
                title="Add new user"
                visible={props.visible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText="Add user"
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={formSubmitHandler}>
                    <Form.Item label="Token" name="token" rules={inputRules}>
                        <Input placeholder="Token"/>
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={inputRules}>
                        <Input type="password" placeholder="password" />
                    </Form.Item>
                    <Form.Item label="Name" name="name" rules={inputRules}>
                        <Input placeholder="Name"/>
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={inputRules}>
                        <Select placeholder="Role">
                            {hasAccess(authReducer.user, "users.createRoot") && <Option value="root">root</Option>}
                            {hasAccess(authReducer.user, "users.createAdmin") && <Option value="admin">admin</Option>}
                            {hasAccess(authReducer.user, "users.createSeo") && <Option value="seo">seo</Option>}
                            {hasAccess(authReducer.user, "users.createUser") && <Option value="user">user</Option>}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Tags" name="tags">
                        <Select mode="tags" allowClear placeholder="Tag">
                            {props.tags.map((tag: string, key: number) => (
                                <Option value={tag} key={key.toString(36)}>{tag}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={inputRules}>
                        <Input placeholder="email@example.com"/>
                    </Form.Item>
                    <Form.Item label="Expiration date" name="expired_at2">
                        <DatePicker placeholder="Account expire date" style={{width: "100%"}} showTime={true} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserAddModal;
