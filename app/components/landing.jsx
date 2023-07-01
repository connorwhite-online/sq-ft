import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Landing() {

    const landingRef = useRef();

    useEffect(() => {
        let ctx = gsap.context(() => {
            let tl = gsap.timeline({});
                tl.to(landingRef.current, {visibility: 'visible', duration: .25});
                tl.from('.imageContainer', {
                    duration: 1,
                    delay: .5,
                    clipPath: 'inset(0 100% 0 0)',
                    ease: 'power4.inOut',
                });
                tl.from('.header', {
                    duration: 2,
                    delay: .5,
                    clipPath: 'inset(0 0 100% 0)',
                    opacity: 0,
                    ease: 'power4.inOut',
                });
        }, landingRef.current);
        return () => ctx.revert();
    }, [])

    return (
        <div className='home' ref={landingRef}>
            <div className="imageContainer">
                <img src='./images/P-30-tint.jpg' alt='home' className='homeImage' />
            </div>
            <div className='header'>
                <div className='headerCopy'>
                    Sq Ft magazine tells stories from the heart and outskirts of the world of art and design. We shine a light on artists and art lovers, and dissect how they shape and are shaped by the spaces they occupy.
                </div>
            </div>
        </div>
    )
}