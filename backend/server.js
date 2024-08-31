import fs from "node:fs";

import express from "express";
import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
// import * as url from "node:url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import * as jwtJsDecode from "jwt-js-decode";
// import SimpleWebAuthnServer from "@simplewebauthn/server";
import base64url from "base64url";

// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const defaultData = { users: [] };

const app = express();
app.use(express.json());

const db = await JSONFilePreset(
  new URL("./users.json", import.meta.url).pathname,
  defaultData
);
await db.read();

const rpID = "localhost";
const protocol = "http";
const port = 5050;
const expectedOrigin = `${protocol}://${rpID}:${port}`;

app.use(express.static(new URL("../frontend", import.meta.url).pathname));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// find user by email
const findUser = (email) => {
  return db.data.users.find((user) => user.email === email);
};

// Setup email transporter (using Gmail for example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tr9836859@gmail.com",

    // my email's app key
    pass: "char qnvi xpth zslb",
  },
});

// Generate JWT Token
const generateToken = (email) => {
  const secretKey = "your_jwt_secret_key";
  return jwt.sign({ email }, secretKey, { expiresIn: "1h" });
};

// ALL ENDPOINT SERVES THE index.html file

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const isUserExist = findUser(email);

  if (isUserExist) {
    res.status(400).send({ ok: false, message: "User already exists" });
    return;
  }

  // Create a verification token
  const token = generateToken(email);

  // Send verification email
  const verificationUrl = `${expectedOrigin}/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: "tr9836859@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the link: ${verificationUrl}`,
  };

  await transporter.sendMail(mailOptions);

  // Add the user to the database with a "verified" flag set to false
  db.data.users.push({
    name,
    email,
    password: hashedPassword,
    verified: false,
  });
  await db.write();

  res.status(200).send({
    ok: true,
    message:
      "User registered successfully. Please check your email to verify your account.",
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);

  console.log("inside login,", user);
  try {
    if (user) {
      if (!user.verified) {
        return res
          .status(400)
          .send({ ok: false, message: "Please verify your email first!" });
      }

      const matchPassword = bcrypt.compareSync(password, user.password);

      if (matchPassword) {
        return res.status(200).send({
          ok: true,
          message: "Login successful",
          user: {
            name: user.name,
            email: user.email,
            verified: user.verified,
          },
        });
      }
      return;
    }

    return res.status(400).send({ ok: false, message: "Invalid Credentials!" });
  } catch (err) {
    console.error(err);
  }
});

// Email verification endpoint
app.get("/auth/verify-email", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    res.status(400).send({ ok: false, message: "Invalid token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    const user = findUser(decoded.email);

    if (user) {
      user.verified = true;
      await db.write();
      const file = fs.readFileSync(
        new URL("./successVerification.html", import.meta.url).pathname
      );
      res.status(200).send(file.toString());
    } else {
      res.status(400).send({ ok: false, message: "User not found" });
    }
  } catch (error) {
    res.status(400).send({ ok: false, message: "Invalid or expired token" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(new URL("../frontend/index.html", import.meta.url).pathname);
});

app.listen(port, () => {
  console.log(`App listening ${expectedOrigin}`);
});
