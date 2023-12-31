import React from "react";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {Form, Input, Modal} from "antd";
import {editBotsComment} from "../../../Store/Bots/Actions";
import {useDispatch} from "react-redux";

const {TextArea} = Input;

const BotComment: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps) => {
    const [form] = Form.useForm();
    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
    };

    const dispatch = useDispatch();

    const formSubmit = () => {
        const comment: string = form.getFieldsValue()["comment"] as string;
        dispatch(editBotsComment(props.selectedBots.map((bot) => bot.id), comment));
        closeModal();
    };

    return (
        <Modal
            title="Edit bot comment"
            visible={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText="Save comment"
            width={340}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={formSubmit}>
                <Form.Item label="Enter comment" name="comment">
                    <TextArea placeholder="Comment..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BotComment;
