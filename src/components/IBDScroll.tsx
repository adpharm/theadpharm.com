import { useState } from "react";
import { useInView, InView } from "react-intersection-observer";
import TextSwitcher from "./TextSwitcher";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

export function IBDScroller() {
  // State to track current active section

  // const [visibleSection, setVisibleSection] = useState(sections[0]);

  // const initTitle = "";
  // const [scrollTitle, setScrollTitle] = useState(initTitle);

  // callback called when a section is in view

  function sendContentViewedEvent(id: string) {
    const isFb = window.location.pathname.includes("/fb");
    const isLinkedIn = window.location.pathname.includes("/li");

    if (import.meta.env.DEV) return;

    if (isFb) {
      // @ts-expect-error fb pixel
      fbq("track", "ViewContent", {
        content_name: id,
      });
    }

    if (isLinkedIn) {
      if (id === "why") {
        // @ts-expect-error lintrk
        window.lintrk("track", { conversion_id: 16212242 });
      }
    }
  }

  function sendContactEvent() {
    const isFb = window.location.pathname.includes("/fb");
    const isLinkedIn = window.location.pathname.includes("/li");

    if (import.meta.env.DEV) return;

    if (isFb) {
      // @ts-expect-error fb pixel
      fbq("track", "Contact");
    }

    if (isLinkedIn) {
      // @ts-expect-error lintrk
      window.lintrk("track", { conversion_id: 16212250 });
    }
  }

  const setInView = (inView: any, entry: any) => {
    if (inView) {
      const sectionId = entry.target.getAttribute("id");

      sendContentViewedEvent(sectionId);
    }
  };

  return (
    <main className="pt-28 relative w-full">
      <div className="fixed z-10 left-0 top-0 w-full h-64 sm:h-[30vh] bg-gradient-to-b from-black via-black to-transparent" />
      <div className="fixed z-10 left-0 bottom-0 w-full h-24 sm:h-[30vh] bg-gradient-to-t from-black via-black to-transparent" />
      <div>
        {/* <h1 className="text-5xl text-center">We'd be great together</h1> */}

        <img
          src="/adpharm-logo@4x.png"
          alt="Adpharm logo"
          className="ml-4 relative z-20 h-5 object-contain"
        />
        {/* <h3 className="fixed top-20 sm:top-28 left-4 sm:left-8 z-20 text-2xl sm:text-5xl text-orange-500">
          {scrollTitle}
        </h3> */}

        {/* <div className="relative md:flex items-start"> */}
        <div className="relative">
          {/* <div className="sticky top-64 left-0">
            <h3 className="shrink-0 w-56 text-3xl text-orange-500">{scrollTitle}</h3>
          </div> */}

          <div className="flex-1 px-4 sm:px-8 inline-block text-2xl sm:text-5xl border-l-0 border-gray-800">
            <div className="h-[20vh] sm:h-80"></div>
            {[
              {
                key: "why0", // don't change this key
                scrollTitle: "",
                title: (
                  <>
                    <span className="text-4xl sm:text-5xl">
                      We'd be great together.
                    </span>
                    <p className="mt-4 sm:mt-0 text-gray-500 text-lg">
                      Want to know why?
                    </p>
                    <ScrollButton isFirst nextId="why" />
                  </>
                ),
              },
              {
                key: "why", // don't change this key
                scrollTitle: "Why",
                title: (
                  <>
                    You have transformed IBD, and in doing so, you’ve
                    transformed lives.
                    <br />
                    <br />
                    We want to be part of the solution.
                    <ScrollButton nextId="who" />
                  </>
                ),
              },
              // {
              //   key: "why2", // don't change this key
              //   scrollTitle: "",
              //   title: (
              //     <>
              //       We want to be part of the solution.
              //       <ScrollButton nextId="who" />
              //     </>
              //   ),
              // },
              {
                key: "who",
                scrollTitle: "Who",
                title: (
                  <>
                    Through our sister company, Synapse, we have strong
                    relationships with your KOLs.
                    <ScrollButton nextId="what" />
                  </>
                ),
              },
              {
                key: "what",
                scrollTitle: "What",
                title: (
                  <>
                    We deliver creative, compelling, compliant healthcare
                    communications that drive results.
                    <ScrollButton nextId="how" />
                  </>
                ),
              },
              {
                key: "how",
                scrollTitle: "How",
                title: (
                  <>
                    Our mission is to bring pharma into the future with digital
                    solutions that optimize every communication.
                    <ScrollButton nextId="contact" />
                  </>
                ),
              },
              {
                key: "contact",
                scrollTitle: "Get in touch",
                title: (
                  <>
                    <p className="text-2xl text-gray-500">Email us</p>
                    amy@theadpharm.com
                    <br />
                    <p className="text-sm">
                      <TextSwitcher
                        textToCopy="amy@theadpharm.com"
                        beforeText="(copy)"
                        beforeClassName="hover:underline cursor-pointer"
                        afterText="(copied ✔)"
                        afterClassName="text-green-600"
                        onClickCallback={sendContactEvent}
                      />
                    </p>
                  </>
                ),
                threshold: 0.3,
                className: "min-h-[40vh] scroll-m-[15vh]",
              },
            ].map((item, i) => (
              <InView
                onChange={setInView}
                threshold={item.threshold || 0.8}
                key={item.key}
                triggerOnce
              >
                {({ ref, inView }) => {
                  return (
                    <div
                      ref={ref}
                      id={item.key}
                      className={twMerge(
                        "max-w-4xl pb-40 min-h-[60vh] leading-normal scroll-m-[5vh] sm:scroll-m-[10vh]",
                        item.className ? item.className : ""
                      )}
                      data-title={item.scrollTitle}
                    >
                      <div className="flex items-center">
                        <p className="shrink-0 text-2xl font-medium text-orange-500 leading-loose">
                          {item.scrollTitle}
                        </p>
                        {item.scrollTitle !== "" && (
                          <div className="ml-2 mt-0.5 h-0.5 flex-1 max-w-[3rem] bg-orange-600"></div>
                        )}
                      </div>
                      {item.title}
                    </div>
                  );
                }}
              </InView>
            ))}

            <img
              src="/adpharm-logo@4x.png"
              alt="Adpharm logo"
              className="relative z-20 h-6 object-contain mb-48 sm:mb-32"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function ScrollButton(props: { isFirst?: boolean; nextId: string }) {
  const { isFirst, nextId } = props;

  function handleCtaClick() {
    // scroll to the first section
    const el = document.getElementById(nextId);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }

  return (
    <div className="mt-4 text-sm sm:text-inherit">
      <button
        id={`click-to-go-to-id-${nextId}`}
        type="button"
        className="border border-gray-500 px-3 py-1.5 rounded-lg text-lg inline-flex items-center bg-black/0 hover:bg-black/50 hover:text-gray-400 transition-colors"
        onClick={handleCtaClick}
      >
        <span>{isFirst ? "Scroll down" : "Next"}</span>
        {isFirst ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="ml-2 w-6 h-6 animate-bounce"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="ml-2 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
