const OrderProcedeMail = (data) => {
  const details = {
    from: `noreply embracecomfort@gmail.com`,
    to: `${data?.email}`,
    subject: "Order Received Successfully",
    html: `<!DOCTYPE html>
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->

    <title>Newsletter</title>

    <style type="text/css">
      @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

      * {
        font-family: "Poppins", sans-serif;
      }
      a,
      a[href],
      a:hover,
      a:link,
      a:visited {
        text-decoration: none !important;
        color: #0000ee;
      }
      .link {
        text-decoration: underline !important;
      }
      p,
      p:visited {
        font-size: 15px;
        line-height: 24px;
        font-family: "Helvetica", Arial, sans-serif;
        font-weight: 300;
        text-decoration: none;
        color: #000000;
      }
      h1 {
        font-size: 22px;
        line-height: 24px;
        font-family: "Helvetica", Arial, sans-serif;
        font-weight: normal;
        text-decoration: none;
        color: #000000;
      }
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td {
        line-height: 100%;
      }
      .ExternalClass {
        width: 100%;
      }
    </style>
  </head>

  <body
    style="
      text-align: center;
      margin: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 0;
      padding-right: 0;
      -webkit-text-size-adjust: 100%;
      background-color: #f2f4f6;
      color: #000000;
    "
    align="center"
  >
    <div style="text-align: center">
      <table
        align="center"
        style="
          text-align: center;
          vertical-align: top;
          width: 600px;
          max-width: 600px;
          background-color: #ffffff;
        "
        width="600"
      >
        <tbody>
          <tr>
            <td
              style="
                background-color: #e81f76;
                width: 596px;
                vertical-align: top;
                padding-left: 0;
                padding-right: 0;
                padding-top: 15px;
                padding-bottom: 15px;
              "
              width="596"
            >
              <img
                style="
                  width: 254px;
                  max-width: 254px;
                  height: 68px;
                  max-height: 68px;
                  text-align: center;
                  padding-bottom:"14px";
                "
                alt="Logo"
                src="https://app.embracecomfort.com/api/images/Logo-white-1.png"
                align="center"
                width="180"
                
              />
              <br />
              <img
                style="
                  width: 180%;
                  max-width: 180px;
                  height: 144px;
                  max-height: 144px;
                  text-align: center;
                  color: #ffffff;
                "
                alt="Logo"
                src="https://app.embracecomfort.com/api/images/girl-heart-purple-1.png"
                align="center"
                width="180"
                height="85"
              />
              <br />
              <p
                style="
                font-weight: 700;
                font-size: 21px;
                color: #ffffff;
                padding-bottom: 0;
                margin-bottom: 0;
                text-transform: capitalize;
                "
              >
                Hi ${data?.name}
              </p>
              <p
                style="
                padding-top: 0;
                margin-top: 0;
                font-size: 21px;
                color: #ffffff;
                font-weight: 700;
                "
              >
              Thank you for your order!
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        align="center"
        style="
          text-align: center;
          vertical-align: top;
          width: 600px;
          max-width: 600px;
          background-color: #ffffff;
        "
        width="600"
      >
        <tbody>
          <tr>
            <td
              style="
                width: 596px;
                vertical-align: top;
                padding-left: 30px;
                padding-right: 30px;
                padding-top: 30px;
              "
              width="596"
            >
              <p
                style="
                font-size: 20px;
                line-height: 24px;
                font-weight: 500;
                text-decoration: none;
                color: #000000;
                padding-left: inherit;
                padding-right: inherit;
                "
              >
              We’ve received your order and we are getting it ready to be
              shipped.
              </p>
              <hr style="border-top: 1px solid #000000" />
              <p
                style="
                text-align: left;
                font-weight: 700;
                font-size: 15px;
                margin-top: 0;
                "
              >
                Order ID: ${data?.orderId}
              </p>

              <table>
                <tbody>
                ${data?.cart
                  .map(
                    (item) =>
                      `
                    <tr>
                      <td style="width: 1%">
                        <img
                          src=${item.productImage[0]}
                          alt="eml.png"
                          style="
                          height: 93px;
                          width: 123px;
                          left: 0px;
                          top: 0px;
                          border-radius: 0px;
                        "
                        />
                      </td>
                      <td
                        style="
                        width: 49%;
                        font-size: 16px;
                        font-weight: 500;
                        color: #222222;
                        line-height: 24px;
                        letter-spacing: 0px;
                      "
                      >
                        ${item.productName}
                      </td>
                      <td
                        style="
                        font-size: 16px;
                        font-weight: 500;
                        line-height: 24px;
                        letter-spacing: 0px;
                        color: #222222;
                      "
                      >
                        ${item.quantity}
                      </td>
                      <td
                        style="
                        font-size: 16px;
                        font-weight: 500;
                        line-height: 24px;
                        letter-spacing: 0px;
                        color: #222222;
                      "
                      >
                        ${item.price}
                      </td>
                    </tr>
                    `
                  )
                  .join("\n")}
                </tbody>
              </table>
              <hr style="border-top: 1px solid #000000" />

              <table>
              <tbody>
                <tr>
                  <td>
                    <h1
                      style="
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                        letter-spacing: 0em;
                        text-align: left;
                      "
                    >
                      Order Details
                    </h1>
                  </td>
                  <td>
                    <h1
                      style="
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                        letter-spacing: 0em;
                        text-align: left;
                        visibility: hidden;
                      "
                    >
                      Payment Method
                    </h1>
                  </td>
                  <td>
                    <h1
                      style="
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                        letter-spacing: 0em;
                        text-align: right;
                      "
                    >
                      Customer Information
                    </h1>
                  </td>
                </tr>
              </tbody>
            </table>

              <table>
                <tbody>
                  <tr>
                  <td style="width: 35%">
                  <p
                    style="text-align: left; padding-top: 0; margin-top: 0;font-weight: 600;"
                  >
                    Subtotal
                  </p>
                  <p style="text-align: left;font-weight: 600;">Promo Discount</p>
                  <p style="text-align: left;font-weight: 600;">Total Payable</p>
                </td>
                    <td style="width: 25%">
                      <p  style="text-align: left; padding-top: 0; margin-top: 0">Rs. ${
                        data?.total
                      }</p>
                      <p style="text-align: left">Rs. ${data?.discount}</p>
                      <p style="text-align: left">Rs. ${data?.total}</p>
                    </td>
                    <td>
                      <h1
                        style="
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                        letter-spacing: 0em;
                        margin-bottom: 0;
                        text-align: left;
                        padding-bottom: 0;
                        "
                      >
                        Shipping Address
                      </h1>
                      <p
                      style="
                      font-size: 16px;
                      font-weight: 400;
                      line-height: 24px;
                      letter-spacing: 0em;
                      text-align: left;
                    "
                      >
                       ${data?.address} ${data?.city} ${data?.country} ${
      data?.zipCode
    }
                      </p>
                      <br />
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
              <tbody>
                <tr>
                  <td style="width: 30%">
                    <h1
                      style="
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                        letter-spacing: 0em;
                        text-align: left;
                        visibility: hidden;
                      "
                    >
                      Payment Method
                    </h1>
                  </td>
                  <td style="width: 25%">
                    <h1
                      style="
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                        letter-spacing: 0em;
                        text-align: left;
                        visibility: hidden;
                      "
                    >
                      Payment Method
                    </h1>
                  </td>
                  <td>
                    <h1
                      style="
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                        letter-spacing: 0em;
                        text-align: left;
                      "
                    >
                      Payment Method
                    </h1>
                    <p
                    style="
                    margin-top: 0px;
                    padding-top: 0px;
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 19px;
                    letter-spacing: 0em;
                    text-align: left;
                  "
                    >
                    ${data?.paymentMethod}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
              <hr style="border-top: 1px solid #000000" />
            </td>
          </tr>
        </tbody>
      </table>

      <table
        align="center"
        style="
          text-align: center;
          vertical-align: top;
          width: 600px;
          max-width: 600px;
          margin-top:"-49px",
          background-color: #ffffff;
        "
        width="600"
      >
        <tbody>
          <tr>
            <td>
              <p
                style="
                  font-size: 12px;
                  font-weight: 400;
                  line-height: 29px;
                  letter-spacing: 0em;
                  text-align: center;
                "
              >
                Copyright © 2023
              </p>
            </td>
          </tr>
          <tr>
            <td>
            <img
            alt="Logo"
            src="https://app.embracecomfort.com/api/images/embracePurple.png"
            align="center"
            width="180"
            height="85"
            style="height: 70px; padding-right: 20px;object-fit: contain;"
          />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`,
  };
  console.log("details", details);
  return details;
};

