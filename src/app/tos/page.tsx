import { HeaderComponent } from "@/components/component/header-component";
import React from "react";

function Tos() {
  return (
    <div>
      <HeaderComponent />

      <div className="flex justify-center items-center flex-col mt-16 w-3/4 m-auto">
        <div className="w-full py-6">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p>
                Last updated: March 14, 2024
                <br />
                <br />
              </p>
            </div>
          </div>
        </div>
        <div className="w-full py-6">
          <div className="container px-4 md:px-6">
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By using our platform, you agree to be bound by these terms of
                service. If you do not agree with any part of these terms,
                please do not use our services.
              </p>
              <h2>2. User Accounts</h2>
              <p>
                You must be at least 18 years of age to use our services. You
                must provide accurate information when creating an account with
                us.
              </p>
              <h2>3. Intellectual Property</h2>
              <p>
                All content and intellectual property on our platform is owned
                by us or our licensors. You may not modify, copy, distribute,
                transmit, display, reproduce or create derivative works from the
                content.
              </p>

              <h2>4. Limitation of Liability</h2>
              <p>
                We will not be liable for any indirect, special, incidental or
                consequential damages arising out of or related to your use of
                our services.
              </p>

              <h2>5.  Governing Law</h2>
              <p>
              These terms of service shall be governed by and construed in accordance with the laws of [Jurisdiction], without giving effect to any principles of conflicts of law.


              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tos;
