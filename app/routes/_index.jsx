import React, { useRef, useEffect, useState } from 'react';
import {json} from '@shopify/remix-oxygen';
import Landing from "~/components/landing";
import Menu from "~/components/menu";
import Store from "~/components/store";
import { gsap } from 'gsap';

export function meta() {
    return [
      {title: 'sq ft'},
      {description: 'sq ft Magazine'},
    ];
  }

  export async function loader({context}) {
    const {products} = await context.storefront.query(PRODUCTS_QUERY);
    return json({
      products: products.nodes,
    });
  }

  export default function Index() {

    const containerRef = useRef();
    const currentScrollY = useRef(0);

    useEffect(() => {
        gsap.to(containerRef.current, {
          autoAlpha: 1,
        });
      }, []);

    useEffect(() => {
      const handleScroll = () => {
        const screenWidth = window.innerWidth;
        const desktop = screenWidth >= 768; // Set your desired screen width threshold here
  
        if (desktop) {
          document.body.classList.add('disable-scroll');
        } else {
          document.body.classList.remove('disable-scroll');
        }
      };
  
      handleScroll(); // Initial check on component mount
  
      window.addEventListener('resize', handleScroll);
  
      return () => {
        window.removeEventListener('resize', handleScroll);
      };
    }, []);

    // Original working solution
    // const handleWheel = (e) => {
    //   e.preventDefault();
    //   window.scrollBy(e.deltaY, 0);
    //   console.log(e.deltaY);
    // };

    // Kind of damps, but not very smooth
    // const handleWheel = (e) => {
    //   e.preventDefault();
    //   const currentScrollY = containerRef.current.scrollTop;
    //   const newScrollY = previousScrollY.current + e.deltaY * 0.1;

    //   window.scrollBy(newScrollY, 0);
    //   currentScrollY.current = newScrollY;
    //   console.log(currentScrollY.current);
    // };

    const handleWheel = (e) => {
      e.preventDefault();
      const newScrollY = currentScrollY.current + (e.deltaY) * 0.2;
      window.scrollBy(newScrollY, 0);
    };

    return (
      <div className="app" ref={containerRef} onWheel={handleWheel} style={{visibility: 'hidden'}}>
          <Menu />
          <Landing />
          <Store />
      </div>
    );
  }


 
const PRODUCTS_QUERY = `#graphql
query AllProducts {
  products(first: 3) {
    nodes {
      id
      title
      description
      handle
      vendor
      variants(first: 1) {
        nodes {
          price {
            amount
          }
        }
      }
    }
  }
}
`;