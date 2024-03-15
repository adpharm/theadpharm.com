import { useState } from "react";
import { useInView, InView } from "react-intersection-observer";
import TextSwitcher from "./TextSwitcher";
import AdpharmLogo from "@/images/adpharm-logo@4x.png";

export function IBDScroller() {
  // State to track current active section

  // const [visibleSection, setVisibleSection] = useState(sections[0]);

  const initTitle = "";
  const [scrollTitle, setScrollTitle] = useState(initTitle);

  // callback called when a section is in view

  const setInView = (inView: any, entry: any) => {
    if (inView) {
      setScrollTitle(entry.target.getAttribute("data-title"));
    }
  };

  return (
    <main className="pt-32 relative w-full">
      <div className="fixed z-10 left-0 top-0 w-full h-[30vh] bg-gradient-to-b from-black via-black to-transparent" />
      <div className="fixed z-10 left-0 bottom-0 w-full h-[35vh] bg-gradient-to-t from-black via-black to-transparent" />
      <div className="relative">
        {/* <h1 className="text-5xl text-center">We'd be great together</h1> */}

        <img src={AdpharmLogo.src} alt="Adpharm logo" className="ml-4 relative z-20 h-6 object-contain" />

        {/* <div className="relative md:flex items-start"> */}
        <div className="relative">
          <div className="sticky top-[30vh] shrink-0 md:w-2/5 h-40 inline-flex items-start justify-end">
            <h3 className="shrink-0 w-56 text-3xl text-orange-500">{scrollTitle}</h3>
          </div>

          <div className="flex-1 pl-4 md:pl-8 pr-4 md:pr-40 inline-block text-4xl border-l-0 border-gray-800">
            <div className="h-40"></div>
            {[
              {
                key: "why0",
                scrollTitle: initTitle,
                title: <>We'd be great together.</>,
              },
              {
                key: "why",
                scrollTitle: "Why",
                title: (
                  <>
                    You have transformed IBD,
                    <br />
                    and in doing so,
                    <br />
                    you’ve transformed lives.
                  </>
                ),
              },
              {
                key: "why2",
                scrollTitle: "Why",
                title: <>We want to be part of the solution.</>,
              },
              {
                key: "who",
                scrollTitle: "Who",
                title: <>Through our sister company, Synapse, we have strong relationships with your KOLs.</>,
              },
              {
                key: "what",
                scrollTitle: "What",
                title: <>We deliver creative, compelling, compliant healthcare communications that drive results.</>,
              },
              {
                key: "how",
                scrollTitle: "How",
                title: (
                  <>
                    Our mission is to bring pharma into the future with digital solutions that optimize every
                    communication.
                  </>
                ),
              },
              {
                key: "contact",
                scrollTitle: "Get in touch.",
                title: (
                  <>
                    amy@theadpharm.com
                    <br />
                    <p className="text-sm">
                      <TextSwitcher
                        textToCopy="amy@theadpharm.com"
                        beforeText="(copy)"
                        beforeClassName="hover:underline cursor-pointer"
                        afterText="(copied ✔)"
                        afterClassName="text-green-600"
                      />
                    </p>
                  </>
                ),
                threshold: 0.3,
              },
            ].map((item) => (
              <InView onChange={setInView} threshold={item.threshold || 0.8} key={item.key}>
                {({ ref, inView }) => {
                  return (
                    <div ref={ref} className="min-h-[60vh] leading-normal" data-title={item.scrollTitle}>
                      {item.title}
                    </div>
                  );
                }}
              </InView>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
