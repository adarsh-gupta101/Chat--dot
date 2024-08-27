import { HeaderComponent } from "@/components/component/header-component";
import FooterComponent from "@/components/ui/footer";
import React from "react";

function PrivacyPolicy() {
  return (
    <div>
      <HeaderComponent />

      <div className="flex justify-center items-center flex-col mt-16">
        <div className="w-full py-6 "> {/* Add background color */}
          <div className="container px-4 md:px-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl font-bold text-center"> {/* Increase heading size and center align */}
                Privacy Policy
              </h1>
              <p className="text-center"> {/* Center align last updated text */}
                Last updated: March 14, 2024
                <br />
                <br />
              </p>
            </div>
          </div>
        </div>
        <div className="w-full py-6">
          <div className="container px-4 md:px-6">
            <div className="prose prose-lg prose-gray max-w-none dark:prose-invert"> {/* Increase font size */}
              <h2>Interpretation and Definitions</h2>
              <p>
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions. The following
                definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </p>
              <h3>For the purposes of this Privacy Policy:</h3>
              <ul>
                <li>
                  <strong>You</strong> means the individual accessing or using
                  the Service, or the company, or other legal entity on behalf
                  of which such individual is accessing or using the Service, as
                  applicable.
                </li>
                <li>
                  <strong>Company</strong> (referred to as either &quot;the Company&quot;,
                  &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to
                  chat.adarsh-gupta.in.
                </li>
                <li>
                  <strong>Affiliate</strong> means an entity that controls, is
                  controlled by or is under common control with a party, where
                  &quot;control&quot; means ownership of 50% or more of the shares, equity
                  interest or other securities entitled to vote for election of
                  directors or other managing authority.
                </li>
              </ul>
              <h2>Collecting and Using Your Personal Data</h2>
              <h3>Types of Data Collected</h3>
              <h4>Personal Data</h4>
              <p>
                While using Our Service, We may ask You to provide Us with
                certain personally identifiable information that can be used to
                contact or identify You. Personally identifiable information may
                include, but is not limited to:
              </p>
              <ul>
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
                <li>Address, State, Province, ZIP/Postal code, City</li>
                <li>Usage Data</li>
              </ul>
              <h4>Usage Data</h4>
              <p>
                Usage Data is collected automatically when using the Service.
              </p>
              <h3>Use of Your Personal Data</h3>
              <p>
                The Company may use Personal Data for the following purposes:
              </p>
              <ul>
                <li>
                  To provide and maintain our Service, including to monitor the
                  usage of our Service.
                </li>
                <li>
                  To manage Your Account: to manage Your registration as a user
                  of the Service. The Personal Data You provide can give You
                  access to different functionalities of the Service that are
                  available to You as a registered user.
                </li>
                <li>
                  For the performance of a contract: the development, compliance
                  and undertaking of the purchase contract for the products,
                  items or services You have purchased or of any other contract
                  with Us through the Service.
                </li>
              </ul>
              <h2 className="text-2xl font-bold mt-8">Retention of Your Personal Data</h2> {/* Add more spacing and increase heading size */}
              <p>
                The Company will retain Your Personal Data only for as long as
                is necessary for the purposes set out in this Privacy Policy. We
                will retain and use Your Personal Data to the extent necessary
                to comply with our legal obligations (for example, if we are
                required to retain your data to comply with applicable laws),
                resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p />
            </div>
          </div>
        </div>
      </div>
      <FooterComponent/>
    </div>
  );
}

export default PrivacyPolicy;
