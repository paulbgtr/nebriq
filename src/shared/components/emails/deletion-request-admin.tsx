import * as React from "react";

interface Props {
  userId: string;
  userEmail: string;
  reason: string;
  details?: string;
}

export const DeletionRequestAdmin = ({
  userId,
  userEmail,
  reason,
  details,
}: Props) => (
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
          ⚠️ Account Deletion Request
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
        New Account Deletion Request
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "hsl(220, 20%, 40%)",
          lineHeight: "1.6",
          marginBottom: "32px",
        }}
      >
        A user has requested to delete their Nebriq account.
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
        <ul
          style={{
            textAlign: "left",
            color: "hsl(220, 20%, 40%)",
            paddingLeft: "24px",
            margin: "0",
            lineHeight: "1.8",
          }}
        >
          <li>User ID: {userId}</li>
          <li>Email: {userEmail}</li>
          <li>Reason: {reason}</li>
          {details && <li>Additional Details: {details}</li>}
        </ul>
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
          🔍 Please review and process this request
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
          This request requires admin attention. Please process within 24 hours.
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
