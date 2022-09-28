import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { checkout, cartUpdate } from '../constant/url';
import { CartDispatchContext, CartContext } from '../hooks/CartContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LocalCart } from '../types/cart';

export default function Checkout() {
  const router = useRouter();
  const updateCart = useContext(CartDispatchContext);
  const { token } = useContext(CartContext) ?? {};
  const [customerEmail] = useLocalStorage<string>('customerEmail');
  const [formData, setFormData] = useState({});

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (token && customerEmail) {
      await callCheckOut({
        token,
        address: formData,
      });

      const cart = await createCart(customerEmail);
      updateCart(cart);

      router.push('/checkout/success');
    }
  };

  return (
    <>
      <div className="mt-10 sm:mt-0">
        {/* <div className="mx-auto"> */}
        <div className="mt-5">
          <form onSubmit={handleSubmit}>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      autoComplete="given-name"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      autoComplete="family-name"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      autoComplete="email"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={handleInputChange}
                    >
                      <option>Select</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="DE">Germany</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="streetName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street address
                    </label>
                    <input
                      type="text"
                      name="streetName"
                      id="streetName"
                      autoComplete="streetName"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="streetNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street Number
                    </label>
                    <input
                      type="text"
                      name="streetNumber"
                      id="streetNumber"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP / Postal code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      autoComplete="postalCode"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}

async function callCheckOut({
  token,
  address,
}: {
  token: string;
  address: any;
}) {
  try {
    const shippingAddress = {
      firstName: address.firstName,
      lastName: address.lastName,
      country: address.country,
      countryArea: address.region,
      city: address.city,
      postalCode: address.postalCode,
      streetAddress1: `${address['streetName']} ${address['streetNumber']}`,
    };

    const response = await fetch(checkout, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        shippingAddress,
      }),
    });
    const data = await response.json();
    console.log({ order: data });
  } catch (error) {
    console.error('CHECKOUT_ERROR', { error });
    throw error;
  }
}

async function createCart(customerEmail: string) {
  try {
    const response = await fetch(cartUpdate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: customerEmail, actionType: 'CREATE' }),
    });
    const data: LocalCart = await response.json();
    return data;
  } catch (error) {
    console.log('CHECKOUT_CREATE_CART', { error });
  }
}
