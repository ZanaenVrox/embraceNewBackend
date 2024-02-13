const bcrypt = require("bcryptjs");
const users = [
  {
    full_name: "Ali",
    Street: "Street # 6",
    Appartments: "House # 6",
    country: "Pakistan",
    city: "Lahote",
    email: "ali.ghazanfar@gmail.com",
    postalcode: "54000",
    phone: "0310301310",
    password: bcrypt.hashSync("12345678"),
    customerId: "10001",
    notes:
      "Sit dolore aliquip mollit tempor consequat sunt. Duis proident occaecat in id sint duis. Reprehenderit consequat enim enim dolor deserunt cupidatat occaecat amet sit do. Sunt aliqua voluptate consectetur sit minim qui proident ullamco culpa proident quis officia. Occaecat velit consectetur amet reprehenderit officia velit dolor aliquip. Reprehenderit adipisicing et qui deserunt eu incididunt cillum adipisicing.",
  },
  {
    full_name: "Ali 1",
    Street: "Street # 6",
    Appartments: "House # 6",
    country: "Pakistan",
    city: "Lahote",
    email: "ali1ghazanfar@gmail.com",
    postalcode: "54000",
    phone: "0310301310",
    password: bcrypt.hashSync("12345678"),
    customerId: "10002",
    notes:
      "Sit dolore aliquip mollit tempor consequat sunt. Duis proident occaecat in id sint duis. Reprehenderit consequat enim enim dolor deserunt cupidatat occaecat amet sit do. Sunt aliqua voluptate consectetur sit minim qui proident ullamco culpa proident quis officia. Occaecat velit consectetur amet reprehenderit officia velit dolor aliquip. Reprehenderit adipisicing et qui deserunt eu incididunt cillum adipisicing.",
  },
  {
    full_name: "Ali 2",
    Street: "Street # 6",
    Appartments: "House # 6",
    country: "Pakistan",
    city: "Lahote",
    email: "ali2ghazanfar@gmail.com",
    postalcode: "54000",
    phone: "0310301310",
    password: bcrypt.hashSync("12345678"),
    customerId: "10003",
    notes:
      "Sit dolore aliquip mollit tempor consequat sunt. Duis proident occaecat in id sint duis. Reprehenderit consequat enim enim dolor deserunt cupidatat occaecat amet sit do. Sunt aliqua voluptate consectetur sit minim qui proident ullamco culpa proident quis officia. Occaecat velit consectetur amet reprehenderit officia velit dolor aliquip. Reprehenderit adipisicing et qui deserunt eu incididunt cillum adipisicing.",
  },
];

module.exports = users;
