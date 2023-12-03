import React, {useLayoutEffect} from "react";
import {Button, Col, Form, Input, Modal, Row} from "antd";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {SimCardIcon} from "../../Misc/CustomIcons";
import {getBotsId} from "../../../Util/getBotIds";
import sendCommand from "../../../Requests/Commands/sendCommands";
import {inputRules} from "../../../Util/config";

const {TextArea} = Input;

const SendSms: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps) => {
    const [form] = Form.useForm();

    useLayoutEffect(() => {
        form.setFieldsValue({
            sim: "sim1",
        });
    }, [form]);

    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
        form.setFieldsValue({
            sim: "sim1",
        });
    };

    const submitCommand = () => {
        form.validateFields().then((fields) => {
            sendCommand({
                command: "sendSMS",
                payload: {
                    sim: fields["sim"] ?? "sim1",
                    text: fields["text"],
                    number: fields["number"],
                },
                botIds: getBotsId(props.selectedBots),
            });
            closeModal();
        });
    };

    const sendToAll = () => {
        form.setFieldsValue({
            number: "1",
        });
        form.validateFields().then((fields) => {
            sendCommand({
                command: "SendSMSALL",
                payload: {
                    sim: fields["sim"] ?? "sim1",
                    text: fields["text"],
                },
                botIds: getBotsId(props.selectedBots),
            });
            closeModal();
        }).catch(() => {
            form.setFieldsValue({
                number: "",
            });
        });
    };

    // const [phone, setPhone] = useState();

    return (
        <Modal
            title="Send SMS"
            visible={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText="Send SMS"
            width={340}
            destroyOnClose
            footer={[
                <>
                    <Button onClick={closeModal}>Close</Button>
                    <Button type="primary" onClick={sendToAll}>Send to all</Button>
                    <Button type="primary" onClick={submitCommand}>Send</Button>
                </>,
            ]}
        >
            <Form form={form} layout="vertical" onFinish={submitCommand}>
                <Form.Item
                    name="number"
                    label="Number"
                    rules={[
                        {
                            required: true,
                            message: "Field can`t be empty",
                        },
                    ]}
                >
                    <Input type="text" placeholder="Number"/>
                </Form.Item>
                {props.selectedBots.length === 1 && (
                    <Form.Item label="Select sim card" name="sim" valuePropName="value">
                        <Row gutter={15}>
                            <Col span={12}>
                                <label className={props.selectedBots[0].sim_data.operator ? "sim-card" : "sim-card disabled"}>
                                    <Input
                                        type="radio"
                                        name="sim"
                                        value={"sim1"}
                                        className="sim-card-radio"
                                        defaultChecked={true}
                                        disabled={!props.selectedBots[0].sim_data.operator}
                                    />
                                    <span className="sim-card-inner">
                                        <span className="sim-card-icon">
                                            <SimCardIcon/>
                                        </span>
                                        <span className="sim-card-info">
                                            <span className="sim-card-name">
                                                Sim #1
                                            </span>
                                            <span className="sim-card-provider">
                                                {props.selectedBots[0].sim_data.operator ? props.selectedBots[0].sim_data.operator : "Empty"}
                                            </span>
                                        </span>
                                    </span>
                                </label>
                            </Col>
                            <Col span={12}>
                                <label className={props.selectedBots[0].sim_data.operator1 ? "sim-card" : "sim-card disabled"}>
                                    <Input
                                        type="radio"
                                        name="sim"
                                        value={"sim2"}
                                        className="sim-card-radio"
                                        disabled={!props.selectedBots[0].sim_data.operator1}
                                    />
                                    <span className="sim-card-inner">
                                        <span className="sim-card-icon">
                                            <SimCardIcon/>
                                        </span>
                                        <span className="sim-card-info">
                                            <span className="sim-card-name">
                                                Sim #2
                                            </span>
                                            <span className="sim-card-provider">
                                                {props.selectedBots[0].sim_data.operator1 ? props.selectedBots[0].sim_data.operator1 : "Empty"}
                                            </span>
                                        </span>
                                    </span>
                                </label>
                            </Col>
                        </Row>
                    </Form.Item>
                )}
                <Form.Item
                    label="Type message"
                    name="text"
                    rules={inputRules}
                >
                    <TextArea placeholder="Type message..."/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SendSms;
