import React, {useLayoutEffect} from "react";
import {Col, Row, Spin, Table} from "antd";
import {Line, Pie} from "@ant-design/charts";
import {WorldMap} from "react-svg-worldmap";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {getStatsList} from "../../../Store/Stats/Actions";
import {StatsBotsCountry} from "../../../Store/Stats/Types";

const GeneralStats: React.FC = () => {
    const statsReducer = useSelector((state: AppState) => state.stats);

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(getStatsList());
    }, [dispatch]);

    const columns = [
        {
            title: "Country",
            dataIndex: "country",
            key: "country",
            render: (text: string, country: StatsBotsCountry) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Country</b>
                    </div>
                    <div className="table-col-item">
                        <img
                            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.country_code.toUpperCase()}.svg`}
                            alt={text}
                            width={16}
                        /> {text}
                    </div>
                </div>
            ),
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "count",
            width: 80,
            render: (text: string) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Count</b>
                    </div>
                    <div className="table-col-item">
                        {text}
                    </div>
                </div>
            ),
        },
        {
            title: "%",
            dataIndex: "percent",
            key: "percent",
            width: 50,
            render: (text: string) => (
                <div className="table-col">
                    <div className="table-col-item">
                        <b>Percent</b>
                    </div>
                    <div className="table-col-item">
                        {text} %
                    </div>
                </div>
            ),
        },
    ];

    const InjectsLine = () => {
        const COLOR_PLATE_10 = [
            "#5B8FF9",
            "#5AD8A6",
            "#5D7092",
            "#F6BD16",
            "#E8684A",
            "#6DC8EC",
            "#9270CA",
            "#FF9D4D",
            "#269A99",
            "#FF99C3",
        ];
        // const container = document.getElementById('container');
        const config = {
            data: statsReducer.injects.timelines,
            xField: "date",
            yField: "count",
            seriesField: "category",
            yAxis: {
                label: {
                    formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                },
            },
            color: COLOR_PLATE_10,
            point: {
                shape: ({category}: any) => {
                    return category === "Gas fuel" ? "square" : "circle";
                },
                style: ({year}: any) => {
                    return {
                        r: Number(year) % 4 ? 0 : 3,
                    };
                },
            },
            slider: {
                start: 0,
                end: 1,
            },
            loading: !statsReducer.isLoaded,
        };

        return <Line {...config} />;
    };

    const StatsLine = () => {
        const COLOR_PLATE_10 = [
            "#5B8FF9",
            "#5AD8A6",
            "#5D7092",
            "#F6BD16",
            "#E8684A",
            "#6DC8EC",
            "#9270CA",
            "#FF9D4D",
            "#269A99",
            "#FF99C3",
        ];
        const config = {
            data: statsReducer.logs.timelines,
            xField: "date",
            yField: "count",
            seriesField: "category",
            yAxis: {
                label: {
                    formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                },
            },
            color: COLOR_PLATE_10,
            point: {
                shape: ({category}: any) => {
                    return category === "Gas fuel" ? "square" : "circle";
                },
                style: ({year}: any) => {
                    return {
                        r: Number(year) % 4 ? 0 : 3,
                    };
                },
            },
            slider: {
                start: 0,
                end: 1,
            },
            loading: !statsReducer.isLoaded,
        };

        return <Line {...config} />;
    };

    const InjectsPie = () => {
        const data = [
            {
                type: "Banks",
                value: statsReducer.injects.counts.banks,
            },
            {
                type: "Cards",
                value: statsReducer.injects.counts.credit_cards,
            },
            {
                type: "Shops",
                value: statsReducer.injects.counts.shops,
            },
            {
                type: "Crypt",
                value: statsReducer.injects.counts.crypt,
            },
            {
                type: "Emails",
                value: statsReducer.injects.counts.emails,
            },
            {
                type: "Wallets",
                value: statsReducer.injects.counts.wallets,
            },
            {
                type: "Stealers",
                value: statsReducer.injects.counts.stealers,
            },
        ];
        const config = {
            appendPadding: 10,
            data,
            angleField: "value",
            colorField: "type",
            radius: 1,
            innerRadius: 0.6,
            label: {
                type: "inner",
                offset: "-50%",
                content: "{value}",
                style: {
                    textAlign: "center",
                    fontSize: 14,
                },
            },
            interactions: [
                {
                    type: "element-selected",
                },
                {
                    type: "element-active",
                },
            ],
            statistic: {
                title: false,
                content: {
                    style: {
                        whiteSpace: "pre-wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#fff",
                        fontSize: "1.3rem",
                    },
                    content: "Total\n" + statsReducer.injects.counts.sum,
                },
            },
            loading: !statsReducer.isLoaded,
        };
        // @ts-ignore TODO
        return <Pie {...config} />;
    };

    const StatsPie = () => {
        const data = [
            {
                type: "logsBotsSMS",
                value: statsReducer.logs.counts.smslist,
            },
            {
                type: "logsHideSMS",
                value: statsReducer.logs.counts.hidesms,
            },
            {
                type: "logsGoogleAuth",
                value: statsReducer.logs.counts.googleauth,
            },
            {
                type: "logsOtherAccounts",
                value: statsReducer.logs.counts.otheraccounts,
            },
            {
                type: "Keylogger",
                value: statsReducer.logs.counts.datakeylogger,
            },
            {
                type: "logsPushList",
                value: statsReducer.logs.counts.pushlist,
            },
        ];
        const config = {
            appendPadding: 10,
            data,
            angleField: "value",
            colorField: "type",
            radius: 1,
            innerRadius: 0.6,
            label: {
                type: "inner",
                offset: "-50%",
                content: "{value}",
                style: {
                    textAlign: "center",
                    fontSize: 14,
                },
            },
            interactions: [
                {
                    type: "element-selected",
                },
                {
                    type: "element-active",
                },
            ],
            statistic: {
                title: false,
                content: {
                    style: {
                        whiteSpace: "pre-wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#fff",
                        fontSize: "1.3rem",
                    },
                    content: "Total\n" + statsReducer.logs.counts.sum,
                },
            },
            loading: !statsReducer.isLoaded,
        };
        // @ts-ignore TODO
        return <Pie {...config} />;
    };

    const worldMapData = statsReducer.bots.countries.map((countryData: StatsBotsCountry) => {
        return {
            country: countryData.country_code.toLowerCase(),
            value: countryData.count,
        };
    });

    return (
        <>
            <div className="panel-header">
                <h2 className="panel-title">General Stats</h2>
            </div>

            <div className="panel-content">
                <Row gutter={15}>
                    <Col xl={4} md={12} sm={24} xs={24}>
                        <div className="stat-card has-new-data">
                            <div className="stat-body">
                                <div className="stat-value">
                                    {statsReducer.isLoaded ? (
                                        <>
                                            {statsReducer.bots.counts.total}
                                            {statsReducer.bots.counts.totalToday > 0 && (
                                                <sup>{statsReducer.bots.counts.totalToday}</sup>
                                            )}
                                        </>
                                    ) : (
                                        <Spin />
                                    )}

                                </div>

                                <div className="stat-name">Total bots</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={4} md={12} sm={24} xs={24}>
                        <div className="stat-card has-new-data lost">
                            <div className="stat-body">
                                <div className="stat-value">
                                    {statsReducer.isLoaded ? (
                                        statsReducer.bots.counts.online
                                    ) : (
                                        <Spin />
                                    )}
                                </div>
                                <div className="stat-name">Online bots</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={4} md={12} sm={24} xs={24}>
                        <div className="stat-card">
                            <div className="stat-body">
                                <div className="stat-value">
                                    {statsReducer.isLoaded ? (
                                        statsReducer.bots.counts.offline
                                    ) : (
                                        <Spin />
                                    )}
                                </div>
                                <div className="stat-name">Offline bots</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={4} md={12} sm={24} xs={24}>
                        <div className="stat-card">
                            <div className="stat-body">
                                <div className="stat-value">
                                    {statsReducer.isLoaded ? (
                                        statsReducer.bots.counts.dead
                                    ) : (
                                        <Spin />
                                    )}
                                </div>
                                <div className="stat-name">Removed app bots</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={4} md={12} sm={24} xs={24}>
                        <div className="stat-card">
                            <div className="stat-body">
                                <div className="stat-value">
                                    {statsReducer.isLoaded ? (
                                        statsReducer.bots.counts.permissionless
                                    ) : (
                                        <Spin />
                                    )}
                                </div>
                                <div className="stat-name">Permissionless bots</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={4} md={12} sm={24} xs={24}>
                        <div className="stat-card">
                            <div className="stat-body">
                                <div className="stat-value">
                                    {statsReducer.isLoaded ? (
                                        statsReducer.bots.counts.withPermissions
                                    ) : (
                                        <Spin />
                                    )}
                                </div>
                                <div className="stat-name">Bots with permissions</div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row gutter={15}>
                    <Col xl={12} md={12} sm={24} xs={24}>
                        <div className="stat-card stat-card-chart">
                            <div className="stat-head">
                                <h2>Injects stats timeline</h2>
                                <h4>Total: <b>
                                    {statsReducer.isLoaded ? (
                                        statsReducer.injects.counts.sum
                                    ) : (
                                        <Spin />
                                    )}
                                </b></h4>
                            </div>
                            <div className="stat-chart">
                                <InjectsLine />
                            </div>
                        </div>
                    </Col>
                    <Col xl={12} md={12} sm={24} xs={24}>
                        <div className="stat-card stat-card-chart">
                            <div className="stat-head">
                                <h2>Logs stats timeline</h2>
                                <h4>Total: <b>
                                    {statsReducer.isLoaded ? (
                                        statsReducer.logs.counts.sum
                                    ) : (
                                        <Spin />
                                    )}
                                </b></h4>
                            </div>
                            <div className="stat-chart">
                                <StatsLine />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row gutter={15}>
                    <Col xl={12} md={12} sm={24} xs={24}>
                        <div className="stat-card stat-card-chart">
                            <div className="stat-head">
                                <h2>Injects stats</h2>
                                <h4>Total: <b>{statsReducer.injects.counts.sum}</b></h4>
                            </div>
                            <div className="stat-chart">
                                <InjectsPie />
                            </div>
                        </div>
                    </Col>
                    <Col xl={12} md={12} sm={24} xs={24}>
                        <div className="stat-card stat-card-chart">
                            <div className="stat-head">
                                <h2>Logs stats</h2>
                                <h4>Total: <b>{statsReducer.logs.counts.sum}</b></h4>
                            </div>
                            <div className="stat-chart">
                                <StatsPie />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row gutter={15}>
                    <Col xl={12} md={12} sm={24} xs={24}>
                        <div className="stat-card stat-card-chart">
                            <div className="stat-head">
                                <h2>Bots by countries</h2>
                            </div>
                            <div className="stat-body stat-body-inner">
                                <div className="table-scroll" style={{maxHeight: 500, overflowY: "auto"}}>
                                    <Table
                                        columns={columns}
                                        dataSource={statsReducer.bots.countries}
                                        size="small"
                                        pagination={false}
                                        className="not-responsive"
                                        loading={!statsReducer.isLoaded}
                                        rowKey="country_code"
                                    />
                                </div>

                            </div>
                        </div>
                    </Col>

                    <Col xl={12} md={12} sm={24} xs={24}>
                        <div className="stat-card stat-card-chart">
                            <div className="stat-body stat-body-inner" style={{
                                display: "flex",
                                justifyContent: "center",
                                textAlign: "center",
                                alignItems: "center",
                            }}>
                                {statsReducer.isLoaded ? (
                                    <WorldMap
                                        color="#177ddc"
                                        value-suffix="Bots"
                                        size="lg"
                                        data={worldMapData}
                                    />
                                ) : (
                                    <Spin size="large" style={{transform: "scale(4)"}} />
                                )}
                            </div>
                        </div>

                    </Col>
                </Row>
            </div>
        </>
    );
};

export default GeneralStats;
