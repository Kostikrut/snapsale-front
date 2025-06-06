import "./styles/ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>

      <div className="contact-container">
        <div className="contact-info">
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@snapsale.cc">support@snapsalemarket.com</a>
          </p>
          <p>
            <strong>Phone:</strong> +1 (800) 123-4567
          </p>
          <p>
            <strong>Office Hours:</strong> Monday - Friday, 9 AM - 5 PM
          </p>
          <p>
            For immediate assistance, please refer to our{" "}
            <a href="/faq">FAQ page</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
