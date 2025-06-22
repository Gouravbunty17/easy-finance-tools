import { useRef } from 'react';

export default function ContactForm() {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use window.grecaptcha (not imported, it's global from index.html)
    const token = window.grecaptcha && window.grecaptcha.getResponse();
    if (!token) {
      alert('Please complete the reCAPTCHA');
      return;
    }
    // TODO: Send token with your form to your backend here!
    alert('Form is ready to send!\nreCAPTCHA Token: ' + token);

    // Optionally reset reCAPTCHA
    window.grecaptcha.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* Your form fields */}
      <input name="name" placeholder="Your Name" />
      <input name="email" placeholder="Your Email" />
      <textarea name="message" placeholder="Your Message"></textarea>

      <div
        className="g-recaptcha"
        data-sitekey="6LexhGgrAAAAAFdExLBdBEXwEME3LktiuB-TX-AM"
        style={{ margin: "20px 0" }}
      ></div>
      <button type="submit">Send</button>
    </form>
  );
}
