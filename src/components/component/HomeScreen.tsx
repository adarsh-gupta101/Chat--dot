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
import Link from "next/link";

export default function HomeScreen() {
  return (
    <div className="flex flex-col justify-center w-full">
      <HeaderComponent />

      {/* Hero Section */}
      <div className="flex flex-col m-4 md:m-16 min-h-screen justify-center my-8 md:my-8 text-balance">
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
            className="text-3xl px-4 md:text-5xl lg:text-7xl font-bold max-w-5xl leading-tight md:leading-tight lg:leading-tight text-center mx-auto"
          >
            Unlock AI&apos;s Full Potential <br />
            <Highlight className="block text-black p-2 mt-2">
              At 80% Less Cost
            </Highlight>
          </motion.h1>
        </HeroHighlight>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center text-gray-600 dark:text-gray-300 text-lg md:text-xl mt-6 md:mt-8 max-w-2xl mx-auto"
        >
          Access cutting-edge AI models without breaking the bank. Our platform
          brings you the power of ChatGPT, Claude, and more at a fraction of the
          cost.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8 md:mt-12"
        >
          <Button className="px-6 py-3 text-lg bg-green-500 dark:bg-yellow-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-yellow-500 ring-2 ring-green-600 dark:ring-yellow-500">
            <Link href="/pricing">Start Saving Now 🚀</Link>
          </Button>
          <Button variant="outline" className="px-6 py-3 text-lg">
            <Link href="/dashboard">Try Now</Link>
          </Button>
        </motion.div>
      </div>

      {/* product video */}
      <div className="flex justify-center items-center my-8 md:my-8">
        {/* <video src="/video.mp4" autoPlay loop muted controls className="w-3/4 max-w-7xl rounded-lg shadow-lg" /> */}
        <video  autoPlay loop muted controls className="w-3/4 max-w-7xl rounded-lg shadow-lg" >
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
      </div>

      {/* Cost Comparison Section */}
      <div
        className="flex justify-center items-center my-16 md:my-32"
        id="features"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full px-4">
          <CardSpotlight className="h-full w-full">
            <h2 className="text-2xl font-bold relative z-20 mt-2 text-white">
              The AI Debt Trap
            </h2>
            <div className="text-neutral-200 mt-4 relative z-20">
              <ul className="list-none mt-2 space-y-2">
                <Step title="ChatGPT ~ $20 + taxes" />
                <Step title="Claude ~ $20 + taxes" />
                <Step title="Image generation ~ $20" />
                <Step title="Voice generation ~ $20" />
              </ul>
            </div>
            <p className="text-neutral-300 mt-4 relative z-20 text-lg font-semibold">
              Total: $80+ per month... Is it worth it?
            </p>
          </CardSpotlight>

          <CardSpotlight className="h-full w-full bg-green-700">
            <h2 className="text-2xl font-bold relative z-20 mt-2 text-white">
              Our Solution
            </h2>
            <div className="text-neutral-200 mt-4 relative z-20">
              <ul className="list-none mt-2 space-y-2">
                <Step title="All AI models in one place" />
                <Step title="Fraction of the cost" />
                <Step title="No feature limitations" />
                <Step title="Seamless integration" />
              </ul>
            </div>
            <p className="text-neutral-300 mt-4 relative z-20 text-lg font-semibold">
              Save up to 80% on your AI expenses!
            </p>
          </CardSpotlight>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="flex-col items-center justify-center min-h-screen m-2 md:m-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features at Your Fingertips
        </h2>
        <WobbleCardDemo />
      </div>

      <Pricing />

      <FooterComponent />
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
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[400px]"
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
          src="/sc1.png"
          width={600}
          height={600}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[10%] grayscale filter -bottom-5 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Chat Induvidually with Each Models.
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Chat with each model individually with an Intutive UI.
        </p>
        {/* <Image
          src="/sc2.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-20 object-contain rounded"
        /> */}
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Create React Components on the fly (Beta)
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Just type the name of the component and what it does and boom... get
            the code for it.
          </p>
        </div>
        <Image
          src="/sc3.png"
          width={600}
          height={600}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[10%] lg:-right-[10%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
