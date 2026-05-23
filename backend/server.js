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
// FETCH VALIDATION RULES
// =====================================

app.post("/get-rules", async (req, res) => {

  try {

    const {
      accessToken,
      instanceUrl
    } = req.body;

    // SALESFORCE CONNECTION

    const conn = new jsforce.Connection({
      instanceUrl: instanceUrl,
      accessToken: accessToken
    });

    // TOOLING API QUERY

    const result =
      await conn.tooling.query(`
        SELECT
          Id,
          ValidationName,
          Active,
          EntityDefinitionId
        FROM ValidationRule
      `);

    res.json({
      success: true,
      records: result.records
    });

  } catch (error) {

    console.log(
      "GET RULES ERROR:",
      error
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

    // =====================================
    // SALESFORCE CONNECTION
    // =====================================

    const conn = new jsforce.Connection({
      instanceUrl: instanceUrl,
      accessToken: accessToken
    });

    // =====================================
    // GET VALIDATION RULE
    // =====================================

    const ruleResult =
      await conn.tooling
        .sobject("ValidationRule")
        .retrieve(ruleId);

    console.log(
      "RULE RESULT:",
      ruleResult
    );

    // =====================================
    // BUILD FULL NAME
    // =====================================

    const fullName =
      `${ruleResult.EntityDefinitionId}.${ruleResult.ValidationName}`;

    console.log(
      "FULL NAME:",
      fullName
    );

    // =====================================
    // READ METADATA
    // =====================================

    const metadataRead =
      await conn.metadata.read(
        "ValidationRule",
        fullName
      );

    console.log(
      "METADATA READ:",
      metadataRead
    );

    // =====================================
    // UPDATE ACTIVE STATUS
    // =====================================

    metadataRead.active = active;

    // =====================================
    // UPDATE METADATA
    // =====================================

    const updateResult =
      await conn.metadata.update(
        "ValidationRule",
        metadataRead
      );

    console.log(
      "UPDATE RESULT:",
      updateResult
    );

    res.json({
      success: true,
      result: updateResult
    });

  } catch (error) {

    console.log(
      "========== TOGGLE ERROR =========="
    );

    console.log(error);

    console.log(
      "MESSAGE:",
      error.message
    );

    if (error.data) {

      console.log(
        "DATA:",
        error.data
      );
    }

    res.status(500).json({
      success: false,
      message: error.message,
      data: error.data || null
    });
  }
});

// =====================================
// SERVER
// =====================================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});