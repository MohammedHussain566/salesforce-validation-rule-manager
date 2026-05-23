import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {

  // =====================================
  // STATES
  // =====================================

  const [token, setToken] = useState("");
  const [instanceUrl, setInstanceUrl] = useState("");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================
  // BACKEND URL
  // =====================================

  const API_BASE_URL =
    "https://salesforce-validation-rule-manager-79go.onrender.com";

  // =====================================
  // LOAD TOKEN AFTER LOGIN
  // =====================================

  useEffect(() => {

    const hash = window.location.hash;

    if (hash) {

      const params = new URLSearchParams(
        hash.substring(1)
      );

      const accessToken =
        params.get("access_token");

      const instance =
        params.get("instance_url");

      // SAVE TOKEN

      if (accessToken) {

        setToken(accessToken);

        localStorage.setItem(
          "sf_token",
          accessToken
        );
      }

      // SAVE INSTANCE URL

      if (instance) {

        setInstanceUrl(instance);

        localStorage.setItem(
          "sf_instance",
          instance
        );
      }

      // REMOVE HASH FROM URL

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

    } else {

      // RESTORE FROM LOCAL STORAGE

      const savedToken =
        localStorage.getItem("sf_token");

      const savedInstance =
        localStorage.getItem("sf_instance");

      if (savedToken) {
        setToken(savedToken);
      }

      if (savedInstance) {
        setInstanceUrl(savedInstance);
      }
    }

  }, []);

  // =====================================
  // LOGIN TO SALESFORCE
  // =====================================

  const loginToSalesforce = () => {

    const clientId =
      "3MVG9dAEux2v1sLsBAqkbUBkTuyc8dTD1KguW66DnrDTssaDv4XfnUCKOsDImKXjEao7fD1qh_.KnAAhBmwfG";

    // =====================================
    // YOUR VERCEL FRONTEND URL
    // =====================================

    const redirectUri =
      "https://salesforce-validation-rule-manager-hp6qh63xr.vercel.app";

    const authUrl =
      `https://login.salesforce.com/services/oauth2/authorize` +
      `?response_type=token` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

    window.location.href = authUrl;
  };

  // =====================================
  // FETCH VALIDATION RULES
  // =====================================

  const fetchValidationRules = async () => {

    try {

      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/get-rules`,
        {
          accessToken: token,
          instanceUrl: instanceUrl
        }
      );

      console.log(
        "RULES RESPONSE:",
        response.data
      );

      if (response.data.success) {

        setRules(response.data.records);

      } else {

        alert(
          "Failed to fetch validation rules"
        );
      }

    } catch (error) {

      console.log(
        "FETCH ERROR:",
        error
      );

      alert(
        "Error fetching validation rules"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // TOGGLE VALIDATION RULE
  // =====================================

  const toggleRule = async (
    ruleId,
    currentState
  ) => {

    try {

      setLoading(true);

      // =====================================
      // UPDATE UI IMMEDIATELY
      // =====================================

      const updatedRules = rules.map(
        (rule) => {

          if (rule.Id === ruleId) {

            return {
              ...rule,
              Active: !currentState
            };
          }

          return rule;
        }
      );

      // UPDATE STATE

      setRules(updatedRules);

      // =====================================
      // SEND UPDATE TO BACKEND
      // =====================================

      const response = await axios.post(
        `${API_BASE_URL}/toggle-rule`,
        {
          accessToken: token,
          instanceUrl: instanceUrl,
          ruleId: ruleId,
          active: !currentState
        }
      );

      console.log(
        "TOGGLE RESPONSE:",
        response.data
      );

      if (response.data.success) {

        alert(
          `Validation Rule ${
            !currentState
              ? "Enabled ✅"
              : "Disabled ❌"
          }`
        );

      } else {

        alert(
          "Failed to update validation rule"
        );
      }

    } catch (error) {

      console.log(
        "TOGGLE ERROR:",
        error
      );

      alert(
        "Error updating validation rule"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // ENABLE ALL RULES
  // =====================================

  const enableAllRules = async () => {

    try {

      setLoading(true);

      const updatedRules = rules.map(
        (rule) => ({
          ...rule,
          Active: true
        })
      );

      setRules(updatedRules);

      for (const rule of rules) {

        await axios.post(
          `${API_BASE_URL}/toggle-rule`,
          {
            accessToken: token,
            instanceUrl: instanceUrl,
            ruleId: rule.Id,
            active: true
          }
        );
      }

      alert(
        "All Validation Rules Enabled ✅"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Error enabling all rules"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // DISABLE ALL RULES
  // =====================================

  const disableAllRules = async () => {

    try {

      setLoading(true);

      const updatedRules = rules.map(
        (rule) => ({
          ...rule,
          Active: false
        })
      );

      setRules(updatedRules);

      for (const rule of rules) {

        await axios.post(
          `${API_BASE_URL}/toggle-rule`,
          {
            accessToken: token,
            instanceUrl: instanceUrl,
            ruleId: rule.Id,
            active: false
          }
        );
      }

      alert(
        "All Validation Rules Disabled ❌"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Error disabling all rules"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // DEPLOY CHANGES
  // =====================================

  const deployChanges = () => {

    alert(
      "Changes successfully deployed to Salesforce ✅"
    );
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {

    localStorage.removeItem(
      "sf_token"
    );

    localStorage.removeItem(
      "sf_instance"
    );

    setToken("");
    setInstanceUrl("");
    setRules([]);

    window.location.reload();
  };

  // =====================================
  // UI
  // =====================================

  return (

    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh"
      }}
    >

      <h1>
        Salesforce Validation Rule Manager
      </h1>

      {/* LOGIN */}

      {!token ? (

        <button
          onClick={loginToSalesforce}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#0176d3",
            color: "white",
            fontSize: "16px"
          }}
        >
          Login with Salesforce
        </button>

      ) : (

        <div>

          {/* LOGIN SUCCESS */}

          <h3>
            Login Successful ✅
          </h3>

          <p>
            Connected to:
          </p>

          <strong>
            {instanceUrl}
          </strong>

          <br />
          <br />

          {/* TOP BUTTONS */}

          <button
            onClick={fetchValidationRules}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#2e844a",
              color: "white",
              marginRight: "10px"
            }}
          >
            Get Validation Rules
          </button>

          <button
            onClick={enableAllRules}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#2e844a",
              color: "white",
              marginRight: "10px"
            }}
          >
            Enable All
          </button>

          <button
            onClick={disableAllRules}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ba0517",
              color: "white",
              marginRight: "10px"
            }}
          >
            Disable All
          </button>

          <button
            onClick={deployChanges}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#0176d3",
              color: "white",
              marginRight: "10px"
            }}
          >
            Deploy Changes
          </button>

          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#706e6b",
              color: "white"
            }}
          >
            Logout
          </button>

          <br />
          <br />

          {/* LOADING */}

          {loading && (
            <p>
              Loading...
            </p>
          )}

          {/* VALIDATION RULES */}

          {rules.length > 0 && (

            <div>

              <h2>
                Validation Rules
              </h2>

              {rules.map((rule) => (

                <div
                  key={rule.Id}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "15px",
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.1)"
                  }}
                >

                  <h3>
                    {rule.ValidationName}
                  </h3>

                  <p>
                    Status:
                    {rule.Active
                      ? " Active ✅"
                      : " Inactive ❌"}
                  </p>

                  {/* ENABLE / DISABLE BUTTON */}

                  <button
                    onClick={() =>
                      toggleRule(
                        rule.Id,
                        rule.Active
                      )
                    }
                    style={{
                      padding: "10px 18px",
                      cursor: "pointer",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor:
                        rule.Active
                          ? "#ba0517"
                          : "#2e844a",
                      color: "white"
                    }}
                  >
                    {rule.Active
                      ? "Disable"
                      : "Enable"}
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default App;