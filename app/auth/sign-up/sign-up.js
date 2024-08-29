// app/sign-up/page.js
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div>
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
};

export default SignUpPage;
