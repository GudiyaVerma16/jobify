import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);
  const { user, isLoading, showAlert, displayAlert, setupUser } =
    useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: "Login Successful! Redirecting...",
      });
    } else {
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: "User Created! Redirecting...",
      });
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {/* name input */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}

        {/* email input */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* password input */}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <button
          type="button"
          className="btn btn-block btn-hipster"
          disabled={isLoading}
          onClick={() => {
            setupUser({
              currentUser: { email: "testUser@test.com", password: "secret" },
              endPoint: "login",
              alertText: "Login Successful! Redirecting...",
            });
          }}
        >
          {isLoading ? "loading..." : "demo app"}
        </button>

        {/* Debug buttons */}
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <h4>Debug Tools</h4>

          {/* Incognito Warning */}
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <strong>⚠️ Incognito Mode Notice:</strong> If you're using
            incognito/private browsing, cookies may not work properly. Try using
            a regular browser window for the best experience.
          </div>

          <button
            type="button"
            className="btn btn-block"
            onClick={async () => {
              try {
                console.log("🧪 Testing server connection...");
                const response = await fetch("/api/v1/auth/test");
                const data = await response.json();
                console.log("🧪 Server test response:", data);
                alert("Check console for server test results");
              } catch (error) {
                console.error("❌ Server test failed:", error);
                alert("Server test failed - check console");
              }
            }}
          >
            Test Server Connection
          </button>

          <button
            type="button"
            className="btn btn-block"
            onClick={async () => {
              try {
                console.log("🍪 Testing cookie setting...");
                const response = await fetch("/api/v1/auth/test-cookie", {
                  credentials: "include",
                });
                const data = await response.json();
                console.log("🍪 Cookie test response:", data);
                alert("Check console for cookie test results");
              } catch (error) {
                console.error("❌ Cookie test failed:", error);
                alert("Cookie test failed - check console");
              }
            }}
          >
            Test Cookie Setting
          </button>

          <button
            type="button"
            className="btn btn-block"
            onClick={async () => {
              try {
                console.log("🔍 Checking cookies...");
                const response = await fetch("/api/v1/auth/check-cookies", {
                  credentials: "include",
                });
                const data = await response.json();
                console.log("🔍 Cookie check response:", data);
                alert("Check console for cookie check results");
              } catch (error) {
                console.error("❌ Cookie check failed:", error);
                alert("Cookie check failed - check console");
              }
            }}
          >
            Check Cookies
          </button>

          <button
            type="button"
            className="btn btn-block"
            onClick={() => {
              console.log("🌐 Current API URL:", process.env.REACT_APP_API_URL);
              console.log(
                "🌐 Base URL being used:",
                window.location.origin + "/api/v1"
              );
              alert(
                `API URL: ${
                  process.env.REACT_APP_API_URL || "Not set"
                }\nBase URL: ${window.location.origin}/api/v1`
              );
            }}
          >
            Check Environment Variables
          </button>
        </div>
        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
