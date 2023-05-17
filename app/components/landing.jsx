import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Landing() {

    const landingRef = useRef();

    useEffect(() => {
        let ctx = gsap.context(() => {
            let tl = gsap.timeline({});
                tl.from('.imageContainer', {
                    duration: 2,
                    opacity: 0,
                    ease: 'power3.inOut',
                });
                tl.from('.headerCopy', {
                    duration: 1,
                    opacity: 0,
                    y: 100,
                    ease: 'power3.inOut',
                });
        }, landingRef.current);
        return () => ctx.revert();
    }, [])

    return (
        <div className='home' ref={landingRef}>
            <div className="imageContainer">
                <img src='./images/P-30.jpeg' alt='home' className='homeImage' />
            </div>
            <div className='header'>
                <h1 className='headerCopy'>
                    Sq Ft magazine tells stories from the heart and outskirts of the world of art and design. We shine a light on artists and art lovers, and dissect how they shape and are shaped by the spaces they occupy.
                </h1>
            </div>
        </div>
    )
}