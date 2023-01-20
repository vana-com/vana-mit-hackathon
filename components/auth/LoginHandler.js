import { useState, useEffect } from "react";
import { LoginEmailForm } from "components/auth/forms/LoginEmailForm";
import { LoginCodeForm } from "components/auth/forms/LoginCodeForm";
import { StartLogin } from "components/auth/forms/StartLogin";
import * as jose from "jose";
import { vanaApiPost, vanaApiGet } from "vanaApi";

/**
 * This component abstracts login. Feel free to take a look but you can just ignore it in this
 * hackathon
 */
export const LoginHandler = ({ children, setUser }) => {
  const [email, setEmail] = useState("");
  const [loginState, setLoginState] = useState("initial"); // initial, emailInput, codeInput, loggedIn
  const [loading, setLoading] = useState(false);
  const authToken =
    typeof window !== "undefined" ? localStorage.authToken : undefined;

  // Refresh the user's details every minute
  useEffect(() => {
    const refreshUserWithTimeout = async () => {
      const refreshUser = async () => {
        if (authToken) {
          const [exhibitsPromise, textToImagePromise, balancePromise] = [
            vanaApiGet("account/exhibits", authToken),
            vanaApiGet("account/exhibits/text-to-image", authToken),
            vanaApiGet("account/balance", authToken),
          ];

          const [exhibitsResponse, textToImageResponse, balanceResponse] =
            await Promise.all([
              exhibitsPromise,
              textToImagePromise,
              balancePromise,
            ]);

          const newUser = {
            balance: balanceResponse.balance,
            exhibits: exhibitsResponse.exhibits,
            textToImage: textToImageResponse.urls,
          };
          setUser(newUser);
        }
      };
      await refreshUser();
      setTimeout(refreshUserWithTimeout, 60000);
    };
    refreshUserWithTimeout();

    return () => clearTimeout(refreshUserWithTimeout);
  }, []);

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
              localStorage.setItem("authToken", savedToken);
              setLoginState("loggedIn");
              return;
            }
          }
          localStorage.setItem("authToken", "");
        } catch (e) {
          console.error("Unable to decode auth token", e);
          localStorage.setItem("authToken", "");
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
      await vanaApiPost("auth/create-login", {
        email,
      });
      setLoginState("codeInput");
    } catch (error) {
      console.error("Unable to create log in code", error);
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (code) => {
    try {
      setLoading(true);
      const { token } = await vanaApiPost("auth/login", {
        email,
        code,
      });

      localStorage.setItem("authToken", token);
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
      {loginState === "initial" && (
        <StartLogin onSetLoginState={setLoginState} />
      )}

      {loginState === "emailInput" && (
        <LoginEmailForm
          onGetCode={createLogin}
          onSetLoginState={setLoginState}
          loading={loading}
        />
      )}

      {loginState === "codeInput" && (
        <LoginCodeForm
          onLogin={logIn}
          loading={loading}
          onSetLoginState={setLoginState}
        />
      )}

      {loginState === "loggedIn" && children}
    </>
  );
};
