import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';

export async function loader({params, context}) {
    const {handle} = params;
    const {product} = await context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
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

  export default function ProductHandle() {
    const {handle, product} = useLoaderData();
  
    return (
      <div className="product-wrapper">
        <div className='productName'>{product.title}</div>
        <div className='productDescription'>{product.description}</div>
      </div>
    );
  }

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