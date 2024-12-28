import React, { useState } from "react";
import "./styles/FAQ.css";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is SnapSale Market?",
      answer:
        "SnapSale Market is your one-stop shop for the latest electronics at unbeatable prices. From smartphones to sound systems, we ensure a seamless shopping experience.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can track your order by logging into your account and navigating to the 'Orders' section, where you’ll find real-time updates on your shipment.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of purchase, provided the product is in its original condition. Visit our Returns page for more details.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us through our Contact Us page or email us at support@snapsalemarket.com. We’re here to help!",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "No, we currently only ship to the United States. We’re working on expanding our shipping locations, so stay tuned!",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept major credit cards, PayPal, Apple Pay, and Google Pay. You can also see a full list of supported payment methods on the checkout page.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Absolutely! We use industry-standard encryption and secure servers to protect your personal and payment information.",
    },
    {
      question: "Can I change or cancel my order?",
      answer:
        "Orders can be changed or canceled within 24 hours of placement. Contact our support team for assistance.",
    },
    {
      question: "How do I apply a discount code?",
      answer:
        "You can apply your discount code at checkout by entering it in the designated field and clicking 'Apply'.",
    },
    {
      question: "What should I do if I receive a damaged product?",
      answer:
        "If your product arrives damaged, please contact our support team immediately with photos of the damage. We’ll resolve the issue promptly.",
    },
    {
      question: "Do you offer warranties on products?",
      answer:
        "Yes, All of our products come with manufacturer warranties. Please check the product details page for specific warranty information.",
    },
    {
      question: "Can I create an account for faster checkouts?",
      answer:
        "Yes! Creating an account allows you to save your shipping details, track orders, and access exclusive offers.",
    },
    {
      question: "How do I leave a review for a product?",
      answer:
        "You can leave a review by navigating to the account page and clicking the 'Purchase History' button and leave a review for the product.",
    },
    {
      question: "What should I do if I forgot my password?",
      answer:
        "Click on the 'Forgot Password' link on the login page, and follow the instructions to reset your password.",
    },
    {
      question: "Do you have a physical store?",
      answer:
        "No, we are an online-only marketplace, which allows us to provide a wider selection of products at competitive prices.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="faq-page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "open" : ""}`}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span className="faq-icon">
                {openIndex === index ? "-" : "+"}
              </span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
