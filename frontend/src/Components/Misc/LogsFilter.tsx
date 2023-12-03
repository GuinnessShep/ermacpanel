import React from "react";
import {Col, Input, Row, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../Store/RootReducer";
import {changeLogsFilters} from "../../Store/Logs/Actions";
import {InjectionFilter} from "../../Store/Filters/Types";
import {customStyles, getApiUrl} from "../../Util/config";
import CreatableSelect from "react-select/creatable";
import {logsType} from "./BotLogsTable";

const {Search} = Input;
// const {Option} = Select;

interface LogsFilterProps {
    logsType: logsType,
}

const LogsFilter: React.FC<LogsFilterProps> = (props: LogsFilterProps) => {
    const dispatch = useDispatch();
    const filters = useSelector((state: AppState) => state.filters);

    const injectionsFilterChange = (application: string) => {
        dispatch(changeLogsFilters({
            application: application,
        }));
    };

    const renderTitle = (title: string) => (
        <span>
            {title}
        </span>
    );

    const renderItem = (app: string, icon: string) => ({
        value: app,
        label: (
            <Space size={10}>
                <img width={16} src={icon} alt={app} />
                {app}
            </Space>
        ),
    });

    const applications: any[] = [];

    if (filters.isLoaded) {
        Object.keys(filters.applications[props.logsType]).map((application: string, key: number) => {
            const injection: InjectionFilter = filters.applications[props.logsType][application];

            applications.push({
                label: renderTitle(application),
                options: [renderItem(application, getApiUrl(`injects/images/${injection.type}/${application}.png`))],
            });
        });
    }

    return (
        <div className="panel-content">
            <Row gutter={15}>
                <Col xl={6} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}}>
                    <Search name={"searchQuery"} className="panel-select"
                        enterButton="Search" placeholder="Search..." onSearch={(searchQuery: string) => {
                            dispatch(changeLogsFilters({
                                query: searchQuery,
                            }));
                        }}/>
                </Col>
                <Col xl={6} lg={8} md={12} sm={24} xs={24} style={{marginBottom: 15}}>
                    <CreatableSelect
                        styles={customStyles}
                        options={applications}
                        onChange={(value) => {
                            if (!value) {
                                injectionsFilterChange("");
                            } else {
                                injectionsFilterChange(value.value);
                            }
                        }}
                        placeholder="Select application"
                        formatCreateLabel={(label: string) => label}
                        isClearable
                    />
                </Col>
            </Row>
        </div>
    );
};

export default LogsFilter;
