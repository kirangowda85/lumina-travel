import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-rust hover:bg-rust-light text-sm normal-case",
            footerActionLink: "text-rust hover:text-rust-light",
          },
        }}
      />
    </div>
  );
}
