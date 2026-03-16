import Image from "next/image";
import me from "../../public/me2.png";
import Navigation from "@/components/navigation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <div className="w-full h-screen relative">
        {/* Place Navigation in its own fixed container */}
        <div className="fixed top-0 left-0 w-full z-50">
          <Navigation />
        </div>

        {/* Main content wrapper */}
        <div className="relative w-full h-full z-10 flex flex-col items-center justify-center pt-20">
          <div className="flex flex-col items-center text-center">
            {/* Image instead of 3D model */}
            <div className="relative w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 mb-8">
              <Image
                src={me}
                alt="Ahmad Alaqra"
                fill
                className="rounded-full border-4 border-accent shadow-[0_0_20px_rgba(255,255,255,0.2)] object-cover"
              />
            </div>
            
            <h1 className="font-bold text-5xl xs:text-6xl sm:text-7xl text-accent drop-shadow-lg">
              Ahmad Alaqra
            </h1>
            <p className="font-light text-foreground text-lg xs:text-xl sm:text-2xl mt-4 tracking-wider text-opacity-90">
              <strong>Developer | Gamer | Anime Enthusiast</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
