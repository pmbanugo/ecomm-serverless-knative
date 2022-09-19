const { createClient } = require('@urql/core');
const { createError, send } = require('micro');

module.exports = async (req, res) => {
  if (req.url === '/health/liveness') {
    return 'OK';
  }

  try {
    const [_, productId] = req.url.split('/');
    if (!productId) {
      send(res, 400, 'Missing product ID');
      return;
    }

    const client = createClient({
      url: 'https://pmbanugo-dev.eu.saleor.cloud/graphql/',
    });

    const result = await client.query(QUERY, { id: productId }).toPromise();

    if (result.error) {
      console.log({ GraphQLError: result.error });
      throw createError(500, 'Unable to process request');
    }

    return mapProduct(result.data.product);
  } catch (error) {
    console.log(error);
    throw createError(500, 'Unexpected server error');
  }
};

const QUERY = `
query ProductByID($id: ID!) {
  product(id: $id, channel: "default-channel") {
    id
    name
    description
    media {
      url
      alt
    }
    category {
      name
      id
    }
    variants {
      id
      name
      quantityAvailable
      pricing { price { gross { amount } } }
    }
  }
}`;

function mapProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image: {
      url: product.media[0].url,
      alt: product.media[0].alt,
    },
    category: product.category,
    variants: product.variants.map(
      ({ id, name, pricing, quantityAvailable }) => ({
        id,
        name,
        inStock: quantityAvailable > 0,
        price: pricing.price.gross.amount,
      })
    ),
  };
}
