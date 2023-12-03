import React from "react";
import {ModalsProps} from "../../../Model/Modal";
import {Form, Modal, Input} from "antd";
import {useDispatch} from "react-redux";
import {editCommentLogs} from "../../../Store/Logs/Actions";

const {TextArea} = Input;

interface LogCommentProps extends ModalsProps {
    logIds: number[],
}

const LogComment: React.FC<LogCommentProps> = (props: LogCommentProps) => {
    const [form] = Form.useForm();

    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
    };

    const dispatch = useDispatch();

    const formSubmit = () => {
        dispatch(editCommentLogs(props.logIds, form.getFieldValue("comment")));
        closeModal();
    };

    return (
        <Modal
            title="Log comment"
            visible={props.visible}
            onCancel={closeModal}
            okText="Save comment"
            onOk={() => form.submit()}
            width={300}
            destroyOnClose
        >
            <Form form={form} onFinish={formSubmit} layout="vertical">
                <Form.Item name="comment">
                    <TextArea placeholder="Comment text..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LogComment;
