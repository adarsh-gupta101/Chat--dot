"use client"
import { HeaderComponent } from "@/components/component/header-component";
import React, { useEffect } from "react";
import { ChatHistory } from "@/components/component/chat-history";


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Pricing from "@/components/ui/pricing";
import FooterComponent from "@/components/ui/footer";

function Page() {
  const [credits, setCredits] = React.useState(0);
  useEffect(() => {
    fetch("/api/user/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.credits);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="h-screen ">
      <HeaderComponent />
      <CreditComponent credits={credits}/>

      <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0 p-4 text-center mb-16">
        Running out of credits? Buy More Credits ↓{" "}
      </h2>

      <Pricing/>
       <section className="bg-card rounded-lg shadow min-h-[70vh]">
          <ChatHistory />
        </section>


<div className="mt-auto">

<FooterComponent/>
</div>


    </div>
  );
}

export default Page;

 function CreditComponent({credits}:{credits:number}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Credits Remaining</CardDescription>
        <CardTitle className="text-4xl">{credits?credits:0}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground"></div>
      </CardContent>
     
    </Card>
  )
}