import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Landing() {
    const landingRef = useRef();
    const imageRef = useRef();

    useEffect(() => {
        // Preload the image
        const preloadImage = new Image();
        preloadImage.src = './images/P-30-tint.png';

        let ctx = gsap.context(() => {
            let tl = gsap.timeline({paused: true});
            
            tl.from('.imageContainer', {
                duration: 1,
                delay: .5,
                clipPath: 'inset(0 100% 0 0)',
                ease: 'power4.inOut',
            });

            tl.from('.header', {
                duration: 2,
                delay: .5,
                opacity: 0,
                ease: 'power4.inOut',
            });

            // Start animation when image is loaded
            preloadImage.onload = () => {
                tl.play();
            };

        }, landingRef.current);
        return () => ctx.revert();
    }, []);

    return (
        <div className='home' ref={landingRef}>
            <div className="imageContainer">
                <img 
                    ref={imageRef}
                    src='./images/P-30-tint.png' 
                    alt='home' 
                    className='homeImage'
                />
            </div>
            <div className='header'>
                <div className='headerCopy'>
                    Sq Ft magazine tells stories from the heart and outskirts of the world of art and design. We shine a light on artists and art lovers, and dissect how they shape and are shaped by the spaces they occupy.
                </div>
            </div>
        </div>
    );
}