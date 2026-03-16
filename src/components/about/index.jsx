import React from "react";
import ItemLayout from "./ItemLayout";

const AboutDetails = () => {
  return (
    <section className="py-10 lg:py-20 w-full">
      <div className="grid grid-cols-12 gap-4 xs:gap-6 md:gap-8 w-full">
        
        {/* Intro Section */}
        <ItemLayout
          className="col-span-full lg:col-span-8 row-span-2 flex-col items-start justify-center"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-accent capitalize drop-shadow-sm mb-2">
            👋 Hi, I&apos;m Ahmad Alaqra!
          </h2>
          <p className="col-span-full font-light text-foreground/90 text-sm sm:text-base md:text-lg leading-relaxed">
            I&apos;m a passionate Software Developer from Palestine. My journey began with a curiosity about how games and websites are built, 
            which quickly grew into a full-blown career. 
            <br /><br />
            👀 <strong>What I love:</strong> I am deeply passionate about programming, learning new technologies, gaming, and anime. 
            When I am not hunting bugs in my code, I am probably playing an RPG or watching a new anime season.
          </p>
        </ItemLayout>

        {/* Stats 1 */}
        <ItemLayout
          className="col-span-6 lg:col-span-4 text-accent flex-col justify-center items-center"
        >
          <p className="font-bold w-full text-center text-3xl sm:text-4xl md:text-5xl drop-shadow-md">
            4+
          </p>
          <p className="font-medium text-sm sm:text-base text-foreground/80 mt-2 text-center">
            Years of Experience
          </p>
        </ItemLayout>

        {/* Stats 2 */}
        <ItemLayout
          className="col-span-6 lg:col-span-4 text-accent flex-col justify-center items-center"
        >
          <p className="font-bold w-full text-center text-3xl sm:text-4xl md:text-5xl drop-shadow-md">
            20+
          </p>
          <p className="font-medium text-sm sm:text-base text-foreground/80 mt-2 text-center">
            Projects Completed
          </p>
        </ItemLayout>

        {/* Spotify Stats */}
        <ItemLayout className="col-span-full md:col-span-4 !p-0 overflow-hidden group flex items-center justify-center bg-transparent">
          <img
            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
            src="https://spotify-recently-played-readme.vercel.app/api?user=31vtmejuosnotsq3kqmdxnnv6o3a&count=3"
            alt="Ahmad Alaqra Spotify"
            loading="lazy"
          />
        </ItemLayout>

        {/* Extended Bio */}
        <ItemLayout className="col-span-full md:col-span-8 flex-col items-start justify-center">
            <h3 className="text-xl md:text-2xl font-bold text-accent mb-2">My Expertise</h3>
            <p className="font-light text-foreground/90 text-sm sm:text-base md:text-lg leading-relaxed">
              💻 <strong>What I do:</strong> I specialize in web and mobile development, building robust systems using Vue.js, Angular, React, Flutter, and Next.js. I love blending creativity with logic to create seamless user experiences.
              <br /><br />
              🌍 Learning never stops! I continuously improve my skills and deliver scalable solutions tailored to user needs.
            </p>
        </ItemLayout>

        {/* Tech Stack */}
        <ItemLayout className="col-span-full flex-col p-6 sm:p-10">
          <h3 className="text-xl md:text-2xl font-bold text-accent w-full text-center mb-6">
            Languages, Frameworks & Tech Stack
          </h3>
          <div className="w-full flex justify-center items-center">
            <img
              className="w-full h-auto max-w-3xl drop-shadow-xl hover:scale-105 transition-transform duration-500"
              src="https://skillicons.dev/icons?i=react,nextjs,vue,angular,flutter,js,ts,nodejs,html,css,tailwind,sass,bootstrap,mysql,mongodb,git,github,vscode,unity&perline=8"
              alt="Ahmad Alaqra Tech Stack"
              loading="lazy"
            />
          </div>
        </ItemLayout>

      </div>
    </section>
  );
};

export default AboutDetails;
