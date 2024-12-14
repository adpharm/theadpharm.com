import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  signUp: defineAction({
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    handler: async (inputData) => {
      // set csrf token
      const csrfRes = await fetch(
        "http://localhost:8000/api/users/set-csrf-token",
        {
          method: "GET",
          credentials: "include",
        },
      );
      const csrfData = await csrfRes.json();
      const csrftoken = csrfData.csrftoken;

      console.log("csrftoken", csrftoken);

      // call the django api
      const res = await fetch("http://localhost:8000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
          Cookie: `csrftoken=${csrftoken}`, // Cookie in the header
        },
        body: JSON.stringify(inputData),
        credentials: "include",
      });

      // console.log(res);

      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Failed to sign up");
      }
    },
  }),
};
