import { useState, useCallback } from "react";

export const LoginCodeForm = ({ onLogin, onSetLoginState, loading }) => {
  const [input, setInput] = useState("");

  const handleInput = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onLogin(input);
    },
    [onLogin, input]
  );

  return (
    <div className="content container">
      <h1>Enter Verification Code</h1>
      <section className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            name="code"
            placeholder="Enter 6 digit code"
            autoFocus={true}
            value={input}
            onInput={handleInput}
            autoComplete="off"
          />
          <button type="submit">{loading ? "Sending…" : "Login"}</button>
        </form>
        <p className="description">
          <a onClick={() => onSetLoginState("emailInput")} href="#">
            Back
          </a>
        </p>
      </section>
    </div>
  );
};
