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
  // CUSTOM POPUP
  // =====================================

  const showPopup = (message, color) => {

    const oldPopup =
      document.getElementById("popup");

    if (oldPopup) {
      oldPopup.remove();
    }

    const popup =
      document.createElement("div");

    popup.id = "popup";

    popup.innerText = message;

    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.background = color;
    popup.style.color = "white";
    popup.style.padding = "14px 20px";
    popup.style.borderRadius = "10px";
    popup.style.fontWeight = "bold";
    popup.style.zIndex = "9999";
    popup.style.boxShadow =
      "0 2px 10px rgba(0,0,0,0.2)";

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 2000);
  };

  // =====================================
  // LOAD TOKEN AFTER LOGIN
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

      // REMOVE HASH FROM URL

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
  // LOGIN TO SALESFORCE
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
  // FETCH RULES
  // =====================================

  const fetchValidationRules = async () => {

    if (!token || !instanceUrl) {

      showPopup(
        "Please Login Again ❌",
        "#ba0517"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/get-rules`,
        {
          accessToken: token,
          instanceUrl: instanceUrl
        }
      );

      if (response.data.success) {

        setRules(response.data.records);

        showPopup(
          "Rules Loaded ✅",
          "#2e844a"
        );

      } else {

        showPopup(
          "Failed ❌",
          "#ba0517"
        );
      }

    } catch (error) {

      console.log(error);

      showPopup(
        "Session Expired ❌",
        "#ba0517"
      );
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

      // UPDATE UI

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

      const response =
        await axios.post(
          `${API_BASE_URL}/toggle-rule`,
          {
            accessToken: token,
            instanceUrl: instanceUrl,
            ruleId: ruleId,
            active: !currentState
          }
        );

      if (response.data.success) {

        showPopup(
          "Updated ✅",
          "#2e844a"
        );

      } else {

        showPopup(
          "Update Failed ❌",
          "#ba0517"
        );
      }

    } catch (error) {

      console.log(error);

      showPopup(
        "Error ❌",
        "#ba0517"
      );

    } finally {

      setLoading(false);
    }
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

      {!token ? (

        <button
          onClick={loginToSalesforce}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#0176d3",
            color: "white",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Login with Salesforce
        </button>

      ) : (

        <div>

          <h3>
            Login Successful ✅
          </h3>

          <strong>
            {instanceUrl}
          </strong>

          <br />
          <br />

          <button
            onClick={fetchValidationRules}
            disabled={loading}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#2e844a",
              color: "white",
              cursor: "pointer"
            }}
          >
            Get Validation Rules
          </button>

          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#ba0517",
              color: "white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>

          <br />
          <br />

          {loading && (
            <p>Loading...</p>
          )}

          {rules.length > 0 && (

            <div>

              <h2>
                Validation Rules
              </h2>

              {rules.map((rule) => (

                <div
                  key={rule.Id}
                  style={{
                    background: "white",
                    padding: "20px",
                    marginBottom: "15px",
                    borderRadius: "10px",
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

                  <button
                    onClick={() =>
                      toggleRule(
                        rule.Id,
                        rule.Active
                      )
                    }
                    style={{
                      padding: "10px 18px",
                      border: "none",
                      borderRadius: "6px",
                      backgroundColor:
                        rule.Active
                          ? "#ba0517"
                          : "#2e844a",
                      color: "white",
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

      )}

    </div>
  );
}

export default App;