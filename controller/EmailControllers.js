const { sendMail } = require("../config/auth");

const OrderProcedeMail = async (req, res) => {
  const data = req.body;

  try {
    const details = {
      to: `${data.email}`,
      subject: "Order Mail",
      html: `<h1>Thanks for shopping with us</h1>
    <p>Hi ${data.name},</p>
    <p>We have finished processing your order.</p>
    <table>
      <thead>
        <tr>
          <td><strong>Product</strong></td>
          <td><strong>Quantity</strong></td>
          <td><strong align="right">Price</strong></td>
        </tr>
      </thead>

      <tbody>
        ${data.cart
          .map(
            (item) => `
        <tr>
          <td>${item.productName}</td>
          <td align="center">${item.quantity}</td>
          <td align="right">$${item.price}</td>
        </tr>
        `
          )
          .join("\n")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"><strong>Total Price:</strong></td>
          <td align="right"><strong> Rs${data.total}</strong></td>
        </tr>
        <tr>
          <td colspan="2">Payment Method:</td>
          <td align="right">${data.paymentMethod}</td>
        </tr>
      </tfoot>
    </table>

    <h2>Shipping address</h2>
    <p>
      ${data.name},<br />
      ${data.address},<br />
      ${data.city},<br />
      ${data.country},<br />
      ${data.zipCode}<br />
    </p>
    <hr />
    <p>Thanks for shopping with us.</p>`,
    };
    const message = "";
    sendMail(details, res, message);
    return res.status(200).json("Mail sent successfully!");
  } catch (error) {
    return res.status(500).json("Error while sending mail");
  }
};

module.exports = {
  OrderProcedeMail,
};
