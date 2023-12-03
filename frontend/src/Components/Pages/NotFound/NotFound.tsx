import React from "react";
import {Button, message, Result} from "antd";

const NotFound: React.FC = () => {
    return (
        <Result
            status="warning"
            title="404 - Page not found :\"
            subTitle="Sorry, the page you've looking for doesn't exist."
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
    );
};

export default NotFound;
