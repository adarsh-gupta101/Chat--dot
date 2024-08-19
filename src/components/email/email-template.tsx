
interface EmailTemplateProps {
    firstName: string;
  }
  
  export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
  }) => (
    <div className="flex flex-col justify-evenly">
      <h1>Welcome, {firstName}!</h1>
  
      <p>
        Thanks for signing up for building cool things using Chat-dot. We&apos;re
        excited to have you on board.
      </p>
  
      <p>
        If you have any questions, feel free to reply to this mail{" "}
      </p>
    </div>
  );