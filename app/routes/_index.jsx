import React, { useRef, useEffect } from 'react';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import Landing from "~/components/landing";
import Menu from "~/components/menu";
import Store from "~/components/store";

export function meta() {
    return [
      {title: 'SQ FT'},
      {description: 'SQ FT Magazine'},
    ];
  }

  export async function loader({context}) {
    const {products} = await context.storefront.query(PRODUCTS_QUERY);
    return json({
      products: products.nodes,
    });
  }

  export async function cartCreate({input, storefront}) {
    const {cartCreate} = await storefront.mutate(CREATE_CART_MUTATION, {
      variables: {input},
    });
  
    return cartCreate;
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

    // const handleWheel = (e) => {
    //   e.preventDefault();
    //   // containerRef.current.scrollLeft += e.deltaY;
    //   window.scrollBy(e.deltaY, 0);
    //   console.log(containerRef.current.scrollBy);
    // };

    return (
      <div className="app" ref={containerRef}>
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

//! @see: https://shopify.dev/api/storefront/{api_version}/mutations/cartcreate
const CREATE_CART_MUTATION = `#graphql
mutation ($input: CartInput!, $country: CountryCode = ZZ, $language: LanguageCode)
@inContext(country: $country, language: $language) {
  cartCreate(input: $input) {
    cart {
      ...CartLinesFragment
    }
    errors: userErrors {
      ...ErrorFragment
    }
  }
}
${LINES_CART_FRAGMENT}
${USER_ERROR_FRAGMENT}
`;

const USER_ERROR_FRAGMENT = `#graphql
    fragment ErrorFragment on CartUserError {
      message
      field
      code
    }
`;
const LINES_CART_FRAGMENT = `#graphql
    fragment CartLinesFragment on Cart {
      id
      totalQuantity
    }
`;