import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Component Imports
import Model from './model';

export default function Store() {
    const storeRef = useRef();

    useEffect(() => {
        let ctx = gsap.context(() => {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: storeRef.current,
                    start: 'right left',
                    end: 'left 60%',
                    scrub: true,
                    markers: true,
                },
            });
                tl.from('.webgl', {
                    duration: 1,
                    scale: 0,
                    opacity: 0,
                    ease: 'power3.inOut',
                }, 1);
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
        return () => ctx.revert();
    }, []);

    return (
        <div className='store' ref={storeRef}>
            <div className='webgl'>
                <Canvas >
                    <ambientLight />
                    <pointLight position={[10, 10, -3]} intensity={.5}/>
                    <pointLight position={[5, -5, 3]} intensity={.5} />
                    {/* <mesh rotation-y={45}>
                        <boxBufferGeometry attach='geometry' args={[2, 3, .25]}/>
                        <meshStandardMaterial attach='material' color='turquoise' />
                    </mesh> */}
                    <Model />
                </Canvas>
            </div>
            <div className='product'>
                <div className='productName'>
                    Issue 01
                </div>
                <div className='productPrice'>
                    $20.00
                </div>
                <div className='productDescription'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl nec nisl. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl nec nisl.
                </div>
                <div className='productButton'>
                    <button>Add to Bag</button>
                </div>
            </div>
        </div>
    )
}