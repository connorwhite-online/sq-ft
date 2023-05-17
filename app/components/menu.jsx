import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function Menu() {

    const menuRef = useRef();

    useEffect(() => {
        let ctx = gsap.context(() => {
            let tl = gsap.timeline({});
                tl.from('.logoBox', {
                    duration: 1,
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
            <div className='logoBox'><img className='logo' src='./images/logo-full-black.svg' alt='sqft logo'></img></div>
            <div className='nav'>
                <div className='navItem'><a className='navLink'>Info</a></div>
            </div>
        </div>
    )
}