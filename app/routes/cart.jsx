import {Link, useLoaderData, useFetcher} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import { CART_QUERY } from '~/queries/cart';
import {CartLineItems, CartActions, CartSummary} from '~/components/Cart';

export async function loader({context}) {
    const cartId = await context.session.get('cartId');
  
    const cart = cartId
      ? (
          await context.storefront.query(CART_QUERY, {
            variables: {
              cartId,
              country: context.storefront.i18n.country,
              language: context.storefront.i18n.language,
            },
            cache: context.storefront.CacheNone(),
          })
        ).cart
      : null;
  
    return {cart};
}

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

    const cartAction = formData.get('cartAction');
    const countryCode = formData.get('countryCode')
    ? formData.get('countryCode')
    : null;
    switch (cartAction) {
    case 'ADD_TO_CART':
        const lines = formData.get('lines')
        ? JSON.parse(String(formData.get('lines')))
        : [];

        if (!cartId) {
        result = await cartCreate({
            input: countryCode ? {lines, buyerIdentity: {countryCode}} : {lines},
            storefront,
        });
        } else {
        result = await cartAdd({
            cartId,
            lines,
            storefront,
        });
        }

        cartId = result.cart.id;
        break;
    case 'REMOVE_FROM_CART':
        const lineIds = formData.get('linesIds')
        ? JSON.parse(String(formData.get('linesIds')))
        : [];

        if (!lineIds.length) {
        throw new Error('No lines to remove');
        }

        result = await cartRemove({
        cartId,
        lineIds,
        storefront,
        });

        cartId = result.cart.id;
        break;
    default:
        throw new Error('Invalid cart action');
    }
    /**
     * The Cart ID may change after each mutation. We need to update it each time in the session.
     */
    session.set('cartId', cartId);
    headers.set('Set-Cookie', await session.commit());
    const {cart, errors} = result;
    return json({cart, errors}, {status, headers});

}

function ItemRemoveButton({lineIds}) {
    const fetcher = useFetcher();
  
    return (
      <fetcher.Form action="/cart" method="post">
        <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
        <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
        <button
          className="bg-white border-black text-black hover:text-white hover:bg-black rounded-md font-small text-center my-2 max-w-xl leading-none border w-10 h-10 flex items-center justify-center"
          type="submit"
        >
          <IconRemove />
        </button>
      </fetcher.Form>
    );
}

function IconRemove() {
    return (
      <svg
        fill="transparent"
        stroke="currentColor"
        viewBox="0 0 20 20"
        className="w-5 h-5"
      >
        <title>Remove</title>
        <path
          d="M4 6H16"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M5.5 6L6 17H14L14.5 6"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
          strokeWidth="1.25"
        />
      </svg>
    );
}

export default function Cart() {
    const {cart} = useLoaderData();

    if (cart?.totalQuantity > 0)
        return (
            <div className="cart">
                <div className="flex-grow md:translate-y-4">
                <CartLineItems linesObj={cart.lines} />
                </div>
                <div className="fixed left-0 right-0 bottom-0 md:sticky md:top-[65px] grid gap-6 p-4 md:px-6 md:translate-y-4 bg-gray-100 rounded-md w-full">
                <div className="fixed left-0 right-0 bottom-0 md:sticky md:top-[65px] grid gap-6 p-4 md:px-6 md:translate-y-4 bg-gray-100 rounded-md w-full">
                    <CartSummary cost={cart.cost} />
                    <CartActions checkoutUrl={cart.checkoutUrl} />
                </div>
                </div>
            </div>
        );
    return (
        <div className="cart">
        <h2 className="cart-empty">
            Your cart is empty
        </h2>
        <Link
            to="/"
            className="home-link"
        >
            Back to Home &#8599;
        </Link>
        </div>
    );
}

/**
 * Create a cart with line(s) mutation
 * @param input CartInput https://shopify.dev/api/storefront/{api_version}/input-objects/CartInput
 * @see https://shopify.dev/api/storefront/{api_version}/mutations/cartcreate
 * @returns result {cart, errors}
 * @preserve
 */
export async function cartCreate({input, storefront}) {
    const {cartCreate} = await storefront.mutate(CREATE_CART_MUTATION, {
      variables: {input},
    });
  
    return cartCreate;
  }
  /**
   * Storefront API cartLinesAdd mutation
   * @param cartId
   * @param lines [CartLineInput!]! https://shopify.dev/api/storefront/{api_version}/input-objects/CartLineInput
   * @see https://shopify.dev/api/storefront/{api_version}/mutations/cartLinesAdd
   * @returns result {cart, errors}
   * @preserve
   */
  export async function cartAdd({cartId, lines, storefront}) {
    const {cartLinesAdd} = await storefront.mutate(ADD_LINES_MUTATION, {
      variables: {cartId, lines},
    });
  
    return cartLinesAdd;
  }
  /**
   * Create a cart with line(s) mutation
   * @param cartId the current cart id
   * @param lineIds [ID!]! an array of cart line ids to remove
   * @see https://shopify.dev/api/storefront/2022-07/mutations/cartlinesremove
   * @returns mutated cart
   * @preserve
   */
  export async function cartRemove({cartId, lineIds, storefront}) {
    const {cartLinesRemove} = await storefront.mutate(
      REMOVE_LINE_ITEMS_MUTATION,
      {
        variables: {
          cartId,
          lineIds,
        },
      },
    );
  
    if (!cartLinesRemove) {
      throw new Error('No data returned from remove lines mutation');
    }
    return cartLinesRemove;
  }
  /*
    Cart Queries
  */
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
  const ADD_LINES_MUTATION = `#graphql
    mutation ($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode = ZZ, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
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
  const REMOVE_LINE_ITEMS_MUTATION = `#graphql
    mutation ($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode, $country: CountryCode)
    @inContext(country: $country, language: $language) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ...on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
        errors: userErrors {
          message
          field
          code
        }
      }
    }
  `;