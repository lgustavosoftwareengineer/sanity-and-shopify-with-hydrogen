import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {SanityDocument} from '@sanity/client';
import groq from 'groq';
import {PortableText} from '@portabletext/react';

import {components} from '~/components/portableTextComponents';

export async function loader({
  params,
  context: {storefront, sanity},
}: LoaderArgs) {
  const {product} = await storefront.query<{product: Product}>(
    `#graphql
      query Product($handle: String!) {
        product(handle: $handle) { id title }
      }
    `,
    {
      variables: {handle: params.handle},
    },
  );

  const page = await sanity.fetch<SanityDocument>(
    groq`*[_type == "product" && store.slug.current == $handle][0]{
      body
    }`,
    params,
  );

  return json({product, page});
}

export default function Page() {
  const {product, page} = useLoaderData<typeof loader>();

  console.log({page});

  return (
    <div className="mx-auto p-12 prose prose-xl prose-a:text-blue-500">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      {page?.body.length > 0 ? (
        <PortableText value={page.body} components={components} />
      ) : null}
      <Link to="/products">&larr; Back to All Products</Link>
    </div>
  );
}
