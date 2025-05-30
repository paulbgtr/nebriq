"use client";

import Link from "next/link";
import { Separator } from "@/shared/components/ui/separator";
import { Heart, Mail } from "lucide-react";
import { FaMastodon, FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="px-4 sm:px-6 py-8 sm:py-12 mx-auto max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/paulbgtr/nebriq"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-muted-foreground hover:text-foreground"
              >
                <FaGithub className="w-5 h-5" />
              </Link>
              <Link
                href="https://mastodon.social/@nebriq"
                className="transition-colors text-muted-foreground hover:text-foreground"
              >
                <FaMastodon className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:hi@nebriq.com"
                className="transition-colors text-muted-foreground hover:text-foreground"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6 sm:my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 text-center md:text-left">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nebriq. Open Source under the AGPLv3
            license.
          </span>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="w-4 h-4 mx-1 text-primary/80" />
            <span>by</span>
            <Link
              href="https://paulbg.dev"
              className="ml-1 transition-colors text-muted-foreground hover:text-foreground"
            >
              Paul Bogatyr
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
