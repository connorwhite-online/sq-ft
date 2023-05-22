import React, { useEffect } from 'react';
import {useLoaderData} from '@remix-run/react';
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
    return await context.storefront.query(COLLECTIONS_QUERY);
  }

  export default function Index() {

    const {collections} = useLoaderData();
    console.log(collections);

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


 
const COLLECTIONS_QUERY = `#graphql
query FeaturedCollections {
  collections(first: 3, query: "collection_type:smart") {
    nodes {
      id
      title
      handle
    }
  }
}
`;