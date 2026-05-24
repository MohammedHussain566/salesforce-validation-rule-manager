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

    // SALESFORCE CONNECTION

    const conn =
      new jsforce.Connection({
        instanceUrl,
        accessToken,
        version: "59.0"
      });

    // FETCH VALIDATION RULES

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
      "GET RULES ERROR:"
    );

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

    // SALESFORCE CONNECTION

    const conn =
      new jsforce.Connection({
        instanceUrl,
        accessToken,
        version: "59.0"
      });

    // =====================================
    // GET VALIDATION RULE
    // =====================================

    const rule =
      await conn.tooling
        .sobject("ValidationRule")
        .retrieve(ruleId);

    console.log(
      "RULE:",
      rule
    );

    // =====================================
    // GET ENTITY DETAILS
    // =====================================

    const entity =
      await conn.tooling
        .sobject("EntityDefinition")
        .retrieve(
          rule.EntityDefinitionId
        );

    console.log(
      "ENTITY:",
      entity
    );

    // =====================================
    // BUILD FULL NAME
    // =====================================

    const fullName =
      `${entity.QualifiedApiName}.${rule.ValidationName}`;

    console.log(
      "FULL NAME:",
      fullName
    );

    // =====================================
    // READ METADATA
    // =====================================

    const metadata =
      await conn.metadata.read(
        "ValidationRule",
        fullName
      );

    console.log(
      "METADATA:",
      metadata
    );

    // =====================================
    // CREATE UPDATED METADATA
    // =====================================

    const updatedMetadata = {

      fullName:
        metadata.fullName,

      active:
        active,

      description:
        metadata.description || "",

      errorConditionFormula:
        metadata.errorConditionFormula,

      errorMessage:
        metadata.errorMessage

    };

    console.log(
      "UPDATED METADATA:",
      updatedMetadata
    );

    // =====================================
    // UPDATE VALIDATION RULE
    // =====================================

    const updateResult =
      await conn.metadata.update(
        "ValidationRule",
        updatedMetadata
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
      "TOGGLE ERROR:"
    );

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// SERVER
// =====================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});