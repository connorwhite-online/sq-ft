import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import styles from './styles/app.css';
import landingStyles from './styles/landing.css';
import menuStyles from './styles/menu.css';
import storeStyles from './styles/store.css';
import cartStyles from './styles/cart.css';
import favicon from '../public/favicon.svg';

export const links = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: menuStyles},
    {rel: 'stylesheet', href: landingStyles},
    {rel: 'stylesheet', href: storeStyles},
    {rel: 'stylesheet', href: cartStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {
      rel: 'preload',
      href: './images/P-30-tint.png',
      as: 'image',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export async function loader({context}) {
  const layout = await context.storefront.query(LAYOUT_QUERY);
  return {layout};
}

export default function App() {
  const data = useLoaderData();

  const {name} = data.layout.shop;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
    }
  }
`;
