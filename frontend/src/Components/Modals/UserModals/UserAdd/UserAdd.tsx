import React from "react";
import {DatePicker, Form, Input, Modal, Select} from "antd";
import {ModalsProps} from "../../../../Model/Modal";
import {useDispatch} from "react-redux";
import moment from "moment";

const {Option} = Select;

interface UserAddProps extends ModalsProps {
    tags: string[],
}

const UserAdd: React.FC<UserAddProps> = (props: UserAddProps) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const formSubmitHandler = () => {
        let formValues = form.getFieldsValue();
        formValues = {
            ...formValues,
            expired_at: moment(formValues.expired_at)
                .format("YYYY-MM-DD HH:mm:ss"),
        };

        // dispatch(editUser(props.user.id, formValues)) TODO create user

        form.submit();
        props.setVisible(false);
    };

    return (
        <>
            <Modal
                title="Add new user"
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                onOk={formSubmitHandler}
                destroyOnClose
            >
                <Form
                    form={form}
                    onFinish={(values: any) => {
                        console.dir(values);
                    }}
                    onError={() => {
                        console.log("error");
                    }}
                    layout="vertical"
                >
                    <Form.Item label="Token" name="token">
                        <Input placeholder="Token"/>
                    </Form.Item>
                    <Form.Item label="Name" name="name">
                        <Input placeholder="Name"/>
                    </Form.Item>
                    <Form.Item label="Role" name="role">
                        <Select placeholder="Role">
                            <Option value="root">root</Option>
                            <Option value="admin">admin</Option>
                            <Option value="root">seo</Option>
                            <Option value="admin">user</Option>
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

export default UserAdd;
