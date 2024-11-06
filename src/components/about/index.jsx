import React from "react";
import ItemLayout from "./ItemLayout";
import Link from "next/link";

const AboutDetails = () => {
  return (
    <section className="py-20 w-full">
      <div className="grid grid-cols-12 gap-4 xs:gap-6  md:gap-8 w-full">
        <ItemLayout
          className={
            " col-span-full lg:col-span-8 row-span-2 flex-col items-start"
          }
        >
          <h2 className="  text-xl md:text-2xl text-left w-full capitalize">
            👋 Hi, I’m Ahmad Alaqra (aka Alaqra)

          </h2>

        </ItemLayout>

        <ItemLayout
          className={" col-span-full xs:col-span-6 lg:col-span-4 text-accent"}
        >
          <p className="font-semibold w-full text-left text-2xl sm:text-5xl">
            2+ <sub className="font-semibold text-base">clients</sub>
          </p>
        </ItemLayout>

        <ItemLayout
          className={"col-span-full xs:col-span-6 lg:col-span-4 text-accent"}
        >
          <p className="font-semibold w-full text-left text-2xl sm:text-5xl">
            4+{" "}
            <sub className="font-semibold text-base">years of experience</sub>
          </p>
        </ItemLayout>

        <ItemLayout
          className={"col-span-full sm:col-span-6 md:col-span-4 !p-0"}
        >
          <img
            className="w-full h-auto"
            src="https://spotify-recently-played-readme.vercel.app/api?user=31vtmejuosnotsq3kqmdxnnv6o3a&count=3"
            alt="alaqrasenpai"
            loading="lazy"
          />
        </ItemLayout>

        <ItemLayout className={"col-span-full md:col-span-8 !p-0"}>
        <p className="font-light  text-xs sm:text-sm md:text-base   ">
            My name is Ahmad Alaqra and I'm a Programmer from Palestine
            <br></br>
            👀 I’m passionate about programming, technology, and solving real-world problems through code.
            <br></br>

            💻 I specialize in web and mobile development using Vue.js, Angular, Flutter, Apex Oracle, and more.
            <br></br>

            🌍 Learn more about me on my personal website alaqra.dev
            <br></br>



          </p>
        </ItemLayout>

        <ItemLayout className={"col-span-full"}>
          <img
            className="w-full h-auto"
            src={`https://skillicons.dev/icons?i=unity,flutter,nuxt,bootstrap,css,git,github,html,js,mongodb,mysql,nextjs,nodejs,npm,react,redux,angular,sass,tailwind,vscode,net`}
            alt="alaqrasenpai"
            loading="lazy"
          />
        </ItemLayout>




      </div>
    </section>
  );
};

export default AboutDetails;
