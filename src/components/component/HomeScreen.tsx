"use client";
import React from "react";
import logo from "../../../public/logo.png";
import Image from "next/image"; // Replace "your-image-library" with the appropriate library name
import Header from "../ui/Header";
import { HeaderComponent } from "./header-component";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import { Button } from "../ui/button";
import { CardSpotlight } from "../ui/card-spotlight";
import Pricing from "../ui/pricing";
import { WobbleCard } from "../ui/wobble-card";
import FooterComponent from "../ui/footer";

export default function HomeScreen() {
  return (
    <div className="flex flex-col justify-center  w-full">
      <HeaderComponent></HeaderComponent>

      <div className="flex flex-col m-16 min-h-96  justify-center my-32">
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-3xl px-4 md:text-5xl lg:text-6xl font-bold   max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
          >
            Save 80% on AI Bills <br />
            <Highlight className="block text-black p-1">
              While Accessing Everything{" "}
            </Highlight>
          </motion.h1>
        </HeroHighlight>

        <p className="text-center text-gray-500 dark:text-gray-300 text-xl mt-6">
          Now one can live without AI now but price shouldn&apos;t be something
          that holds you back.{" "}
        </p>

        <Button className="mt-6 mx-auto p-6 text-lg bg-green-400 dark:bg-yellow-300 text-black hover:bg-green-500 ring-1 ring-gray-400">
          Click this Button🚀
        </Button>
      </div>

      <div className="flex justify-center items-center">
        <CardSpotlight className="h-2/4 w-2/3 md:w-1/3">
          <p className="text-2xl font-bold relative z-20 mt-2 text-white">
            Way to AI debt
          </p>
          <div className="text-neutral-200 mt-4 relative z-20">
            ❌❌❌{" "}
            <ul className="list-none  mt-2">
              <Step title="ChatGPT ~ $20 + taxes" />
              <Step title="Claude ~ $20 + taxes" />
              <Step title="Image generation ~ $20" />
              <Step title="Voice generation ~ 20" />
            </ul>
          </div>
          <p className="text-neutral-300 mt-4 relative z-20 text-sm">
            Total: $100 + taxes... Why paying this much?
          </p>
        </CardSpotlight>
      </div>

      <div className="flex-col items-center justify-center min-h-72 m-16">
        <p className="m-6 text-center">Instead just use this... ↓</p>
        <WobbleCardDemo />
      </div>

      <Pricing />

      <FooterComponent/>
    </div>
  );
}

const Step = ({ title }: { title: string }) => {
  return (
    <li className="flex gap-2 items-start">
      <CheckIcon />
      <p className="text-red-200">{title}</p>
    </li>
  );
};

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-red-500 mt-1 flex-shrink-0"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
};

function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Chat With All Claude, Google, OpenAI Models Simultaneously
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            Ask the same question to different models and see how they respond.
          </p>
        </div>
        <Image
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Chat Induvidually with Each Models.
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
         Chat with each model individually with an Intutive UI.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
           Create React Components on the fly (Beta)
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Just type the name of the component and what it does and boom... get the code for it.
          </p>
        </div>
        <Image
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
