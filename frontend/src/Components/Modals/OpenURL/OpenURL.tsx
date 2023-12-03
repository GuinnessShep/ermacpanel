import React from "react";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {Form, Input, Modal} from "antd";
import {getBotsId} from "../../../Util/getBotIds";
import {inputRules} from "../../../Util/config";
import sendCommand from "../../../Requests/Commands/sendCommands";

const OpenURL: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps) => {
    const [form] = Form.useForm();
    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
    };
    const formSubmit = () => {
        sendCommand({
            command: "openUrl",
            payload: form.getFieldsValue(),
            botIds: getBotsId(props.selectedBots),
        });

        closeModal();
    };

    return (
        <Modal
            title="Open URL"
            visible={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText="Open URL"
            width={340}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={formSubmit}>
                <Form.Item label="Enter website" name="url" rules={inputRules}>
                    <Input placeholder="https://enter.website/" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default OpenURL;
