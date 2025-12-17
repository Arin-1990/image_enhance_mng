import React, { useState, PropsWithChildren } from "react";

interface AccordionProps extends PropsWithChildren {
  title: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ border: "1px solid #ccc", marginBottom: "10px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "10px",
          textAlign: "left",
          backgroundColor: "#f0f0f0",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {title}
      </button>
      {isOpen && (
        <div style={{ padding: "10px", borderTop: "1px solid #eee" }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
