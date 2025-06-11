"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Separator } from "@/shared/components/ui/separator";
import { Heart, Mail, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

// Memoized footer section component
const FooterSection = memo(
  ({
    title,
    children,
    delay = 0,
  }: {
    title: string;
    children: React.ReactNode;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="space-y-4"
    >
      <h3 className="font-semibold text-foreground">{title}</h3>
      {children}
    </motion.div>
  ),
);

FooterSection.displayName = "FooterSection";

// Memoized footer link component
const FooterLink = memo(
  ({
    href,
    children,
    external = false,
  }: {
    href: string;
    children: React.ReactNode;
    external?: boolean;
  }) => (
    <Link
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
    >
      {children}
      {external && (
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </Link>
  ),
);

FooterLink.displayName = "FooterLink";

// Memoized social link component
const SocialLink = memo(
  ({
    href,
    icon: Icon,
    label,
    external = true,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    external?: boolean;
  }) => (
    <Link
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-all duration-200 hover:border-primary/50 hover:scale-105"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
    </Link>
  ),
);

SocialLink.displayName = "SocialLink";

export const Footer = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] },
  };

  // Memoize the current year to prevent unnecessary recalculations
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const productLinks = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Documentation" },
    { href: "/changelog", label: "Changelog" },
  ];

  const resourceLinks = [
    {
      href: "https://github.com/paulbgtr/nebriq",
      label: "GitHub",
      external: true,
    },
    { href: "/blog", label: "Blog" },
    { href: "/help", label: "Help Center" },
    { href: "/community", label: "Community" },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  const socialLinks = [
    {
      href: "https://github.com/paulbgtr/nebriq",
      icon: FaGithub,
      label: "GitHub",
    },
    {
      href: "mailto:hi@nebriq.com",
      icon: Mail,
      label: "Email",
      external: false,
    },
  ];

  return (
    <footer className="relative border-t bg-background">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/5 to-transparent" />

      <div className="relative z-10 px-4 mx-auto max-w-6xl">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="py-16"
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <FooterSection title="Product" delay={0.1}>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterSection>

            {/* Resources */}
            <FooterSection title="Resources" delay={0.2}>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} external={link.external}>
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </FooterSection>

            {/* Legal */}
            <FooterSection title="Legal" delay={0.3}>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterSection>

            {/* Connect */}
            <FooterSection title="Connect" delay={0.4}>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <SocialLink
                      key={social.href}
                      href={social.href}
                      icon={social.icon}
                      label={social.label}
                      external={social.external}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join our community of writers and developers building the
                  future of note-taking.
                </p>
              </div>
            </FooterSection>
          </div>

          {/* Separator */}
          <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
            <Separator className="my-8" />
          </motion.div>

          {/* Bottom Footer */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <span>
                © {currentYear} Nebriq. Open Source under the{" "}
                <Link
                  href="https://github.com/paulbgtr/nebriq/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  AGPLv3
                </Link>{" "}
                license.
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Built with</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Heart className="w-4 h-4 mx-1 text-primary" />
              </motion.div>
              <span>by</span>
              <Link
                href="https://paulbg.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
              >
                Paul Bogatyr
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
