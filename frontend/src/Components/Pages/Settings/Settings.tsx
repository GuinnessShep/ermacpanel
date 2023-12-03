import React, {useState} from "react";
import {Button, Form, Input, Space} from "antd";
import {DeleteOutlined, PlusSquareOutlined} from "@ant-design/icons";

interface Contact {
    name: string,
    description: string,
}

const Settings: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);

    const formFinish = () => {
    };

    return (
        <>
            <div className="panel-header">
                <h2 className="panel-title">Settings</h2>
            </div>

            <div className="panel-content">
                <Form layout="vertical" onFinish={formFinish}>
                    {contacts?.map((contact: Contact, key: number) => {
                        return (
                            <Space size={15} key={key} style={{width: "100%", marginBottom: 5}}>
                                <Form.Item name={"name" + key} label="Name" rules={[{required: true, message: "Missing name"}]}>
                                    <Input type="text" value={contact.name} onChange={(e) => {
                                        contacts[key].name = e.currentTarget.value;
                                        setContacts([...contacts]);
                                    }}/>
                                </Form.Item>
                                <Form.Item name={"description" + key} label="Description" rules={[{required: true, message: "Missing description"}]}>
                                    <Input type="text" value={contact.description} onChange={(e) => {
                                        contacts[key].description = e.currentTarget.value;
                                        setContacts([...contacts]);
                                    }}/>
                                </Form.Item>

                                <Button
                                    shape="circle"
                                    type="primary"
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={() => {
                                        // TODO remove contact from state
                                    }}
                                />
                            </Space>
                        );
                    })}

                    <Space direction="vertical" size={15}>
                        <Button
                            type="dashed"
                            icon={<PlusSquareOutlined />}
                            onClick={() => setContacts([...contacts, {
                                name: "",
                                description: "",
                            }])}
                        >
                            Add contact
                        </Button>

                        <Button
                            htmlType="submit"
                            type="primary"
                        >
                            Save contacts
                        </Button>
                    </Space>
                </Form>
            </div>
        </>
    );
};

export default Settings;

/*
// interface Contacts {
//     name: string,
//     contact: string,
// }

const Settings: React.FC = () => {
    const [form] = useForm();
    // const [contacts, setContacts] = useState<Contacts[]>();

    const onFinish = (values: any) => {
        // setContacts(values);

        console.log(values);
    };

    return (
        <>
            <div className="panel-header">
                <h2 className="panel-title">Settings</h2>
            </div>

            <div className="panel-content">
                <Row>
                    <Col xl={6} md={12} sm={24} xs={24}>
                        <h3>Login page contacts list</h3>

                        <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                            <Form.List name="contacts">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map(({key, name, ...restField}) => (
                                            <Space key={key} style={{display: "flex", marginBottom: 8}} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "name"]}
                                                    rules={[{required: true, message: "Missing name"}]}
                                                >
                                                    <Input placeholder="Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "contact"]}
                                                    rules={[{required: true, message: "Missing contact"}]}
                                                >
                                                    <Input placeholder="Contact" />
                                                </Form.Item>
                                                <DeleteOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusSquareOutlined />}
                                            >
                                                Add contact
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Settings;

*/
