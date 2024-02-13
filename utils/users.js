const bcrypt = require("bcryptjs");
const admins = [
  {
    name: "M.Zanaen Ullah",
    image: "Zanaen.jpg",
    email: "zanaenullah75@gmail.com",
    password: bcrypt.hashSync("Perfectone1!"),
    phone: "03253057805",
    role: "Admin",
  },
];

module.exports = admins;
