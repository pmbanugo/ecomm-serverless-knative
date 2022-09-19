const { createClient } = require('@urql/core');
const { createError, send } = require('micro');

module.exports = async (req, res) => {
  if (req.url === '/health/liveness') {
    return 'OK';
  }

  try {
    const [_, categoryId] = req.url.split('/');
    if (!categoryId) {
      send(res, 400, 'Missing category ID');
      return;
    }

    const client = createClient({
      url: 'https://pmbanugo-dev.eu.saleor.cloud/graphql/',
    });

    const result = await client.query(QUERY, { categoryId }).toPromise();

    if (result.error) {
      console.log({ GraphQLError: result.error });
      throw createError(500, 'Unable to process request');
    }

    return result.data.products.edges.map(mapProduct);
  } catch (error) {
    console.log(error);
    throw createError(500, 'Unexpected server error');
  }
};

function mapProduct({ node }) {
  const lowestPrice = node.pricing.priceRange.start.gross.amount;
  const highestPrice = node.pricing.priceRange.stop.gross.amount;
  const price =
    lowestPrice == highestPrice
      ? highestPrice
      : `${lowestPrice} - ${highestPrice}`;

  return {
    id: node.id,
    name: node.name,
    image: {
      url: node.thumbnail.url,
      alt: node.thumbnail.alt,
    },
    price,
  };
}

const QUERY = `
query FetchProductByCategory($categoryId: [ID!]) {
  products(first: 12, channel: "default-channel", filter: {categories: $categoryId} ) {
    edges {
      node {
        id
        name
        thumbnail {
          url
          alt
        }
        pricing {
          priceRange {
            start {gross {amount}}
            stop {gross {amount}}
          }
        }
      }
    }
  }
}`;
