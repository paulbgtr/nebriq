import * as React from "react";

interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordReset: React.FC<PasswordResetEmailProps> = ({
  resetLink,
}) => {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        padding: "40px 0",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        color: "hsl(var(--foreground))",
      }}
    >
      <table
        style={{
          width: "100%",
          margin: "0 auto",
          borderSpacing: "0",
          borderCollapse: "collapse",
        }}
      >
        <tr>
          <td>
            <table
              style={{
                width: "100%",
                textAlign: "center",
                borderSpacing: "0",
                borderCollapse: "collapse",
                margin: "40px 0",
              }}
            >
              <tr>
                <td>
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      margin: "0 0 10px",
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    Reset Your Password
                  </h1>
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.5",
                      margin: "0",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    We received a request to reset your password.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table
              style={{
                width: "100%",
                borderSpacing: "0",
                borderCollapse: "collapse",
                margin: "40px 0",
              }}
            >
              <tr>
                <td>
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.5",
                      margin: "0 0 20px",
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    Click the button below to reset your password. If you did
                    not request a password reset, please ignore this email.
                  </p>
                  <div style={{ textAlign: "center", margin: "30px 0" }}>
                    <a
                      href={resetLink}
                      style={{
                        backgroundColor: "hsl(var(--primary))",
                        borderRadius: "6px",
                        color: "hsl(var(--primary-foreground))",
                        display: "inline-block",
                        fontSize: "16px",
                        fontWeight: "bold",
                        letterSpacing: "0.3px",
                        padding: "12px 24px",
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                      target="_blank"
                    >
                      Reset Password
                    </a>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      margin: "20px 0 0",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    If the button doesn&apos;t work, you can also copy and paste
                    the following link into your browser:
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      margin: "10px 0 0",
                      color: "hsl(var(--primary))",
                      wordBreak: "break-all",
                    }}
                  >
                    {resetLink}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      margin: "30px 0 0",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    This password reset link will expire in 24 hours for
                    security reasons.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table
              style={{
                width: "100%",
                textAlign: "center",
                borderSpacing: "0",
                borderCollapse: "collapse",
                margin: "40px 0 20px",
              }}
            >
              <tr>
                <td>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      margin: "0",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    If you have any questions, please contact{" "}
                    <a
                      href="mailto:support@nebriq.com"
                      style={{
                        color: "hsl(var(--primary))",
                        textDecoration: "none",
                      }}
                    >
                      support@nebriq.com
                    </a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  );
};
