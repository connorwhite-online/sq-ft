import {Link, useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
export async function action({request, context}) {
  const {session, storefront} = context;
  const headers = new Headers();

  const [formData, storedCartId, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('cartId'),
    session.get('customerAccessToken'),
  ]);

  let cartId = storedCartId;

  let status = 200;
  let result;

  // TODO form action
}
export default function Cart() {
  return (
    <div className="cart">
      <h2 className="cartMessage">
        Your cart is empty
      </h2>
      <Link
        to="/"
        className="continueShopping"
      >
        Continue shopping
      </Link>
    </div>
  );
}