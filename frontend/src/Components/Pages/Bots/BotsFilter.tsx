import React, {useState} from "react";
import {Button, Col, Input, Row, Select, Tag} from "antd";
import {
    CloseCircleOutlined,
    CloseOutlined,
    HeartFilled,
    OrderedListOutlined,
    StopOutlined,
} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {changeBotsFilter} from "../../../Store/Bots/Actions";
import {DeadIcon, OfflineIcon, OnlineIcon} from "../../Misc/CustomIcons";
import {AppState} from "../../../Store/RootReducer";
import {InjectionFilter} from "../../../Store/Filters/Types";
import {getApiUrl} from "../../../Util/config";

const {Option} = Select;
const {Search} = Input;

const BotsFilter: React.FC = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state: AppState) => state.filters);
    const botReducer = useSelector((state: AppState) => state.bots);

    const injectionsFilterChange = (injections: string[]) => {
        dispatch(changeBotsFilter({
            injections: injections,
        }));
    };

    const countriesFilterChange = (countryCodes: string[]) => {
        dispatch(changeBotsFilter({
            countries: countryCodes,
        }));
    };

    const statusesFilterChange = (statuses: string[]) => {
        dispatch(changeBotsFilter({
            statuses: statuses,
        }));
    };

    const tagsFilterChange = (tags: string[]) => {
        dispatch(changeBotsFilter({
            tags: tags,
        }));
    };

    const typesFilterChange = (types: string[]) => {
        dispatch(changeBotsFilter({
            types: types,
        }));
    };

    const authReducer = useSelector((state: AppState) => state.auth);

    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

    // TODO разбить на подкомпоненты
    return (
        <div className="panel-content" style={{paddingBottom: 0}}>
            <Button
                type="primary"
                icon={showFiltersMobile ? <CloseOutlined /> : <OrderedListOutlined />}
                className="filter-show-button"
                onClick={() => {
                    setShowFiltersMobile(!showFiltersMobile);
                }}
            >
                {showFiltersMobile ? "Hide" : "Show"} Filters
            </Button>

            <div className={showFiltersMobile ? "filter show" : "filter"}>
                <div className="filter-inner">
                    <Row gutter={15}>
                        <Col xl={6} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}}>
                            <Select
                                mode="multiple"
                                placeholder="Country"
                                optionLabelProp="label"
                                className="panel-select"
                                allowClear
                                onChange={countriesFilterChange}
                                defaultValue={botReducer.filters.countries}
                                loading={!filters.isLoaded}
                            >
                                {Object.keys(filters.countries).map((countryCode: string, key: number) => {
                                    const countryName = filters.countries[countryCode];
                                    return (
                                        <Option value={countryCode} key={key}
                                            label={
                                                <>
                                                    <img
                                                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`}
                                                        width={16}
                                                        alt={countryName}
                                                    /> {countryName}
                                                </>
                                            }>
                                            <div className="option-label">
                                                <span role="img" aria-label={countryName}>
                                                    <img
                                                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`}
                                                        alt={countryName}
                                                        width={16}
                                                    />
                                                </span> {countryName}
                                            </div>
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Col>
                        <Col xl={6} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}}>
                            <Select
                                mode="multiple"
                                placeholder="Injections"
                                optionLabelProp="label"
                                className="panel-select"
                                onChange={injectionsFilterChange}
                                defaultValue={botReducer.filters.injections}
                                allowClear
                                loading={!filters.isLoaded}
                            >
                                {Object.keys(filters.injections).map((application: string, key: number) => {
                                    const injection: InjectionFilter = filters.injections[application];
                                    return (
                                        <Option key={key} value={application}
                                            label={
                                                <>
                                                    <img
                                                        src={getApiUrl(`injects/images/${injection.type}/${application}.png`)}
                                                        width={16}
                                                        alt={injection.name}
                                                    /> {injection.name}
                                                </>
                                            }
                                        >
                                            <div className="option-label">
                                                <span role="img" aria-label={injection.name}>
                                                    <img
                                                        src={getApiUrl(`injects/images/${injection.type}/${application}.png`)}
                                                        alt={injection.name}
                                                        width={16}
                                                    />
                                                </span> {injection.name}
                                            </div>
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Col>
                        {/* <Col xl={4} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}}>*/}
                        {/*    <RangePicker*/}
                        {/*        className="panel-select"*/}
                        {/*    />*/}
                        {/* </Col>*/}
                        <Col xl={4} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}}>
                            <Select
                                mode="multiple"
                                optionLabelProp="label"
                                className="panel-select"
                                placeholder="Status"
                                onChange={statusesFilterChange}
                                defaultValue={botReducer.filters.statuses}
                                allowClear
                                loading={!botReducer.isLoaded}
                            >
                                <Option value="online"
                                    label={
                                        <>
                                            <OnlineIcon /> Online
                                        </>
                                    }>
                                    <div className="option-label">
                                        <OnlineIcon /> Online
                                    </div>
                                </Option>
                                <Option value="offline"
                                    label={
                                        <>
                                            <OfflineIcon /> Offline
                                        </>
                                    }>
                                    <div className="option-label">
                                        <OfflineIcon /> Offline
                                    </div>
                                </Option>
                                <Option value="dead"
                                    label={
                                        <>
                                            <DeadIcon /> Removed app
                                        </>
                                    }>
                                    <div className="option-label">
                                        <DeadIcon /> Removed app
                                    </div>
                                </Option>
                            </Select>
                        </Col>
                        <Col xl={4} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}}>
                            <Select
                                mode="multiple"
                                optionLabelProp="label"
                                className="panel-select select-tags"
                                placeholder="Tags"
                                onChange={tagsFilterChange}
                                defaultValue={
                                    botReducer.filters.tags.length !== authReducer.user.tags.length &&
                                    botReducer.filters.tags.length !== 0 ?
                                        botReducer.filters.tags :
                                        authReducer.user.tags
                                }
                                allowClear
                                loading={!authReducer.isLoaded}
                            >
                                {authReducer.user.tags.map((tag, id) => (
                                    <Option value={tag} label={tag} key={id}>
                                        <Tag color="#177ddc">
                                            {tag}
                                        </Tag>
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xl={4} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}}>
                            <Select
                                mode="multiple"
                                optionLabelProp="label"
                                className="panel-select"
                                placeholder="Types"
                                onChange={typesFilterChange}
                                defaultValue={botReducer.filters.types}
                                allowClear
                                loading={!botReducer.isLoaded}
                            >
                                <Option value="favorite"
                                    label={
                                        <>
                                            <HeartFilled className="filter-tag filter-favorite active"/> Favorite
                                        </>
                                    }
                                >
                                    <div className="option-label">
                                        <HeartFilled className="filter-tag filter-favorite active"/> Favorite
                                    </div>
                                </Option>
                                <Option value="blacklisted"
                                    label={
                                        <>
                                            <CloseCircleOutlined className="filter-tag filter-blacklisted active"/> Blacklisted
                                        </>
                                    }
                                >
                                    <div className="option-label">
                                        <StopOutlined className="filter-tag filter-blacklisted active"/> Blacklisted
                                    </div>
                                </Option>
                            </Select>
                        </Col>
                        <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                            <Search
                                name={"searchQuery"}
                                defaultValue={botReducer.filters.query}
                                className="panel-select"
                                enterButton="Search"
                                placeholder="Search..."
                                onSearch={(searchQuery: string) => {
                                    dispatch(changeBotsFilter({
                                        query: searchQuery,
                                    }));
                                }}
                                loading={!botReducer.isLoaded}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default BotsFilter;
