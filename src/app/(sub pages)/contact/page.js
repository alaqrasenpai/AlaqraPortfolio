import Image from "next/image";
import me from "../../../../public/me.png";
import { Github, Linkedin, Instagram, Twitter, Mail, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <>

      <article className="relative w-full min-h-screen flex items-center justify-center py-16 px-4 sm:px-8 mt-12 lg:mt-0">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Image and Bio */}
          <div className="flex flex-col items-center lg:items-start space-y-8 animate-fade-in-up">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-red-900 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <Image
                width={280}
                height={280}
                alt="Ahmad Alaqra"
                className="relative rounded-full border-4 border-slate-950 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                src={me}
              />
            </div>
            
            <div className="text-center lg:text-left space-y-4">
              <h1 className="text-accent font-bold text-4xl sm:text-5xl lg:text-6xl capitalize tracking-tight drop-shadow-lg">
                Let&apos;s Connect
              </h1>
              <p className="font-light text-foreground/90 text-base sm:text-lg leading-relaxed max-w-lg">
                Hey, I&apos;m <strong>Ahmad Alaqra</strong>! A passionate Software Developer, avid gamer, and anime enthusiast.
                <br /><br />
                Whether you have a project in mind, want to discuss code, or just want to chat about the latest anime season—my inbox is always open!
              </p>
            </div>
          </div>

          {/* Right Column: Contact Methods */}
          <div className="flex flex-col space-y-6 w-full max-w-md mx-auto lg:mx-0 p-8 rounded-3xl bg-background/30 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
            <h2 className="text-2xl font-semibold text-accent mb-2 text-center lg:text-left">
              Get In Touch
            </h2>

            {/* Email Card */}
            <a
              href="mailto:alaqrahmad@gmail.com"
              className="group flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent transition-all duration-300"
            >
              <div className="p-3 rounded-full bg-accent/20 text-accent group-hover:bg-accent group-hover:text-background transition-colors">
                <Mail className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="ml-4 flex flex-col min-w-0 flex-1">
                <span className="text-sm font-light text-foreground/70">Email Me</span>
                <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-accent transition-colors truncate">
                  alaqrahmad@gmail.com
                </span>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href="https://wa.me/972597060381"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#25D366] transition-all duration-300"
            >
              <div className="p-3 rounded-full bg-[#25D366]/20 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="ml-4 flex flex-col min-w-0 flex-1">
                <span className="text-sm font-light text-foreground/70">Chat on WhatsApp</span>
                <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-[#25D366] transition-colors truncate">
                  +972 59 706 0381
                </span>
              </div>
            </a>

            <div className="w-full h-px bg-white/10 my-4"></div>

            {/* Social Links */}
            <div className="flex flex-col space-y-4">
              <span className="text-sm font-light text-foreground/70 text-center lg:text-left">Follow me on</span>
              <div className="flex items-center justify-center lg:justify-start space-x-5">
                <a href="https://github.com/alaqrasenpai" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-accent hover:text-background border border-white/10 hover:border-accent transition-all duration-300 group" aria-label="GitHub">
                  <Github className="w-6 h-6 transform group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </a>
                <a href="https://www.linkedin.com/in/ahmad-alaqra/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-[#0A66C2] hover:text-white border border-white/10 hover:border-[#0A66C2] transition-all duration-300 group" aria-label="LinkedIn">
                  <Linkedin className="w-6 h-6 transform group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </a>
                <a href="https://www.instagram.com/ahmadalaqra/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white border border-white/10 hover:border-[#e6683c] transition-all duration-300 group" aria-label="Instagram">
                  <Instagram className="w-6 h-6 transform group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </a>
                <a href="https://x.com/ahmedalaqra" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-black/50 hover:text-white border border-white/10 hover:border-white/30 transition-all duration-300 group" aria-label="X (Twitter)">
                  <Twitter className="w-6 h-6 transform group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </article>
    </>
  );
}
