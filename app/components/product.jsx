import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';

export async function loader({params, context}) {
    const {handle} = params;
    const {product} = await context.storefront.query(PRODUCT_QUERY, {
        variables: {
            handle,
            product,
        },
    });
    if (!product?.id) {
        throw new Response(null, {status: 404});
      }
    
      return json({
        handle,
        product,
      });
};

export default function Product() {

    const {product} = useLoaderData();
    console.log(product);

    return (
        <>
            <h1 className='productName'>{product.title}</h1>
        </>
    );
};

const PRODUCT_QUERY = `#graphql
  query product($handle: String!) {
    product(handle: $handle) {
        id
        title
        handle
        vendor
        description
    }
  }
`;