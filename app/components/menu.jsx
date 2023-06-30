import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function Menu() {

    const menuRef = useRef();

    // Menu Loading Animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            let tl = gsap.timeline({});
                tl.to(menuRef.current, {visibility: 'visible', duration: .25});
                tl.from('.logoBox', {
                    duration: 1,
                    delay: 1,
                    opacity: 0,
                    ease: 'power3.inOut',
                });
                tl.from('.navItem', {
                    duration: 1,
                    opacity: 0,
                    y: -100,
                    ease: 'power3.inOut',
                });
        }, menuRef.current);
        return () => ctx.revert();
    }, []);

    return (
        <div className='menu' ref={menuRef}>
            <div className='logoBox'><a href="/"><img className='logo' src='./images/logo-full-light.svg' alt='sqft logo'></img></a></div>
            <div className='nav'>
                <div className='navItem'><a className='navLink' href="mailto:sqftmag@gmail.com" >Contact</a></div>
            </div>
        </div>
    )
}