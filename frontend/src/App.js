import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [token, setToken] = useState("");
  const [instanceUrl, setInstanceUrl] = useState("");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================
  // RENDER BACKEND URL
  // =====================================

  const API_BASE_URL =
    "https://salesforce-validation-rule-manager-79go.onrender.com";

  // =====================================
  // LOAD TOKEN
  // =====================================

  useEffect(() => {

    const hash = window.location.hash;

    if (hash) {

      const params =
        new URLSearchParams(
          hash.substring(1)
        );

      const accessToken =
        params.get("access_token");

      const instance =
        params.get("instance_url");

      if (accessToken) {

        setToken(accessToken);

        localStorage.setItem(
          "sf_token",
          accessToken
        );
      }

      if (instance) {

        setInstanceUrl(instance);

        localStorage.setItem(
          "sf_instance",
          instance
        );
      }

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

    } else {

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
  // LOGIN
  // =====================================

  const loginToSalesforce = () => {

    const clientId =
      "3MVG9dAEux2v1sLsBAqkbUBkTuyc8dTD1KguW66DnrDTssaDv4XfnUCKOsDImKXjEao7fD1qh_.KnAAhBmwfG";

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
  // GET RULES
  // =====================================

  const fetchValidationRules = async () => {

    try {

      setLoading(true);

      const response =
        await axios.post(
          `${API_BASE_URL}/get-rules`,
          {
            accessToken: token,
            instanceUrl: instanceUrl
          }
        );

      setRules(
        response.data.records
      );

    } catch (error) {

      console.log(error);

      alert("Failed to fetch rules");

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // TOGGLE RULE
  // =====================================

  const toggleRule = async (
    ruleId,
    currentState
  ) => {

    try {

      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/toggle-rule`,
        {
          accessToken: token,
          instanceUrl: instanceUrl,
          ruleId: ruleId,
          active: !currentState
        }
      );

      const updatedRules =
        rules.map((rule) => {

          if (rule.Id === ruleId) {

            return {
              ...rule,
              Active: !currentState
            };
          }

          return rule;
        });

      setRules(updatedRules);

      alert("Validation Rule Updated ✅");

    } catch (error) {

      console.log(error);

      alert("Error updating validation rule");

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {

    localStorage.clear();

    window.location.reload();
  };

  return (

    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        background: "#f4f6f9",
        minHeight: "100vh"
      }}
    >

      <h1>
        Salesforce Validation Rule Manager
      </h1>

      {!token ? (

        <button
          onClick={loginToSalesforce}
          style={{
            padding: "12px 20px",
            background: "#0176d3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Login with Salesforce
        </button>

      ) : (

        <div>

          <h2>
            Login Successful ✅
          </h2>

          <p>
            Connected to:
          </p>

          <strong>
            {instanceUrl}
          </strong>

          <br />
          <br />

          <button
            onClick={fetchValidationRules}
            style={{
              padding: "10px 20px",
              background: "#2e844a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              marginRight: "10px",
              cursor: "pointer"
            }}
          >
            Get Validation Rules
          </button>

          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              background: "#ba0517",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>

          <br />
          <br />

          {loading && (
            <h3>Loading...</h3>
          )}

          {rules.map((rule) => (

            <div
              key={rule.Id}
              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >

              <h2>
                {rule.ValidationName}
              </h2>

              <p>
                Status:
                {" "}
                {rule.Active
                  ? "Active ✅"
                  : "Inactive ❌"}
              </p>

              <button
                onClick={() =>
                  toggleRule(
                    rule.Id,
                    rule.Active
                  )
                }
                style={{
                  padding: "10px 18px",
                  background:
                    rule.Active
                      ? "#ba0517"
                      : "#2e844a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
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
  );
}

export default App;