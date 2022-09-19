const { createClient } = require('@urql/core');
const { createError, send, json } = require('micro');
const cors = require('./middleware/cors')({ allowMethods: ['GET'] });
const healthCheck = require('./middleware/health-check');
const QUERY = require("./query")

const handler = async (req, res) => {
  try {
    const [_, token] = req.url.split('/');
    if (!token) {
      send(res, 400, 'Missing token');
      return;
    }

    const client = createClient({
      url: 'https://pmbanugo-dev.eu.saleor.cloud/graphql/',
    });

    const result = await client.query(QUERY, { token }).toPromise();

    if (result.error) {
      console.log({ GraphQLError: result.error });
      throw createError(500, 'Unable to process request');
    }

    return mapCart(result.data.checkout);
  } catch (error) {
    console.log(error);
    throw createError(500, 'Unexpected server error');
  }
};

function mapCart(cart) {
  return {
    id: cart.id,
    email: cart.email,
    token: cart.token,
    quantity: cart.quantity,
    totalPrice: cart.totalPrice.gross.amount,
    lineItems: cart.lines.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      totalPrice: line.totalPrice.gross.amount,
      variant: mapVariant(line.variant),
    })),
  };
}

function mapVariant({ product, name, pricing }) {
  return {
    variantName: name,
    productName: product.name,
    productId: product.id,
    thumbnail: {
      url: product.thumbnail.url,
      alt: product.thumbnail.alt,
    },
    price: pricing.price.gross.amount,
  };
}

module.exports = healthCheck(cors(handler));
