import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import {useLoaderData } from '@remix-run/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import SplitText from './SplitText';
gsap.registerPlugin(ScrollTrigger);

// Component Imports
import Model from './model';

export default function Store() {

    // Get products from loader data
    const {products} = useLoaderData();
    const storeRef = useRef();

    // Button Hover In Animation
    const buttonHoverIn = () => {
        let ctx = gsap.context(() => {
            gsap.to('.productButton button', {
                duration: 0.5,
                color: '#fbf8f1',
                backgroundColor: '#000000',
                filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))',
                ease: 'power2.out',
            });
        }, storeRef.current);
        return () => ctx.revert();
    }

    // Button Hover Out Animation
    const buttonHoverOut = () => {
        let ctx = gsap.context(() => {
            gsap.to('.productButton button', {
                duration: 0.4,
                color: '#000000',
                backgroundColor: '#eae8de',
                filter: 'drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))',
                ease: 'power2.out',
            });
        }, storeRef.current);
        return () => ctx.revert();
    }

    // Store Loading Animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.webgl', {
                duration: 1.5,
                opacity: 0,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: '.webgl',
                    horizontal: getHorizontalSetting(),
                }
            });
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.product',
                    horizontal: getHorizontalSetting(),
                }
            });
                tl.from('.nameChar', {
                    duration: 0.8,
                    opacity: 0,
                    y: 25,
                    stagger: {
                        amount: 0.25,
                        from: "start"
                    },
                    ease: 'power3.out',
                }, 1);
                tl.from('.priceChar', {
                    duration: 0.8,
                    opacity: 0,
                    y: 25,
                    stagger: {
                        amount: 0.25,
                        from: "start"
                    },
                    ease: 'power3.out',
                }, 1.25);
                tl.from('.productDescription', {
                    duration: 1,
                    opacity: 0,
                    ease: 'power3.inOut',
                }, 2);
                tl.from('.productDetails', {
                    duration: 1,
                    opacity: 0,
                    ease: 'power3.inOut',
                }, 2.25);
                tl.from('.productButton', {
                    duration: 1,
                    opacity: 0,
                    ease: 'power3.inOut',
                }, 2.5);
        }, storeRef.current);

        function getHorizontalSetting() {
            return window.innerWidth >= 768;
          }
      
          function handleResize() {
            ScrollTrigger.refresh();
          }
      
          window.addEventListener('resize', handleResize);

        return () => {
            ctx.revert();
            window.removeEventListener('resize', handleResize);
        } 
    }, []); 

    return (
        <div className='store' ref={storeRef}>
            <div className='webgl'>
                <Canvas camera={{fov: 20}}>
                    <ambientLight />
                    {/* <mesh rotation-y={45}>
                        <boxBufferGeometry attach='geometry' args={[2, 3, .25]}/>
                        <meshStandardMaterial attach='material' color='turquoise' />
                    </mesh> */}
                    <Model />
                </Canvas>
            </div>
            <div className='product'>
                <div className='productName'>
                    <SplitText className="nameChar">{products[0].title}</SplitText>
                </div>
                <div className='productPrice'>
                    {(() => {
                        const price = Number(products[0].variants.nodes[0].price.amount).toFixed(2);
                        const formattedPrice = `$${price}`.replace(/,/g, '');
                        return (
                            <SplitText className="priceChar">{formattedPrice}</SplitText>
                        );
                    })()}
                </div>
                <div className='productDescription'>
                    {products[0].description}
                </div>
                <div className='productDetails'>
                    <span>Size:</span> 297 x 230mm<br/>
                    <span>Pagination:</span> 174 pages<br/>
                    Ships globally in a paper mailer
                </div>
                <div className='productButton'>
                    <a href='https://sq-ft-2544.myshopify.com/cart/45015873323315:1' target="_blank" rel="noopener noreferrer">
                        <button>Buy</button>
                    </a>
                </div>
            </div>
        </div>
    )
}