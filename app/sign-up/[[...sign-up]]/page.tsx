import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <SignUp
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
