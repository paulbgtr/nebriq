import * as React from "react";

interface Props {
  reason: string;
}

export const DeletionRequestUser = ({ reason }: Props) => (
  <div
    style={{
      backgroundColor: "hsl(220, 33%, 98%)",
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
          backgroundColor: "hsl(220, 25%, 94%)",
          padding: "6px 12px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            color: "hsl(220, 20%, 40%)",
            fontSize: "14px",
          }}
        >
          📝 Request Confirmation
        </span>
      </div>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "hsl(220, 25%, 15%)",
          marginBottom: "24px",
          lineHeight: "1.2",
        }}
      >
        Account Deletion Request Received
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "hsl(220, 20%, 40%)",
          lineHeight: "1.6",
          marginBottom: "32px",
        }}
      >
        We have received your request to delete your Nebriq account.
      </p>

      <div
        style={{
          backgroundColor: "hsl(220, 35%, 96%)",
          padding: "24px",
          borderRadius: "8px",
          marginBottom: "32px",
          border: "1px solid hsl(220, 25%, 90%)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "hsl(220, 25%, 15%)",
            marginBottom: "16px",
          }}
        >
          Request Details
        </h2>
        <p
          style={{
            textAlign: "left",
            color: "hsl(220, 20%, 40%)",
            margin: "0",
            lineHeight: "1.8",
          }}
        >
          Reason provided: {reason}
        </p>
      </div>

      <div
        style={{
          display: "inline-block",
          backgroundColor: "hsl(220, 25%, 94%)",
          padding: "6px 12px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            color: "hsl(220, 20%, 40%)",
            fontSize: "14px",
          }}
        >
          ⏳ Processing within 24 hours
        </span>
      </div>

      <div
        style={{
          borderTop: "1px solid hsl(220, 25%, 90%)",
          paddingTop: "24px",
          marginTop: "32px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "hsl(220, 20%, 40%)",
            fontStyle: "italic",
            marginBottom: "12px",
          }}
        >
          If you have any questions or wish to cancel this request, please
          contact our support team.
        </p>
        <div
          style={{
            fontSize: "12px",
            color: "hsl(220, 20%, 40%)",
          }}
        >
          <a
            href="https://nebriq.com"
            style={{
              color: "hsl(220, 45%, 45%)",
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
