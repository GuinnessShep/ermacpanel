import React, {useEffect, useRef, useState} from "react";
import Particles from "react-tsparticles";
import "../../Assets/Styles/Auth/Auth.scss";
import {KeyOutlined, LockOutlined} from "@ant-design/icons";
import {authorize} from "../../Store/Auth/Actions";
import {useDispatch} from "react-redux";

const particlesOptions = {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800,
            },
        },
        size: {
            value: 3,
        },
        color: {
            value: "#ffffff",
        },
        line_linked: {
            color: {
                value: "#ffffff",
            },
        },
    },
};

const LoginPage: React.FC = () => {
    const loginInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const [showParticles, setShowParticles] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowParticles(true);
        }, 500);
    }, []);

    const authSubmit = (e: any) => {
        e.preventDefault();
        if (loginInputRef.current && passwordInputRef.current) {
            dispatch(authorize(loginInputRef.current.value, passwordInputRef.current.value));
        }
    };

    return (
        <>
            {showParticles && (
                <Particles className="Auth-Particles" params={particlesOptions}/>
            )}

            <div className="Auth">
                <div className="Auth-inner">
                    <form className="Auth-Form" onSubmit={authSubmit}>
                        <h1 className="Auth-Form-title">Login</h1>

                        <div className="Auth-Form-row">
                            <label className="Auth-Form-label" htmlFor="token">Token</label>
                            <div className="Auth-Form-group">
                                <KeyOutlined />
                                <input
                                    id="token"
                                    className="Auth-Form-input"
                                    type="text"
                                    placeholder="Type your login token here..."
                                    ref={loginInputRef}
                                />
                            </div>
                        </div>
                        <div className="Auth-Form-row">
                            <label className="Auth-Form-label" htmlFor="password">Password</label>
                            <div className="Auth-Form-group">
                                <LockOutlined/>
                                <input
                                    id="password"
                                    className="Auth-Form-input"
                                    type="password"
                                    placeholder="password"
                                    ref={passwordInputRef}
                                />
                            </div>
                        </div>

                        <button className="Auth-Form-button" type="submit">
                            Enter
                        </button>

                        <div className="Auth-Form-footer">
                            <div><a href="xmpp:jabber@xmpp.jp">jabber@xmpp.jp</a> - APK Cryptor</div>
                            <div><a href="xmpp:jabber@xmpp.jp">jabber@xmpp.jp</a> - SEO </div>
                            <div><a href="xmpp:jabber@xmpp.jp">jabber@xmpp.jp</a> - INJECTIONS</div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
