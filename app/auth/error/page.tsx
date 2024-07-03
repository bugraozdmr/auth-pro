import { CardWrapper } from "@/components/auth/card-wrapper";
import { ErrorCard } from "@/components/auth/error-card";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const AuthErrorPage = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong !"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default AuthErrorPage;
