import { useState, useEffect } from "react";
import Head from "next/head";
import { GithubIcon } from "components/icons/GithubIcon";
import { getUser, vanaApiPost } from "vanaApi";
import { LoginHandler } from "components/auth/LoginHandler";

export default function Home() {
  // User State
  const [user, setUser] = useState({
    balance: 0,
    exhibits: [],
    textToImage: [],
  });

  // Text-to-Image State
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const callTextToImageAPI = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await vanaApiPost(`images/generations`, {
        prompt: prompt.replace(/\bme\b/i, "{target_token}"), // Replace the word "me" with "{target_token}" in the prompt to include yourself in the picture
      });

      // Update user state (new images, balance, etc)
      const user = await getUser();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error(error);
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
          {user.exhibits.length > 0 && (
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
                  <button type="submit" disabled={isLoading}>
                    Generate image
                  </button>
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
                {user?.textToImage?.map((image, i) => (
                  <img src={image} key={i} className="w-full" />
                ))}
              </div>
            </div>
          )}

          {/* User doesn't have a trained model*/}
          {user.exhibits.length === 0 && (
            <p>
              Unfortunately, you haven't created a personalized Vana Portrait
              model yet. Go to https://portrait.vana.com/create to create one 🙂
            </p>
          )}
        </LoginHandler>
      </main>
    </>
  );
}
