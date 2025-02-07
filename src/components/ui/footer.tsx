import Image from "next/image";
import Link from "next/link";
import React from "react";

function FooterComponent() {
  return (
    <footer className=" w-full flex md:flex-row flex-col justify-between items-center border-t-2 p-2 px-6">
      <div className="">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <p className="font-bold ">Inquira</p>
      </div>

      <div>
        <ul className="flex flex-col md:flex-row items-center">
          <Link href="/">
            <li className="hover:text-gray-500 hover:underline m-1 md:border-r-2 p-1">
              Home
            </li>
          </Link>
          <Link href="/privacy-policy">
            <li className="hover:text-gray-500 hover:underline m-1 md:border-r-2 p-1">
              Privacy Policy
            </li>
          </Link>
          {/* <Link href="/tos">
            <li className="hover:text-gray-500 hover:underline m-1 p-1">
              Terms of Services
            </li>
          </Link> */}
          {/* link to twitter */}
          <Link href="https://x.com/Inquirasolai">
          <li className="hover:text-gray-500 hover:underline m-1 p-1">
          Follow us on X
          </li>
          </Link>

        </ul>
      </div>
    </footer>
  );
}

export default FooterComponent;
