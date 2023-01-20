import { useState } from "react";
import Head from "next/head";
import { GithubIcon } from "components/icons/GithubIcon";
import { vanaApiPost } from "vanaApi";
import { LoginHandler } from "components/auth/LoginHandler";

const meRegex = /\bme\b/i;

export default function Home() {
  // Login State
  const authToken =
    typeof window !== "undefined" ? localStorage.authToken : undefined;
  const [user, setUser] = useState({ balance: 0, exhibits: {} });

  // Text-to-Image State
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (authToken && !user.exhibits.length) {
    console.log(
      "Unfortunately, you haven't created a personalized Vana Portrait model yet. Go to https://portrait.vana.com/create to create one :)"
    );
  }

  const callTextToImageAPI = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await vanaApiPost(
        `jobs/text-to-image`,
        {
          prompt: prompt.replace(meRegex, "{target_token}"),
          exhibit_name: "text-to-image",
          n_samples: 5,
          // The inference seed: A non-negative integer fixes inference so inference on the same
          // (model, prompt) produces the same output
          seed: -1,
        },
        authToken
      );
    } catch (error) {
      setErrorMessage("An error occurred while generating the image");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Vana MIT Hackathon</title>
        <meta name="description" content="Vana MIT Hackathon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="header">
        <a
          href="https://github.com/vana-com/vana-mit-hackathon"
          target="_blank"
        >
          <GithubIcon />
        </a>
      </header>
      <main className="main">
        <LoginHandler setUser={setUser}>
          {user.exhibits.length && (
            <div className="content container">
              <div className="space-y-4">
                <label htmlFor="prompt-input">Prompt:</label>
                <form onSubmit={callTextToImageAPI}>
                  <input
                    id="prompt-input"
                    type="text"
                    placeholder="Me eating blue spaghetti"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                  />
                  <button type="submit">Generate image</button>
                </form>
                <div>Credit balance: {user?.balance ?? 0}</div>

                {isLoading && <p>Loading...</p>}
                {errorMessage && <p>Error: {errorMessage}</p>}

                <div>
                  <p>
                    Tip: make sure to include the word "me" in your prompt to
                    include your face
                  </p>
                </div>
              </div>

              {/** Show the images a user has created */}
              <div className="pt-1 space-y-4">
                {user.textToImage?.map((image, i) => (
                  <img src={image} key={i} class="w-full" />
                ))}
              </div>
            </div>
          )}
        </LoginHandler>
      </main>
    </>
  );
}
