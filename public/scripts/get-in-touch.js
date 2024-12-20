const formSubmissionId = crypto.randomUUID();
const lang = "en";

console.log("get-in-touch.ts loaded");

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const data = {
    firstName: form.querySelector("#firstName")?.value.trim(),
    lastName: form.querySelector("#lastName")?.value.trim(),
    organization: form.querySelector("#organization")?.value.trim(),
    email: form.querySelector("#email")?.value.trim(),
    message: form.querySelector("#message")?.value.trim(),
  };

  fetch("https://data-collector.theadpharm.com/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      formSubmissionId,
      lang,
      type: "theadpharm.com",
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      console.log("Error", res.json());
      return res.json();
    })
    .then(() => {
      alert("Thank you for getting in touch!");
      console.log("Submission success");
      form.reset();
    })
    .catch((err) => {
      console.error(err);
      alert("There was an error submitting the form. Please try again later.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("get-in-touch-form");
  if (form) {
    console.log("Form found, attaching submit handler");
    form.addEventListener("submit", handleSubmit);
  } else {
    console.error("Form with id 'get-in-touch-form' not found");
  }
});
