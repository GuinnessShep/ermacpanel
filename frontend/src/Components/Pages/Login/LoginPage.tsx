import React, {useEffect, useRef, useState} from "react";

import "../../../Assets/Styles/Auth/Auth.scss";
import {KeyOutlined, LockOutlined} from "@ant-design/icons";
import {authorize} from "../../../Store/Auth/Actions";
import {useDispatch} from "react-redux";
import Particles from "react-tsparticles";
import {ISourceOptions} from "tsparticles";

const particles: ISourceOptions = {
    background: {
        color: {
            value: "#191c24",
        },
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: "push",
            },
            onHover: {
                enable: true,
                mode: "repulse",
            },
            resize: true,
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
            },
            push: {
                quantity: 4,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
        },
    },
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800,
            },
        },
        color: {
            value: "#ffffff",
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
            },
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false,
            },
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
        },
        move: {
            enable: true,
            speed: 3,
            // direction: none,
            random: false,
            straight: false,
            // out_mode: out,
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
            },
        },
    },
    retina_detect: true,
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
                <Particles className="Auth-Particles" options={particles}/>
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
