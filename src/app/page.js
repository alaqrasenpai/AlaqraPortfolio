import Image from "next/image";
import bg from "../../public/background/home-background.png";
import RenderModel from "@/components/RenderModel";
// import Wizard from "@/components/models/Wizard";
import Navigation from "@/components/navigation";

import dynamic from "next/dynamic";
const Wizard = dynamic(() => import("@/components/models/Wizard"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <Image
        priority
        sizes="100vw"
        src={bg}
        alt="background-image"
        fill
        className="-z-50 w-full h-full object-cover object-center opacity-50"
      />
      <div className="w-full h-screen ">
      <Navigation className="z-12" />
      <div className="w-full h-full">
          <RenderModel>
            <Wizard />
          </RenderModel>
        </div>

        {/* <div className="w-full flex flex-col items-center text-center sm:hidden mt-24">
          <h1 className="font-bold text-4xl xs:text-5xl text-accent">
            Ahmad Alaqra
          </h1>
          <p className="font-light text-foreground text-base xs:text-lg mt-2 tracking-wide text-opacity-80">
            <strong>Meet the Developer/Gamer/Wizard</strong>
          </p>
        </div> */}
      </div>



    </main>
  );
}
