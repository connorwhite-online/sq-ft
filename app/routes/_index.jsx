import React, { useRef, useEffect } from 'react';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import Landing from "~/components/landing";
import Menu from "~/components/menu";
import Store from "~/components/store";

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

    const handleWheel = (evt) => {
      evt.preventDefault();
      evt.currentTarget.scrollLeft += evt.deltaY;
    };

    // const handleWheel = (e) => {
    //   e.preventDefault();
    //   // containerRef.current.scrollLeft += e.deltaY;
    //   window.scrollBy(e.deltaY, 0);
    //   console.log(containerRef.current.scrollBy);
    // };

    return (
      <div className="app" ref={containerRef} onWheel={handleWheel}>
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