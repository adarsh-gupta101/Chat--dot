"use client";

import { SidebarComponent } from "@/components/component/SidebarComponent";
import React, { useEffect, useState } from "react";
import { ImageGeneration } from "@/components/image/ImageGeneration";
import Image from "next/image";
import { cn } from "@/libs/utils/utils";
import { ModeToggle } from "@/components/theme-toggle";

function page() {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-gray-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[100vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <SidebarComponent />

      <div className="flex-1 flex flex-col">
        <header className=" flex items-center justify-end py-2 px-4">
          <ModeToggle />
        </header>
        <ImageHistory />
        <ImageGeneration />
      </div>
    </div>
  );
}

export default page;

function ImageHistory() {
  const [images, setImages] = useState<{ image_url: string }[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/ai/image/history");
      const data = await res.json();
      console.log(data);
      setImages(data);
    };
    fetchImages();
  }, []);

  return (
    <div className="flex flex-row overflow-scroll dark:bg-gray-900 bg-gray-100">
      {images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image?.image_url}
              alt="Generated Image"
              width={100}
              height={100}
              onError={(e) => {
                // Handle the error, e.g., display a placeholder or remove the image
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <a
              href={image?.image_url}
              download={`generated-image-${index}.jpg`}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-200"
            >
              Download
            </a>
          </div>
        ))
      ) : (
        <div className="text-center w-full py-4">No images created yet. (Your history will be saved here)</div>
      )}
    </div>
  );
}