const SubscriptionProcedeMail = (data) => {
  const details = {
    from: `noreply embracecomfort@gmail.com`,
    to: `${data?.email}`,
    subject: "Thanks For Subscribing",
    html: `<!DOCTYPE html>
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->

    <title>Newsletter</title>

    <style type="text/css">
      @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

      * {
        font-family: "Poppins", sans-serif;
      }
      a,
      a[href],
      a:hover,
      a:link,
      a:visited {
        text-decoration: none !important;
        color: #0000ee;
      }
      .link {
        text-decoration: underline !important;
      }
      p,
      p:visited {
        font-size: 15px;
        line-height: 24px;
        font-family: "Helvetica", Arial, sans-serif;
        font-weight: 300;
        text-decoration: none;
        color: #000000;
      }
      h1 {
        font-size: 22px;
        line-height: 24px;
        font-family: "Helvetica", Arial, sans-serif;
        font-weight: normal;
        text-decoration: none;
        color: #000000;
      }
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td {
        line-height: 100%;
      }
      .ExternalClass {
        width: 100%;
      }
    </style>
  </head>

  <body
    style="
      text-align: center;
      margin: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 0;
      padding-right: 0;
      -webkit-text-size-adjust: 100%;
      background-color: #f2f4f6;
      color: #000000;
    "
    align="center"
  >
    <div style="text-align: center">
      <table
        align="center"
        style="
          text-align: center;
          vertical-align: top;
          width: 600px;
          max-width: 600px;
          background-color: #ffffff;
        "
        width="600"
      >
        <tbody>
          <tr>
            <td
              style="
                background-color: #e81f76;
                width: 596px;
                vertical-align: top;
                padding-left: 0;
                padding-right: 0;
                padding-top: 15px;
                padding-bottom: 15px;
              "
              width="596"
            >
              <img
                style="
                  width: 254px;
                  max-width: 254px;
                  height: 68px;
                  max-height: 68px;
                  text-align: center;
                  padding-bottom:"14px";
                "
                alt="Logo"
                src="https://app.embracecomfort.com/api/images/Logo-white-1.png"
                align="center"
                width="180"
               
              />
              <br />
              <img
                style="
                  width: 180%;
                  max-width: 180px;
                  height: 144px;
                  max-height: 144px;
                  text-align: center;
                  color: #ffffff;
                "
                alt="Logo"
                src="https://app.embracecomfort.com/api/images/girl-heart-purple-1.png"
                align="center"
                width="180"
                height="85"
              />
              <br />
              <p
                style="
                  font-weight: 700;
                  font-size: 21px;
                  color: #ffffff;
                  padding-bottom: 0;
                  margin-bottom: 0;
                "
              >
                Hi ${data?.name}
              </p>
              <p
                style="
                  padding-top: 0;
                  margin-top: 0;
                  font-size: 21px;
                  color: #ffffff;
                  font-weight: 700;
                "
              >
                Thank you for subscribing
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        align="center"
        style="
          text-align: center;
          vertical-align: top;
          width: 600px;
          max-width: 600px;
          background-color: #ffffff;
        "
        width="600"
      >
        <tbody>
          <tr>
            <td
              style="
                width: 596px;
                vertical-align: top;
                padding-left: 30px;
                padding-right: 30px;
                padding-top: 30px;
              "
              width="596"
            >
              <p
                style="
                  font-size: 15px;
                  line-height: 24px;
                  font-weight: 500;
                  text-decoration: none;
                  color: #000000;
                "
              >
                We’ve received your order and will contact you as soon as your
                package is shipped. you can find your purchase information
                below.
              </p>
              <hr style="border-top: 1px solid #000000" />
              <table>
                <tbody>
                ${data?.cart
                  .map(
                    (item) =>
                      `
                    <tr>
                      <td style="width: 1%">
                        <img
                         src=${item.productImage[0]}
                          alt="eml.png"
                          style="
                          height: 93px;
                          width: 123px;
                          left: 0px;
                          top: 0px;
                          border-radius: 0px;
                        "
                        />
                      </td>
                      <td
                        style="
                        width: 49%;
                        font-size: 16px;
                        font-weight: 500;
                        color: #222222;
                        line-height: 24px;
                        letter-spacing: 0px;
                      "
                      >
                        ${item.productName}
                      </td>
                      <td
                        style="
                        font-size: 16px;
                        font-weight: 500;
                        line-height: 24px;
                        letter-spacing: 0px;
                        color: #222222;
                      "
                      >
                        ${item.quantity}
                      </td>
                    </tr>
                    `
                  )
                  .join("\n")}
                </tbody>
              </table>
              <hr style="border-top: 1px solid #000000" />
              <h1
                style="
                  font-size: 20px;
                  font-weight: 600;
                  line-height: 24px;
                  letter-spacing: 0em;
                  text-align: left;
                "
              >
                Subscription Type
              </h1>
              <p
                style="
                  margin-top: 0px;
                  padding-top: 0px;
                  font-size: 15px;
                  font-weight: 400;
                  line-height: 19px;
                  letter-spacing: 0em;
                  text-align: left;
                "
              >
                ${data?.subscriptionType}
              </p>
              <hr style="border-top: 1px solid #000000" />
            </td>
          </tr>
        </tbody>
      </table>

      <table
        align="center"
        style="
          text-align: center;
          vertical-align: top;
          width: 600px;
          max-width: 600px;
          margin-top:"-49px";
          background-color: #ffffff;
        "
        width="600"
      >
        <tbody>
          <tr>
            <td>
              <p
                style="
                  font-size: 12px;
                  font-weight: 400;
                  line-height: 29px;
                  letter-spacing: 0em;
                  text-align: center;
                "
              >
                Copyright © 2023
              </p>
            </td>
          </tr>
          <tr>
            <td>
            <img
            alt="Logo"
            src="https://app.embracecomfort.com/api/images/embracePurple.png"
            align="center"
            width="180"
            height="85"
            style="height: 70px; padding-right: 20px"
          />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`,
  };
  return details;
};

module.exports = {
  OrderProcedeMail,
  SubscriptionProcedeMail,
};
