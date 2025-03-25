import { VERSION } from "@/shared/config/version";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
};

export const SettingsHeader = ({ title, description }: Props) => {
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <div className="text-xs text-muted-foreground/60 text-right mt-2">
          <p>
            Nebriq {VERSION.number} <br />
            {VERSION.releaseDate}
          </p>
          <Link
            className="hover:text-muted-foreground transition-colors underline"
            href="/changelog"
          >
            View Changelog
          </Link>
        </div>
      </div>
    </>
  );
};
