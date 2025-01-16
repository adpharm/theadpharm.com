const StatsCardSvg = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[416px] h-[119px]">
        <svg
          width="100%"
          height="80%"
          viewBox="0 0 416 119"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="ping-gradient">
              <stop offset="0%" stopColor="#22DB72" />
              <stop offset="100%" stopColor="#22DB72" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Path -- I'm using the file called active_users_sparkline3.svg */}
          <path d="M32 87.8652L62.1002 95L95.0478 87.8652L101.963 80.7303L129.622 87.8652L162.977 95L177.213 80.7303L204.873 74.309L226.431 87.8652L253.708 74.309L274.783 18L288.692 59.4809L309.003 87.8652L352.934 80.7303L381 87.8652" stroke="#22DB72" />

          {/* <path
            d="M1 93.151L36.7063 102L75.7902 93.151L83.993 84.3019L116.804 93.151L156.371 102L173.259 84.3019L206.07 76.3378L231.643 93.151L264 76.3378L289.063 2L305.5 57.9471L329.594 93.151L381.706 84.3019L415 93.151"
            stroke="#22DB72"
            className='py-4'
          /> */}

          {/* Static dot */}
          <circle
            cx="274.783"
            cy="18" //Move it down a little bit so its not hitting the top edge
            r="4"
            fill="#22DB72"
          />

          {/* SVG ping animation */}
          <circle
            cx="274.783"
            cy="18" //Move it down a little bit so its not hitting the top edge
            r="4"
            fill="url(#ping-gradient)"
          >
            <animate
              attributeName="r"
              from="4"
              to="32"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
};

export default StatsCardSvg;