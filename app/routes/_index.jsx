import React, { Suspense, useEffect } from 'react';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import Landing from "~/components/landing";
import Menu from "~/components/menu";
import Store from "~/components/store";

export function meta() {
    return [
      {title: 'Hydrogen'},
      {description: 'A custom storefront powered by Hydrogen'},
    ];
  }

  export async function loader({context}) {
    const {products} = await context.storefront.query(PRODUCTS_QUERY);
    return json({
      products: products.nodes,
    });
  }

  export default function Index() {

    // const {products} = useLoaderData();
    // console.log(products);

    useEffect(() => {
      const handleScroll = () => {
        const screenWidth = window.innerWidth;
        const scrollDisabled = screenWidth >= 768; // Set your desired screen width threshold here
  
        if (scrollDisabled) {
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

    return (
      <div className="app">
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
    }
  }
}
`;