import React, {useState} from "react";

interface JsonLogDataToTemplateProps {
    log: any // TODO type
}

const JsonLogDataToTemplate: React.FC<JsonLogDataToTemplateProps> = (props: JsonLogDataToTemplateProps) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className="log-data">
            {
                Object.keys(props.log).filter((key: string) => {
                    return !["type_injects", "closed"].includes(key);
                }).map((key: string, id: number) => {
                    return (
                        <div key={id}>
                            {id >= 2 ? (
                                <div className="log-data-spoiler" style={{display: collapsed ? "none" : "block"}}>
                                    <div className="log-data-item" key={id}>
                                        <span className="log-data-span">{key}</span>
                                        <span className="log-data-span">{props.log[key]}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="log-data-item">
                                    <span className="log-data-span">{key}</span>
                                    <span className="log-data-span">{props.log[key]}</span>
                                </div>
                            )}
                        </div>
                    );
                })
            }

            {Object.keys(props.log).length > 2 && (
                <a
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(!collapsed);
                    }}
                >
                    {collapsed ? "Show more..." : "Show less..."}
                </a>
            )}
        </div>
    );
};

export default JsonLogDataToTemplate;
