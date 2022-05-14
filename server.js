require("dotenv").config()

const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const PORT = 3000
const users = require("./users");
const transactions = require("./transactions")

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Working")
})

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (users[username].password === password) {
    //authenticate and create the jwt
    const newToken = jwt.sign(
      {
        user: username,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: 60 * 60 }
    );

    res
      .status(200)
      .cookie("NewCookie", newToken, { path: "/", httpOnly: true })
      .send("cookie");
  } else {
    res.status(403).send("unauthorised");
  }
});

app.post("/posts", verifyToken, (req, res) => {
  const username = req.user;
  const userTransactions = transactions[username];
  res.status(200).json({ transactions: userTransactions });
});

app.post("/logout", (req, res) => {
  res.clearCookie("NewCookie").send("cookie dead");
});

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})