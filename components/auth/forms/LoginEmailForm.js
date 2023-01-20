import { useState, useCallback } from "react";

export const LoginEmailForm = ({ onGetCode, onSetLoginState, loading }) => {
  const [input, setInput] = useState("");

  const handleInput = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onGetCode(input);
    },
    [onGetCode, input]
  );

  return (
    <div className="content container">
      <h1>Login with Vana</h1>
      <section className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            autoFocus={true}
            disabled={loading}
            value={input}
            onInput={handleInput}
          />
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Sending…"
            ) : (
              "Get code"
            )}
          </button>
        </form>
        <p className="description">
          <a onClick={() => onSetLoginState("initial")} href="#">
            Back
          </a>
        </p>
      </section>
    </div>
  );
};
