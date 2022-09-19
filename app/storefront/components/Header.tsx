/* eslint-disable @next/next/no-img-element */

import { Fragment, useState, useContext } from 'react';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import {
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  XIcon,
} from '@heroicons/react/outline';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { navigation } from '../constant/navigation';
import { cartUpdate } from '../constant/url';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CartContext, CartDispatchContext } from '../hooks/CartContext';

const DynamicCart = dynamic(() => import('./Cart'), {
  suspense: false,
});

export default function Header() {
  const [showCart, setShowCart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [customerEmail, setCustomerEmail] =
    useLocalStorage<string>('customerEmail');
  const cart = useContext(CartContext);
  const updateCart = useContext(CartDispatchContext);

  const cartTotal = cart ? cart.quantity : 0;

  const signIn = async () => {
    let email;
    while (!email) {
      email = window.prompt("What's your email?");
    }
    setCustomerEmail(email);

    //Create cart
    const response = await fetch(cartUpdate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, actionType: 'CREATE' }),
    });
    const data = await response.json();

    updateCart(data);
  };

  return (
    <div className="bg-white">
      {showCart && cart && (
        <DynamicCart onClose={setShowCart} cartToken={cart.token} />
      )}

      {/* Mobile menu */}
      <Transition.Root show={openDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setOpenDialog}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
                <div className="px-4 pt-5 pb-2 flex">
                  <button
                    type="button"
                    className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                {/* <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex px-4 space-x-8">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-gray-900 border-transparent',
                              'flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium'
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                </Tab.Group> */}

                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link href={`/category/${encodeURIComponent(page.slug)}`}>
                        <a className="-m-2 p-2 block font-medium text-gray-900">
                          {page.name}
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                  <div className="flow-root">
                    <button className="-m-2 p-2 block font-medium text-gray-900">
                      Sign in
                    </button>
                  </div>
                  <div className="flow-root">
                    <a
                      href="#"
                      className="-m-2 p-2 block font-medium text-gray-900"
                    >
                      Create account
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-200 py-6 px-4">
                  <a href="#" className="-m-2 p-2 flex items-center">
                    <img
                      src="https://tailwindui.com/img/flags/flag-canada.svg"
                      alt=""
                      className="w-5 h-auto block flex-shrink-0"
                    />
                    <span className="ml-3 block text-base font-medium text-gray-900">
                      CAD
                    </span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="bg-indigo-600 h-10 flex items-center justify-center text-sm font-medium text-white px-4 sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav
          aria-label="Top"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="h-16 flex items-center">
              <button
                type="button"
                className="bg-white p-2 rounded-md text-gray-400 lg:hidden"
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="/">
                  <span className="sr-only">Workflow</span>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                    alt=""
                  />
                </a>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="h-full flex space-x-8">
                  {/* {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? 'border-indigo-600 text-indigo-600'
                                  : 'border-transparent text-gray-700 hover:text-gray-800',
                                'relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>
                        </>
                      )}
                    </Popover>
                  ))} */}

                  {navigation.pages.map((page) => (
                    <Link key={page.name} href={`/category/${page.slug}`}>
                      <a className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                        {page.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {customerEmail ? (
                    <span>{customerEmail}</span>
                  ) : (
                    <>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          signIn();
                        }}
                      >
                        Sign in
                      </a>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </a>
                    </>
                  )}
                </div>

                {/* <div className="hidden lg:ml-8 lg:flex">
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-800 flex items-center"
                  >
                    <img
                      src="https://tailwindui.com/img/flags/flag-canada.svg"
                      alt=""
                      className="w-5 h-auto block flex-shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">CAD</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div> */}

                {/* Search */}
                <div className="flex lg:ml-6">
                  <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <SearchIcon className="w-6 h-6" aria-hidden="true" />
                  </a>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button
                    className="group -m-2 p-2 flex items-center"
                    onClick={() => setShowCart(true)}
                  >
                    <ShoppingBagIcon
                      className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {cartTotal}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
