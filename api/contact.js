import { useRef } from "react";

export default function ContactForm() {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the reCAPTCHA token
    const token = window.grecaptcha && window.grecaptcha.getResponse();
    if (!token) {
      alert("Please complete the reCAPTCHA!");
      return;
    }

    // Example: send the token with your form data
    // const data = new FormData(formRef.current);
    // data.append('g-recaptcha-response', token);

    // fetch('/api/contact', { method: 'POST', body: data })...

    alert("Form ready to submit. Token: " + token);

    // Reset reCAPTCHA
    window.grecaptcha.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* Your form fields */}
      <input name="name" placeholder="Your Name" className="input" />
      <input name="email" placeholder="Your Email" className="input" />
      <textarea name="message" placeholder="Your Message" className="input" />

      {/* Google reCAPTCHA widget */}
      <div
        className="g-recaptcha"
        data-sitekey="6LexhGgrAAAAAFdExLBdBEXwEME3LktiuB-TX-AM"
        style={{ margin: "20px 0" }}
      ></div>

      <button type="submit">Send</button>
    </form>
  );
}
