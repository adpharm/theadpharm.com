const formSubmissionId = crypto.randomUUID();
const lang = "en";

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const data = {
    firstName: (
      form.querySelector("#firstName") as HTMLInputElement
    )?.value.trim(),
    lastName: (
      form.querySelector("#lastName") as HTMLInputElement
    )?.value.trim(),
    organization: (
      form.querySelector("#organization") as HTMLInputElement
    )?.value.trim(),
    email: (form.querySelector("#email") as HTMLInputElement)?.value.trim(),
    message: (
      form.querySelector("#message") as HTMLTextAreaElement
    )?.value.trim(),
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
      return res.json();
    })
    .then(() => {
      alert("Thank you for getting in touch!");
      form.reset();
    })
    .catch((err) => {
      console.error(err);
      alert("There was an error submitting the form. Please try again later.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("get-in-touch-form");
  form?.addEventListener("submit", handleSubmit);
});
