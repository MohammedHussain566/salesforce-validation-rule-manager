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

    const conn =
      new jsforce.Connection({
        instanceUrl,
        accessToken,
        version: "59.0"
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

    console.log("GET RULES ERROR:");
    console.log(error);

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

    console.log("RULE ID:", ruleId);
    console.log("ACTIVE:", active);

    const conn =
      new jsforce.Connection({
        instanceUrl,
        accessToken,
        version: "59.0"
      });

    // =====================================
    // GET RULE DETAILS
    // =====================================

    const ruleResult =
      await conn.tooling.query(`
        SELECT
          Id,
          ValidationName,
          EntityDefinition.QualifiedApiName
        FROM ValidationRule
        WHERE Id = '${ruleId}'
      `);

    const rule =
      ruleResult.records[0];

    console.log("RULE:");
    console.log(rule);

    // =====================================
    // BUILD FULL NAME
    // =====================================

    const fullName =
      `${rule.EntityDefinition.QualifiedApiName}.${rule.ValidationName}`;

    console.log("FULL NAME:", fullName);

    // =====================================
    // READ FULL METADATA
    // =====================================

    const metadata =
      await conn.metadata.read(
        "ValidationRule",
        fullName
      );

    console.log("METADATA:");
    console.log(metadata);

    // =====================================
    // UPDATE ACTIVE STATUS
    // =====================================

    metadata.active = active;

    // =====================================
    // UPDATE METADATA
    // =====================================

    const updateResult =
      await conn.metadata.update(
        "ValidationRule",
        metadata
      );

    console.log("UPDATE RESULT:");
    console.log(updateResult);

    res.json({
      success: true,
      result: updateResult
    });

  } catch (error) {

    console.log("TOGGLE ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
      details: error
    });
  }
});

// =====================================
// SERVER
// =====================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on ${PORT}`);

});