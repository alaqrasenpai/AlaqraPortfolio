import AboutDetails from "@/components/about";

export const metadata = {
  title: "About",
};

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-24 pb-8 space-y-4 text-center">
        <h1 className="text-5xl xs:text-6xl sm:text-7xl font-bold text-accent drop-shadow-lg">
          About Me
        </h1>
        <p className="text-sm xs:text-base md:text-lg font-light text-foreground/80 max-w-2xl px-4">
          Discover the story, skills, and passion behind the code.
        </p>
      </div>

      <div className="px-4 md:px-8 w-full">
        <AboutDetails />
      </div>
    </>
  );
}
