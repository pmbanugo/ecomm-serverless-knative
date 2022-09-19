const QUERY = `
query CheckoutByToken($token: UUID!) {
  checkout(token: $token) {
    id
    email
    token
    quantity
    lines {
      id
      quantity
      totalPrice {
        gross {
          amount
          currency
        }
      }
      variant {
        product {
          id
          name
          slug
          thumbnail {
            url
            alt
          }
        }
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        name
      }
    }
    totalPrice {
      gross {
        amount
        currency
      }
    }
  }
}`;

module.exports = QUERY;
