const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ============================================================
const FULL_NAME = "vineet singh";
const DOB_DDMMYYYY = "01092004";
const EMAIL = "vineet.singh0194@gmail.com";
const ROLL_NUMBER = "22bcb0180";
// ============================================================

const userId =
  `${FULL_NAME.trim().toLowerCase().replace(/\s+/g, "_")}_${DOB_DDMMYYYY}`;

const isIntegerString = (s) => typeof s === "string" && /^[-+]?\d+$/.test(s.trim());
const isAlphabeticString = (s) => typeof s === "string" && /^[A-Za-z]+$/.test(s.trim());

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body?.data;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        is_success: false,
        user_id: userId,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        error: 'Invalid payload: "data" must be a non-empty array.'
      });
    }

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    const alphaChars = [];

    for (const item of data) {
      const str = String(item).trim();

      if (isIntegerString(str)) {
        const num = parseInt(str, 10);
        (Math.abs(num) % 2 === 0 ? even_numbers : odd_numbers).push(str);
        sum += num;
      } else if (isAlphabeticString(str)) {
        alphabets.push(str.toUpperCase());
        for (const ch of str) alphaChars.push(ch);
      } else {
        special_characters.push(str);
      }
    }

    alphaChars.reverse();
    const concat_string = alphaChars
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    return res.status(200).json({
      is_success: true,
      user_id: userId,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (e) {
    return res.status(500).json({
      is_success: false,
      user_id: userId,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      error: "Internal server error"
    });
  }
});

app.all("/bfhl", (req, res) => {
  res.status(405).json({
    is_success: false,
    user_id: userId,
    email: EMAIL,
    roll_number: ROLL_NUMBER,
    error: "Method Not Allowed. Use POST."
  });
});

app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    user_id: userId,
    email: EMAIL,
    roll_number: ROLL_NUMBER,
    error: "Invalid Route"
  });
});

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({
    is_success: false,
    user_id: userId,
    email: EMAIL,
    roll_number: ROLL_NUMBER,
    error: "Internal server error"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on :${PORT}`));
