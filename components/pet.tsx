import React, {useEffect} from 'react';
import gsap from 'gsap';
import AudioPlayer from "./audio";

const CatBackground = () => {
    useEffect(() => {
        console.clear();

        gsap.defaults({
            ease: "linear",
            duration: 1
        });


        gsap.set("#smoke", {
            x: 10,
            y: 5
        });

        gsap.to("#smoke", {
            rotation: -360,
            transformOrigin: "center",
            duration: 5,
            repeat: -1
        });

        gsap.to("#smoke", {
            y: 10,
            duration: 5,
            repeat: -1,
            yoyo: true
        });

///tail///

        let tail = gsap.timeline({repeat: -1, yoyo: true,});

        tail.to("#tail", {
            ease: "power1.in",
            morphSVG: {shape: "M506.637,298.528L506.637,350.214"},
            duration: 0.5,
            delay: 3
        })
            .to("#tail", {
                ease: "power1.out",
                morphSVG: {shape: "M506.637,298.528L506.637,323.299C506.637,323.299 506.699,350.214 534.849,350.214"}
            })

///skate//

        let skate = gsap.timeline({repeat: -1,});

        skate
            .to("#skateCat", {
                x: 20,
                delay: 4 + 0.5,
                ease: "power1.inOut"
            })
            .to("#skateCat", {
                x: 0,
                delay: 2.5,
                ease: "power1.inOut"
            });

        let bump = gsap.timeline({repeat: -1});
        let bumpDura = 0.2;

        bump
            .to("#skate, #cat", {
                y: -2,
                delay: 3,
                duration: bumpDura
            }, 0)
            .to("#skate, #cat", {
                y: 0,
                duration: bumpDura
            })
            .to("#tire-front, #tire-back", {
                y: -2,
                delay: 3,
                duration: bumpDura,
                stagger: 0.2
            }, 0)
            .to("#tire-front, #tire-back", {
                y: 0,
                duration: bumpDura,
                stagger: 0.2
            })
            .to("#face", {
                y: -2,
                delay: 3,
                duration: bumpDura,
            }, 0.1)
            .to("#face", {
                y: 0,
                duration: bumpDura,
            });

//tires//
        let tires = gsap.timeline({repeat: -1});

        tires.to('#tire-front, #tire-back', {
            rotation: 360,
            transformOrigin: "center",
            duration: 0.5
        });
//cat//
        gsap.to("#left-hand", {
            rotate: -20,
            transformOrigin: "top",
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "power1.inOut"
        });
///zzz///
        gsap.set('#fly', {
            x: 70,
            y: 50,
            scale: 1.4
        });

        gsap.to(".zzz", {
            x: "random(-80, -150)",
            y: "random(-80, -30)",
            rotation: "random(20,120)",
            duration: 3,
            repeat: -1,
            opacity: 0,
            stagger: {
                each: 1.2,
            }
        })
    }, []);

    return (
        <div className="box">
            <svg viewBox="200 0 650 360" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="none"
                 strokeLinejoin="round" strokeMiterlimit="1.5">
                <path fill="none" d="M0 0h800v600H0z"/>
                <path id="shadow" d="M560.946 357.995H340.815" fill="none" stroke="#bddad8" strokeWidth="7.5"/>
                <path id="smoke"
                      d="M293.773 327.336c0-12.15-9.865-22.014-22.015-22.014-12.149 0-22.014 9.864-22.014 22.014-6.075-10.522-19.549-14.132-30.071-8.057-10.523 6.075-14.133 19.549-8.058 30.071-10.522-6.074-23.997-2.464-30.072 8.058-6.075 10.522-2.464 23.997 8.058 30.072-12.15 0-22.014 9.864-22.014 22.014 0 12.15 9.864 22.014 22.014 22.014-10.522 6.075-14.133 19.55-8.058 30.072 6.075 10.522 19.55 14.133 30.072 8.058-6.075 10.522-2.465 23.997 8.058 30.072 10.522 6.075 23.996 2.464 30.071-8.058 0 12.15 9.865 22.014 22.014 22.014 12.15 0 22.015-9.864 22.015-22.014 6.075 10.522 19.549 14.133 30.071 8.058 10.523-6.075 14.133-19.55 8.058-30.072 10.522 6.075 23.997 2.464 30.072-8.058 6.075-10.522 2.464-23.997-8.058-30.072 12.15 0 22.014-9.864 22.014-22.014 0-12.15-9.864-22.014-22.014-22.014 10.522-6.075 14.133-19.55 8.058-30.072-6.075-10.522-19.55-14.132-30.072-8.058 6.075-10.522 2.465-23.996-8.058-30.071-10.522-6.075-23.996-2.465-30.071 8.057z"
                      fill="#bddad8"/>
                <path fill="#f5f5fa" d="M0 357.995h800V600H0z"/>
                <g id="skateCat">
                    <g id="fly">
                        <path className="zzz" d="M333.148 242.371h6.881l-6.943 6.943h6.631" fill="none" stroke="#ffae23"
                              strokeWidth="2" strokeLinecap="round"/>
                        <circle className="zzz" cx="336.557" cy="245.842" r="2.132" fill="none" stroke="#fff"
                                strokeWidth="2"/>
                        <path className="zzz" d="M333.148 242.371h6.881l-6.943 6.943h6.631" fill="none" stroke="#ffae23"
                              strokeWidth="2" strokeLinecap="round"/>
                        <circle className="zzz" cx="336.557" cy="245.842" r="2.132" fill="#fff"/>
                        <path className="zzz" d="M333.148 242.371h6.881l-6.943 6.943h6.631" fill="none" stroke="#ffae23"
                              strokeWidth="2" strokeLinecap="round"/>
                        <circle className="zzz" cx="336.557" cy="245.842" r="2.132" fill="#fff"/>
                        <path className="zzz" d="M333.148 242.371h6.881l-6.943 6.943h6.631" fill="none" stroke="#ffae23"
                              strokeWidth="2" strokeLinecap="round"/>
                        <circle className="zzz" cx="336.557" cy="245.842" r="2.132" fill="none" stroke="#fff"
                                strokeWidth="2"/>
                    </g>
                    <g id="skate">
                        <path
                            d="M498.607 324.387h35.908l-8.977 18.645h-17.954l-8.977-18.645zM372.77 324.387h35.909l-8.978 18.645h-17.954l-8.977-18.645z"
                            fill="#ffae23"/>
                        <path id="board"
                              d="M567.206 301.424l-19.192 12.636a36.358 36.358 0 01-19.991 5.99H378.041a36.357 36.357 0 01-19.99-5.99l-19.193-12.636a3.503 3.503 0 00-3.853 5.852l19.193 12.636a43.363 43.363 0 0023.843 7.144h149.982a43.364 43.364 0 0023.844-7.144l19.192-12.636a3.506 3.506 0 001-4.853 3.505 3.505 0 00-4.853-.999z"
                              fill="#556f80"/>
                    </g>
                    <g id="tire-front">
                        <g id="tire">
                            <circle cx="516.487" cy="340.43" r="16.043" fill="#fff"/>
                            <g fill="#bddad8">
                                <path
                                    d="M524.617 342.274a5.714 5.714 0 00-5.712-5.712h-4.835a5.715 5.715 0 00-5.713 5.712 5.716 5.716 0 005.713 5.713h4.835a5.715 5.715 0 005.712-5.713z"/>
                                <path
                                    d="M521.978 334.363a.783.783 0 011.384.438l.288 3.693a2.279 2.279 0 01-2.961 2.352l-.004-.002a2.278 2.278 0 01-1.069-3.627l2.362-2.854zM511.163 334.316a.759.759 0 00-1.34.424l-.293 3.754a2.281 2.281 0 002.961 2.352l.004-.002a2.278 2.278 0 001.069-3.627l-2.401-2.901z"/>
                            </g>
                        </g>
                    </g>
                    <g id="tire-back">
                        <g id="tire1">
                            <circle cx="390.724" cy="340.43" r="16.043" fill="#fff"/>
                            <g fill="#bddad8">
                                <path
                                    d="M398.855 342.274a5.715 5.715 0 00-5.713-5.712h-4.835a5.715 5.715 0 00-5.713 5.712 5.716 5.716 0 005.713 5.713h4.835a5.716 5.716 0 005.713-5.713z"/>
                                <path
                                    d="M396.215 334.363a.784.784 0 011.384.438l.289 3.693a2.282 2.282 0 01-2.961 2.352l-.005-.002a2.278 2.278 0 01-1.069-3.627l2.362-2.854zM385.401 334.316a.76.76 0 00-1.341.424l-.293 3.754a2.281 2.281 0 002.961 2.352l.005-.002a2.278 2.278 0 001.068-3.627l-2.4-2.901z"/>
                            </g>
                        </g>
                    </g>
                    <g id="cat">
                        <path id="right-hand"
                              d="M399.588 305.324s-27.311-.341-25.911 8.246c1.027 6.301 8.592 7.007 14.778 7.167 6.187.16 36.063-.563 11.133-15.413z"
                              fill="#ffae23"/>

                        <path id="body"
                              d="M411.422 284.308s81.404-40.992 98.905-.679c11.659 26.856-7.93 42.028-43.527 42.028-23.361 0-43.863-1.588-52.67-5.836-8.807-4.248-2.708-35.513-2.708-35.513z"
                              fill="#ffae23"/>
                        <clipPath id="_clip1">
                            <path
                                d="M411.422 284.308s81.404-40.992 98.905-.679c11.659 26.856-7.93 42.028-43.527 42.028-23.361 0-43.863-1.588-52.67-5.836-8.807-4.248-2.708-35.513-2.708-35.513z"/>
                        </clipPath>
                        <g clipPath="url(#_clip1)" fill="#f3fdff">
                            <ellipse cx="446.33" cy="267.129" rx="6.745" ry="21.523"/>
                            <ellipse cx="464.042" cy="264.673" rx="6.745" ry="21.523"/>
                            <ellipse cx="480.341" cy="261.42" rx="6.745" ry="21.523"/>
                        </g>
                        <g id="face">
                            <path
                                d="M423.348 319.48s11.227-4.283 15.648-9.691c6.563-8.027 3.892-15.747 3.892-15.747l-11.031.387-8.509 25.051z"
                                fill="#303853" fillOpacity=".2"/>
                            <path
                                d="M410.032 266.05c18.134 0 32.856 12.256 32.856 27.352s-5.682 27.351-32.856 27.351c-27.175 0-32.857-12.255-32.857-27.351 0-15.096 14.723-27.352 32.857-27.352z"
                                fill="#ffae23"/>
                            <clipPath id="_clip2">
                                <path
                                    d="M410.032 266.05c18.134 0 32.856 12.256 32.856 27.352s-5.682 27.351-32.856 27.351c-27.175 0-32.857-12.255-32.857-27.351 0-15.096 14.723-27.352 32.857-27.352z"/>
                            </clipPath>
                            <g clipPath="url(#_clip2)">
                                <ellipse cx="411.177" cy="260.615" rx="6.738" ry="21.523" fill="#f3fdff"/>
                            </g>
                            <path
                                d="M388.329 263.888a3.454 3.454 0 014.853-.414c5.05 4.184 8.244 8.982 9.656 14.353a3.478 3.478 0 01-1.848 4.001c-5.62 2.725-11.188 3.166-16.712 1.656a3.48 3.48 0 01-2.544-3.674c.628-6.08 2.838-11.38 6.595-15.922z"
                                fill="#ffae23"/>
                            <path
                                d="M388.614 270.307a3.396 3.396 0 015.416-.539 11.542 11.542 0 012.509 3.539 3.49 3.49 0 01-2.203 4.826c-1.44.422-2.872.558-4.298.425a3.496 3.496 0 01-2.509-1.415 3.493 3.493 0 01-.59-2.819c.41-1.425.944-2.77 1.675-4.017z"
                                fill="#d7edee"/>
                            <path
                                d="M430.959 263.851a3.455 3.455 0 014.693 1.304c3.274 5.682 4.594 11.293 4.045 16.82a3.478 3.478 0 01-3.127 3.105c-6.217.594-11.59-.934-16.24-4.275a3.479 3.479 0 01-1.103-4.331c2.708-5.479 6.627-9.676 11.732-12.623z"
                                fill="#ffae23"/>
                            <path
                                d="M429.05 269.802a3.399 3.399 0 015.234 1.386 12.117 12.117 0 011.194 4.522 3.49 3.49 0 01-3.718 3.728 11.665 11.665 0 01-4.497-1.183 3.49 3.49 0 01-1.418-5.013c.937-1.303 1.985-2.462 3.205-3.44z"
                                fill="#d7edee"/>
                            <path
                                d="M395.324 306.77s-4.319-1.774-9.465-.34M421.684 306.77s4.319-1.774 9.465-.34M395.607 309.089s-3.765-.486-8.735 2.943M421.401 309.089s3.765-.486 8.734 2.943"
                                fill="none" stroke="#556f80" strokeWidth="2" strokeLinecap="round"/>
                            <path
                                d="M408.904 305.48a1.174 1.174 0 011.273.026c.166.106.317.226.458.355a1.456 1.456 0 01-.935 2.539c-.144 0-.289-.002-.434-.01a1.468 1.468 0 01-.871-2.577c.164-.107.329-.224.509-.333z"
                                fill="#556f80"/>
                            <path
                                d="M391.495 296.712c.993 1.432 3.476 2.14 5.121 2.13 1.987-.011 4.015-.608 5.028-2.13M416.205 296.712c.993 1.432 3.476 2.14 5.122 2.13 1.986-.011 4.014-.608 5.028-2.13"
                                fill="none" stroke="#556f80" strokeWidth="2" strokeLinecap="round"/>
                        </g>
                        <path id="leg"
                              d="M493.619 305.325s41.571-.432 39.44 10.42c-1.564 7.964-13.079 8.857-22.495 9.059-9.417.201-54.893-.712-16.945-19.479z"
                              fill="#ffae23"/>
                        <path d="M506.637 298.528v24.771s-.061 26.915-28.211 26.915" fill="none" stroke="#ffae23"
                              strokeWidth="14" strokeLinecap="round" id="tail"/>
                        <path id="left-hand"
                              d="M426.186 311.409s-15.939 22.179-8.101 25.956c5.751 2.771 10.668-3.022 14.345-7.998 3.678-4.977 20.216-29.869-6.244-17.958z"
                              fill="#ffae23"/>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default CatBackground;