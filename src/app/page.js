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
      <div className="w-full h-screen relative">
        <Navigation />
        <div className="w-full h-3/5 xs:h-3/4 sm:h-screen absolute top-1/2 -translate-y-1/2 left-0 z-10">
          <RenderModel>
            <Wizard />
          </RenderModel>
        </div>

        {/* Text below RenderModel, visible only on mobile with top margin */}
        <div className="w-full flex flex-col items-center text-center z-20 sm:hidden mt-24">
          <h1 className="font-bold text-4xl xs:text-5xl text-accent">
            Ahmad Alaqra
          </h1>
          <p className="font-light text-foreground text-base xs:text-lg mt-2 tracking-wide text-opacity-80">
          <strong>Meet the Developer/Gamer/Wizard</strong>
          </p>
        </div>
      </div>



    </main>
  );
}
