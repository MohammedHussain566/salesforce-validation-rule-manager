const express = require("express");
const cors = require("cors");
const jsforce = require("jsforce");

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {

  res.send("Backend Running ✅");

});

// =====================================
// GET VALIDATION RULES
// =====================================

app.post("/get-rules", async (req, res) => {

  try {

    const {
      accessToken,
      instanceUrl
    } = req.body;

    if (!accessToken || !instanceUrl) {

      return res.status(400).json({
        success: false,
        message: "Missing Token"
      });
    }

    const conn =
      new jsforce.Connection({
        instanceUrl,
        accessToken
      });

    const result =
      await conn.tooling.query(`
        SELECT
          Id,
          ValidationName,
          Active
        FROM ValidationRule
      `);

    res.json({
      success: true,
      records: result.records
    });

  } catch (error) {

    console.log(
      "GET RULES ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// TOGGLE VALIDATION RULE
// =====================================

app.post("/toggle-rule", async (req, res) => {

  try {

    const {
      accessToken,
      instanceUrl,
      ruleId,
      active
    } = req.body;

    const conn =
      new jsforce.Connection({
        instanceUrl,
        accessToken
      });

    await conn.tooling
      .sobject("ValidationRule")
      .update({
        Id: ruleId,
        Active: active
      });

    res.json({
      success: true
    });

  } catch (error) {

    console.log(
      "TOGGLE ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// PORT
// =====================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});