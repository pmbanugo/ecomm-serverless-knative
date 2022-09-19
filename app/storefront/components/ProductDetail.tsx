import { useContext, useState } from 'react';
import { StarIcon } from '@heroicons/react/solid';
import { RadioGroup } from '@headlessui/react';
import Image from 'next/image';
import { CartDispatchContext, CartContext } from '../hooks/CartContext';
import { cartUpdate } from '../constant/url';
import { Product } from '../types/product';

const reviews = { href: '#', average: 4, totalCount: 117 };

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const updateCart = useContext(CartDispatchContext);
  const { token } = useContext(CartContext) ?? {};

  async function addToCart() {
    //TODO: show loading state for async operation in this step
    try {
      const response = await fetch(cartUpdate, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          actionType: 'ADD',
          variantId: selectedVariant.id,
          quantity: 1,
        }),
      });
      const data = await response.json();
      console.log({ cart: data });
      updateCart(data);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-4 h-5 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:mt-0 lg:row-span-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">${selectedVariant.price}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating
                          ? 'text-gray-900'
                          : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a
                  href={reviews.href}
                  className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            {/* Highlight/Details */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>

              <div className="mt-4">
                <ul role="list" className="pl-4 list-disc text-sm space-y-2">
                  {product.details.map((detail) => (
                    <li key={detail} className="text-gray-400">
                      <span className="text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-900 font-medium">Variants</h3>
              </div>

              <RadioGroup
                value={selectedVariant}
                onChange={setSelectedVariant}
                className="mt-4"
              >
                <RadioGroup.Label className="sr-only">
                  Choose a variant
                </RadioGroup.Label>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                  {product.variants.map((variant) => (
                    <RadioGroup.Option
                      key={variant.id}
                      value={variant}
                      disabled={!variant.inStock}
                      className={({ active }) =>
                        classNames(
                          variant.inStock
                            ? 'bg-white shadow-sm text-gray-900 cursor-pointer'
                            : 'bg-gray-50 text-gray-200 cursor-not-allowed',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <RadioGroup.Label as="span">
                            {variant.name}
                          </RadioGroup.Label>
                          {variant.inStock ? (
                            <span
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked
                                  ? 'border-indigo-500'
                                  : 'border-transparent',
                                'absolute -inset-px rounded-md pointer-events-none'
                              )}
                              aria-hidden="true"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="absolute -inset-px rounded-md border-2 border-gray-200 pointer-events-none"
                            >
                              <svg
                                className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                stroke="currentColor"
                              >
                                <line
                                  x1={0}
                                  y1={100}
                                  x2={100}
                                  y2={0}
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={addToCart}
              >
                Add to bag
              </button>
            </div>
          </div>

          <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            {/* Description and features photos */}

            <div className="mt-10">
              <div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4">
                <Image
                  src={product.image.url}
                  alt={product.image.alt}
                  className="w-full h-full object-center object-cover"
                  layout="fill"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
