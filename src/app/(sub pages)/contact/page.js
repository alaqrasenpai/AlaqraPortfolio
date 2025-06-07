import Image from "next/image";
import bg from "../../../../public/background/contact-background.png";
import me from "../../../../public/me.png";

export const metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <>
      <Image
        src={bg}
        alt="Ahmad Alaqra Portfolio website's contact page background image"
        priority
        sizes="100vw"
        className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center opacity-50"
      />

      <article className="relative w-full flex flex-col items-center justify-center py-8 sm:py-0 space-y-8">
        <Image
          width={300}
          height={300}
          alt="my image"
          className="rounded-full border-slate-950 shadow-lg"
          src={me}
        />
        <div className="flex flex-col items-center justify-center space-y-6 w-full sm:w-3/4">
          <h1 className="text-accent font-semibold text-center text-4xl capitalize">
            summon the Developer
          </h1>
          <p className="text-center font-light text-sm xs:text-base">
            Hey! I&apos;m Ahmad Alaqra—a coder, gamer, and anime enthusiast.
            <br />
            When I&apos;m not debugging or developing, I&apos;m probably gaming or deep in an anime series.
            <br />
            I love blending creativity with clean code to build projects that are both fun and functional. Let&apos;s connect!
          </p>

          <div className="text-center space-y-2">
            <p className="text-base sm:text-lg">
              📧 Email:{" "}
              <a
                href="mailto:alaqrahmad@gmail.com"
                className="text-accent underline hover:text-accent/80"
              >
                alaqrahmad@gmail.com
              </a>
            </p>
            <p className="text-base sm:text-lg">
              💬 WhatsApp:{" "}
              <a
                href="https://wa.me/972597060381"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-accent/80"
              >
                +972 59 706 0381
              </a>
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
