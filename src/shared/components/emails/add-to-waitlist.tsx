import * as React from "react";

interface Props {
  firstName: string;
}

export const AddToWaitlist = ({ firstName }: Props) => (
  <div
    style={{
      backgroundColor: "hsl(220, 33%, 98%)", // --background
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
          backgroundColor: "hsl(220, 25%, 94%)", // --secondary
          padding: "6px 12px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            color: "hsl(220, 20%, 40%)", // --muted-foreground
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
          color: "hsl(220, 25%, 15%)", // --foreground
          marginBottom: "24px",
          lineHeight: "1.2",
        }}
      >
        Thanks for your interest,{" "}
        <span
          style={{
            color: "hsl(220, 45%, 45%)", // --primary
          }}
        >
          {firstName}!
        </span>
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "hsl(220, 20%, 40%)", // --muted-foreground
          lineHeight: "1.6",
          marginBottom: "32px",
        }}
      >
        We&apos;re currently selecting a limited group of 30 beta testers for
        our first testing phase.
      </p>

      <div
        style={{
          backgroundColor: "hsl(220, 35%, 96%)", // --accent
          padding: "24px",
          borderRadius: "8px",
          marginBottom: "32px",
          border: "1px solid hsl(220, 25%, 90%)", // --border
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "hsl(220, 25%, 15%)", // --foreground
            marginBottom: "16px",
          }}
        >
          What&apos;s Next
        </h2>
        <ul
          style={{
            textAlign: "left",
            color: "hsl(220, 20%, 40%)", // --muted-foreground
            paddingLeft: "24px",
            margin: "0",
            lineHeight: "1.8",
          }}
        >
          <li>We&apos;re reviewing all applications</li>
          <li>
            If selected, you&apos;ll receive an email with access instructions
          </li>
          <li>Selection results will be sent within 7 days</li>
        </ul>
      </div>

      <div
        style={{
          display: "inline-block",
          backgroundColor: "hsl(220, 25%, 94%)", // --secondary
          padding: "6px 12px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            color: "hsl(220, 20%, 40%)", // --muted-foreground
            fontSize: "14px",
          }}
        >
          🎯 Limited Beta Spots Available
        </span>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "hsl(220, 20%, 40%)", // --muted-foreground
          marginBottom: "32px",
        }}
      >
        🛡️ Free during beta • Priority support • Future discounts
      </p>

      <div
        style={{
          borderTop: "1px solid hsl(220, 25%, 90%)", // --border
          paddingTop: "24px",
          marginTop: "32px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "hsl(220, 20%, 40%)", // --muted-foreground
            fontStyle: "italic",
            marginBottom: "12px",
          }}
        >
          This is an automated message. Please do not reply to this email.
        </p>
        <div
          style={{
            fontSize: "12px",
            color: "hsl(220, 20%, 40%)", // --muted-foreground
          }}
        >
          <a
            href="https://nebriq.com"
            style={{
              color: "hsl(220, 45%, 45%)", // --primary
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            nebriq.com
          </a>
        </div>
      </div>
    </div>
  </div>
);
