import { useState, useEffect } from "react";
import { PromptEmail } from "components/auth/forms/PromptEmail";
import { PromptCode } from "components/auth/forms/PromptCode";
import { PromptLogin } from "components/auth/forms/PromptLogin";
import * as jose from "jose";
import styles from "styles/Home.module.css";
import { vanaPost } from "vanaApi";

/**
 * Renders a login form if not logged in,
 * Otherwise render its children
 */
export const LoggedIn = ({ children }) => {
  const [email, setEmail] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [loginState, setLoginState] = useState("initial"); // initial, promptEmail, promptCode, loggedIn
  const [loading, setLoading] = useState(false);

  /**
   * Reads a cached JWT token from LocalStorage, and updates the state
   * Checks for token expiry as well
   */
  const readCachedAuthToken = () => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("authToken");
      if (savedToken) {
        try {
          const claims = jose.decodeJwt(savedToken);
          if (claims && claims.exp) {
            const isExpired = Date.now() >= claims.exp * 1000;
            if (isExpired) {
              console.warn("Cached JWT is expired, logging user out.");
            } else {
              setAuthToken(savedToken);
              setLoginState("loggedIn");
              return;
            }
          }
          setAuthToken("");
        } catch (e) {
          console.error("Unable to decode auth token", e);
          setAuthToken("");
        }
      }
    }
  };
  useEffect(() => {
    readCachedAuthToken();
  }, []);

  const createLogin = async (email) => {
    setEmail(email);
    setLoading(true);

    try {
      await vanaPost("auth/create-login", {
        email,
      });
      setLoginState("promptCode");
    } catch (error) {
      console.error("Unable to create log in code", error);
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (code) => {
    try {
      setLoading(true);
      const { token } = await vanaPost("auth/login", {
        email,
        code,
      });

      setAuthToken(token);
      setLoginState("loggedIn");
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Unable to log in", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`${styles.center} ${styles.container} space-y-2`}>
        {loginState === "initial" && (
          <PromptLogin onSetLoginState={setLoginState} />
        )}

        {loginState === "promptEmail" && (
          <PromptEmail
            onGetCode={createLogin}
            onSetLoginState={setLoginState}
            loading={loading}
          />
        )}

        {loginState === "promptCode" && (
          <PromptCode
            onLogin={logIn}
            loading={loading}
            onSetLoginState={setLoginState}
          />
        )}

        {loginState === "loggedIn" && children}
      </div>
    </>
  );
};
