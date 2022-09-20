const { createError, send, json } = require('micro');

const handler = async (req, res) => {
  if (req.url === '/health/liveness') {
    return 'OK';
  }

  try {
    const {
      context: { email },
    } = await json(req);

    const message = {
      to: email,
      from: 'peter@pmbanugo.me',
      subject: 'Order Placed ✔',
      html: '<p><b>Hello</b>!</p> <p>Your Order has been placed.</p>',
    };

    console.log(message)
    return 'Email Sent';
  } catch (error) {
    console.log(error);
    throw createError(500, 'Unexpected server error');
  }
};

module.exports = handler;
