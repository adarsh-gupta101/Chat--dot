interface EmailTemplateProps {
    firstName: string;
  }
  
  export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
  }) => (
    <div className="flex flex-col justify-evenly">
      <h1>You bought the Next.js boilerplate {firstName}!</h1>
  
      <p>
        Thanks for signing up for building cool things using Ship Your Saas.
        We&apos;re excited to have you on board.
      </p>
  
      <p>
        It&apos;s time to build something that 1000s of people are waiting for{" "}
      </p>
  
      <p>Here are some resources to help you get started</p>
  
      <ul>
        <li>
          <a href="www.ship-your-saas.com" target="_blank">
            Documentation
          </a>
        </li>
      </ul>
    </div>
  );