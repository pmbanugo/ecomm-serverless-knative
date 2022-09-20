const { createClient } = require('@urql/core');
const { createError, json } = require('micro');
const cors = require('./middleware/cors')({ allowMethods: ['POST', 'PUT'] });

const handler = async (req, res) => {
  if (req.url === '/health/liveness') {
    return 'OK';
  }

  try {
    const payload = await json(req);

    const client = createClient({
      url: 'https://pmbanugo-dev.eu.saleor.cloud/graphql/',
    });
    client.fetchOptions = {
      headers: {
        Authorization: 'Bearer SALEOR_CLOUD_APP_TOKEN',
      },
    };

    const { id, email } = await updateAddress(client, payload);
    const order = await createOrder(client, id);
    sendToQueue(email);
    return order;
  } catch (error) {
    console.log(error);
    throw createError(500, 'Unexpected server error');
  }
};

async function updateAddress(client, { token, shippingAddress }) {
  result = await client
    .mutation(UPDATE_CHECKOUT_MUTATION, { token, shippingAddress })
    .toPromise();

  console.log('checkout result, ', JSON.stringify(result.data, null, 2));
  console.log('checkout error, ', JSON.stringify(result.error, null, 2));

  if (result.data.checkoutShippingAddressUpdate.errors?.length > 0) {
    console.log({
      GraphQLError: result.data.checkoutShippingAddressUpdate.errors,
    });
    throw createError(500, 'Unable to add shipping address');
  }
  return result.data.checkoutShippingAddressUpdate.checkout;
}

async function createOrder(client, checkoutId) {
  console.log({ checkoutId });
  result = await client
    .mutation(CREATE_ORDER_MUTATION, { id: checkoutId })
    .toPromise();

  console.log('order result, ', JSON.stringify(result.data, null, 2));
  console.log('order error, ', JSON.stringify(result.error, null, 2));
  if (result.data.orderCreateFromCheckout?.errors?.length > 0) {
    console.log({
      GraphQLError: result.data.orderCreateFromCheckout.errors,
    });
    throw createError(500, 'Unable to Create Order');
  }
  return result.data.orderCreateFromCheckout.order;
}

async function sendToQueue(email) {
  const emailService = 'https://email.default.DOMAIN';
  await fetch(`https://qstash.upstash.io/v1/publish/${emailService}`, {
    body: JSON.stringify({ event: 'order_created', context: { email } }),
    headers: {
      Authorization:
        'Bearer QSTASH_TOKEN',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

const UPDATE_CHECKOUT_MUTATION = `
mutation UpdateCheckout($token: UUID!, $shippingAddress: AddressInput!) {
  checkoutShippingAddressUpdate(
    shippingAddress: $shippingAddress
    token: $token
    validationRules: { checkRequiredFields: false }
  ) {
    checkout {
      id
      email
    }
    errors {
      field
      message
      code
    }
  }

  checkoutBillingAddressUpdate(
    token: $token
    validationRules: { checkFieldsFormat: false, checkRequiredFields: false }
    billingAddress: $shippingAddress
  ) {
    checkout {
      id
    }
  }

  checkoutDeliveryMethodUpdate(token: $token, deliveryMethodId: "U2hpcHBpbmdNZXRob2Q6MTU=") {
    checkout {
      id
      token
    }
  }
}`;

const CREATE_ORDER_MUTATION = `
mutation CreateOrder($id: ID!) {
  orderCreateFromCheckout(
    id: $id
  ) {
    order {
      id
      isPaid
    }
  }
}`;

module.exports = cors(handler);
