import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import {useLoaderData} from '@remix-run/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Component Imports
import Model from './model';

export default function Store() {

    const {products} = useLoaderData();

    const storeRef = useRef();

    // Store Loading Animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.webgl', {
                duration: 3,
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
                tl.from('.productName', {
                    duration: 1,
                    opacity: 0,
                    x: -100,
                    ease: 'power3.inOut',
                }, 1);
                tl.from('.productPrice', {
                    duration: 1,
                    opacity: 0,
                    x: -100,
                    ease: 'power3.inOut',
                }, 1.5);
                tl.from('.productDescription', {
                    duration: 1,
                    opacity: 0,
                    ease: 'power3.inOut',
                }, 2);
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
                    {products[0].title}
                </div>
                <div className='productPrice'>
                    ${products[0].variants.nodes[0].price.amount}
                </div>
                <div className='productDescription'>
                    {products[0].description}
                </div>
                <div className='productButton'>
                    <button>Add to Bag</button>
                </div>
            </div>
        </div>
    )
}