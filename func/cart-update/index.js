const { createClient } = require('@urql/core');
const { createError, send, json } = require('micro');
const cors = require('./middleware/cors')({ allowMethods: ['POST', 'PUT'] });

const handler = async (req, res) => {
  if (req.url === '/health/liveness') {
    return 'OK';
  }

  try {
    const payload = await json(req);
    const { actionType } = payload;

    const client = createClient({
      url: 'https://pmbanugo-dev.eu.saleor.cloud/graphql/',
    });

    switch (actionType) {
      case 'CREATE':
        return await createCart(client, payload);
      case 'ADD':
        return await addToCart(client, payload);

      default:
        send(res, 400, 'Bad Request');
        break;
    }
  } catch (error) {
    console.log(error);
    throw createError(500, 'Unexpected server error');
  }
};

async function createCart(client, { email }) {
  result = await client.mutation(CREATE_MUTATION, { email }).toPromise();

  if (result.data.checkoutCreate.errors?.length > 0) {
    console.log({ GraphQLError: result.data.checkoutCreate.errors });
    throw createError(500, 'Unable to process request');
  }
  return result.data.checkoutCreate.checkout;
}

async function addToCart(client, { token, quantity, variantId }) {
  const result = await client
    .mutation(ADD_MUTATION, {
      token,
      quantity,
      variantId,
    })
    .toPromise();

  if (result.data.checkoutLinesAdd?.errors?.length > 0) {
    console.log({ GraphQLError: result.data.checkoutLinesAdd.errors });
    throw createError(500, 'Unable to add item to cart');
  }

  return result.data.checkoutLinesAdd.checkout;
}

const CREATE_MUTATION = `
mutation CreateCheckout($email: String!) {
  checkoutCreate(
    input: {
      channel: "default-channel"
      email: $email
      lines: []
    }
  ) {
    checkout {
      token
      quantity
    }
    errors {
      field
      code
    }
  }
}`;

const ADD_MUTATION = `
mutation UpdateCheckout($token: UUID!, $quantity: Int!, $variantId: ID!) {
  checkoutLinesAdd(
    token: $token
    lines: [{ quantity: $quantity, variantId: $variantId }]
  ) {
    checkout {
      token
      quantity
    }
  }
}`;

module.exports = cors(handler);
