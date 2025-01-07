import * as React from "react";

interface Props {
  firstName: string;
}

export const AddToWaitlist = ({ firstName }: Props) => (
  <div
    style={{
      backgroundColor: "#ffffff",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: "40px 20px",
    }}
  >
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-block",
          backgroundColor: "#f3f4f6",
          padding: "6px 12px",
          borderRadius: "16px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          ⏰ Beta Access Update
        </span>
      </div>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "24px",
          lineHeight: "1.2",
        }}
      >
        Thanks for your interest,{" "}
        <span
          style={{
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {firstName}!
        </span>
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "#4b5563",
          lineHeight: "1.6",
          marginBottom: "32px",
        }}
      >
        We're currently selecting a limited group of 30 beta testers for our
        first testing phase.
      </p>

      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "32px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          What's Next
        </h2>
        <ul
          style={{
            textAlign: "left",
            color: "#4b5563",
            paddingLeft: "24px",
            margin: "0",
            lineHeight: "1.8",
          }}
        >
          <li>We're reviewing all applications</li>
          <li>If selected, you'll receive email with access instructions</li>
          <li>Selection results will be sent within 7 days</li>
        </ul>
      </div>

      <div
        style={{
          display: "inline-block",
          backgroundColor: "#f3f4f6",
          padding: "6px 12px",
          borderRadius: "16px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          🎯 Limited Beta Spots Available
        </span>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "32px",
        }}
      >
        🛡️ Free during beta • Priority support • Future discounts
      </p>

      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "24px",
          marginTop: "32px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            fontStyle: "italic",
            marginBottom: "12px",
          }}
        >
          This is an automated message. Please do not reply to this email.
        </p>
        <div
          style={{
            fontSize: "12px",
            color: "#9ca3af",
          }}
        >
          Nebriq
        </div>
      </div>
    </div>
  </div>
);
