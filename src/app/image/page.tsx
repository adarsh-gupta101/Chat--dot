"use client";

import { SidebarComponent } from "@/components/component/SidebarComponent";
import React, { useEffect, useState } from "react";
import { ImageGeneration } from "@/components/image/ImageGeneration";
import Image from "next/image";

function page() {
  return (
    <div className="flex h-screen">
      <SidebarComponent />
      <div className="flex-1 flex flex-col">
        <ImageHistory />
        <ImageGeneration />
      </div>
      
    </div>
  );
}

export default page;

function ImageHistory() {
  const [images, setImages] = useState<string[]>([]);
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
    <div className="flex flex-row overflow-scroll">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <Image
            src={image?.image_url}
            alt="Generated Image"
            width={100}
            height={100}
          />
          <a
            href={image?.image_url}
            download
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
