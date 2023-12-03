import React from "react";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {AutoComplete, Form, Input, Modal, Space} from "antd";
import {getBotsId} from "../../../Util/getBotIds";
import {getApiUrl, inputRules} from "../../../Util/config";
import sendCommand from "../../../Requests/Commands/sendCommands";
import {useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";

const SendPush: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps) => {
    const [form] = Form.useForm();

    const renderTitle = (title: string) => (
        <span>
            {title}
        </span>
    );

    const filtersReducer = useSelector((state: AppState) => state.filters);

    const renderItem = (app: string, icon: string) => ({
        value: app,
        label: (
            <Space size={10}>
                <img width={16} src={icon} alt={app} />
                {app}
            </Space>
        ),
    });

    const options: any[] = [];

    {Object.keys(filtersReducer.injections).map((application: string, key: number) => {
        const injection = filtersReducer.injections[application];
        options.push({
            label: renderTitle(application),
            options: [renderItem(application, getApiUrl(`injects/images/${injection.type}/${application}.png`))],
        });
    });}

    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
    };
    const formSubmit = () => {
        sendCommand({
            command: "push",
            payload: form.getFieldsValue(["title", "text", "app"]),
            botIds: getBotsId(props.selectedBots),
        });

        closeModal();
    };

    return (
        <Modal
            title="Send push"
            visible={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText="Send push"
            width={340}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={formSubmit}>
                <Form.Item label="Push title" name="title" rules={inputRules}>
                    <Input placeholder="Push title"/>
                </Form.Item>

                <Form.Item label="Push text" name="text" rules={inputRules}>
                    <Input placeholder="Push text"/>
                </Form.Item>

                <Form.Item label="Application" name="app" rules={inputRules}>
                    <AutoComplete options={options} className="select_inject">
                        <Input size="large" placeholder="Select app" />
                    </AutoComplete>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SendPush;
