import LoginForm from "@/modules/auth/features/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary/60" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          Nebriq
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Every note is a thought captured, every connection a
              discovery made. Return to the simplicity of pure thinking.&rdquo;
            </p>
            <footer className="text-sm">Early Access Preview</footer>
          </blockquote>
        </div>
        <div className="absolute inset-0 z-10">
          <Image
            src="/images/auth-background.jpg"
            alt="Authentication background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
