export const PromptLogin = ({ onSetLoginState }) => {
  return (
    <>
      <h1>Vana Login</h1>
      <section className="w-full space-y-4">
        <button
          onClick={() => onSetLoginState("promptEmail")}
          className="field button primaryButton"
        >
          Login
        </button>
        <p className="description">
          New to Vana?{" "}
          <a target="_blank" href="https://portrait.vana.com/create">
            Create your Portrait
          </a>
        </p>
      </section>
    </>
  );
};
