import React, { useState, useRef } from "react";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef(null);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h3>{question}</h3>
        <span>{isOpen ? "-" : "+"}</span>
      </div>
      <div
        className={`faq-answer-wrapper${isOpen ? " open" : ""}`}
        style={{
          maxHeight: isOpen ? (answerRef.current ? answerRef.current.scrollHeight : 0) : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="faq-answer" ref={answerRef}>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default FAQItem;
