import { twMerge } from "tailwind-merge";

const iconDefs = {
  omnichannel: (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M24.4001 6.4C24.4001 4.96783 23.8312 3.59432 22.8185 2.58162C21.8058 1.56893 20.4323 1 19.0001 1C17.5679 1 16.1944 1.56893 15.1817 2.58162C14.169 3.59432 13.6001 4.96783 13.6001 6.4V19C13.6001 20.4322 14.169 21.8057 15.1817 22.8184C16.1944 23.8311 17.5679 24.4 19.0001 24.4C20.4323 24.4 21.8058 23.8311 22.8185 22.8184C23.8312 21.8057 24.4001 20.4322 24.4001 19V6.4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.728 13.9087C32.7271 12.8932 33.2844 11.5241 33.2786 10.0996C33.2728 8.67502 32.7044 7.31048 31.6971 6.30317C30.6898 5.29586 29.3252 4.7274 27.9007 4.72159C26.4761 4.71579 25.107 5.27313 24.0915 6.2722L15.1815 15.1822C14.6801 15.6837 14.2824 16.279 14.011 16.9342C13.7397 17.5894 13.6001 18.2916 13.6001 19.0008C13.6002 20.433 14.1692 21.8065 15.182 22.8192C16.1948 23.8318 17.5683 24.4007 19.0006 24.4006C20.4328 24.4005 21.8063 23.8315 22.8189 22.8187L31.7289 13.9087H31.728Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.6001 24.4C33.0323 24.4 34.4058 23.8311 35.4185 22.8184C36.4312 21.8057 37.0001 20.4322 37.0001 19C37.0001 17.5678 36.4312 16.1943 35.4185 15.1816C34.4058 14.1689 33.0323 13.6 31.6001 13.6H19.0001C17.5679 13.6 16.1944 14.1689 15.1817 15.1816C14.169 16.1943 13.6001 17.5678 13.6001 19C13.6001 20.4322 14.169 21.8057 15.1817 22.8184C16.1944 23.8311 17.5679 24.4 19.0001 24.4H31.6001Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.0915 31.7278C24.5914 32.2359 25.187 32.6401 25.8439 32.9169C26.5008 33.1937 27.206 33.3377 27.9189 33.3406C28.6317 33.3435 29.338 33.2052 29.9972 32.9338C30.6563 32.6623 31.2552 32.2631 31.7592 31.759C32.2633 31.255 32.6625 30.6561 32.934 29.997C33.2054 29.3378 33.3437 28.6315 33.3408 27.9187C33.3379 27.2058 33.1939 26.5006 32.9171 25.8437C32.6403 25.1868 32.2361 24.5912 31.728 24.0913L22.818 15.1813C22.3165 14.6799 21.7212 14.2821 21.066 14.0108C20.4108 13.7395 19.7086 13.5998 18.9994 13.5999C18.2903 13.5999 17.5881 13.7396 16.9329 14.011C16.2778 14.2825 15.6825 14.6803 15.181 15.1817C14.6796 15.6832 14.2819 16.2786 14.0105 16.9338C13.7392 17.5889 13.5996 18.2912 13.5996 19.0003C13.5997 19.7095 13.7394 20.4117 14.0108 21.0668C14.2822 21.722 14.68 22.3173 15.1815 22.8187L24.0915 31.7287V31.7278Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.6001 31.6C13.6001 33.0322 14.169 34.4057 15.1817 35.4184C16.1944 36.4311 17.5679 37 19.0001 37C20.4323 37 21.8058 36.4311 22.8185 35.4184C23.8312 34.4057 24.4001 33.0322 24.4001 31.6V19C24.4001 17.5678 23.8312 16.1943 22.8185 15.1816C21.8058 14.1689 20.4323 13.6 19.0001 13.6C17.5679 13.6 16.1944 14.1689 15.1817 15.1816C14.169 16.1943 13.6001 17.5678 13.6001 19V31.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.27227 24.0913C5.76413 24.5912 5.36 25.1868 5.08319 25.8437C4.80638 26.5006 4.66237 27.2058 4.65947 27.9187C4.65657 28.6315 4.79483 29.3378 5.06628 29.997C5.33773 30.6561 5.73699 31.255 6.24105 31.759C6.7451 32.2631 7.34396 32.6623 8.0031 32.9338C8.66223 33.2052 9.36858 33.3435 10.0814 33.3406C10.7942 33.3377 11.4994 33.1937 12.1563 32.9169C12.8132 32.6401 13.4088 32.2359 13.9088 31.7278L22.8188 22.8178C23.8314 21.805 24.4003 20.4314 24.4002 18.9992C24.4001 17.567 23.8311 16.1935 22.8183 15.1809C22.3168 14.6794 21.7215 14.2817 21.0663 14.0103C20.4111 13.739 19.7089 13.5994 18.9998 13.5994C17.5675 13.5995 16.194 14.1685 15.1814 15.1813L6.27227 24.0913Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.4 13.6C4.96783 13.6 3.59432 14.1689 2.58162 15.1816C1.56893 16.1943 1 17.5678 1 19C1 20.4322 1.56893 21.8057 2.58162 22.8184C3.59432 23.8311 4.96783 24.4 6.4 24.4H19C20.4322 24.4 21.8057 23.8311 22.8184 22.8184C23.8311 21.8057 24.4 20.4322 24.4 19C24.4 17.5678 23.8311 16.1943 22.8184 15.1816C21.8057 14.1689 20.4322 13.6 19 13.6H6.4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.9088 6.2722C12.8934 5.27313 11.5242 4.71579 10.0997 4.72159C8.67515 4.7274 7.31061 5.29586 6.3033 6.30317C5.29599 7.31048 4.72753 8.67502 4.72172 10.0996C4.71592 11.5241 5.27326 12.8932 6.27233 13.9087L15.1823 22.8187C15.6823 23.3268 16.2779 23.731 16.9348 24.0078C17.5917 24.2846 18.2969 24.4286 19.0097 24.4315C19.7225 24.4344 20.4289 24.2961 21.088 24.0247C21.7471 23.7532 22.346 23.354 22.8501 22.8499C23.3541 22.3459 23.7534 21.747 24.0248 21.0879C24.2963 20.4287 24.4345 19.7224 24.4316 19.0096C24.4287 18.2967 24.2847 17.5915 24.0079 16.9346C23.7311 16.2777 23.327 15.6821 22.8188 15.1822L13.9088 6.2722Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevronRight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-full h-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  ),
  minus: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-full h-full"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
  ),
  arrowUpRight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-full h-full"
    >
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
        clipRule="evenodd"
      />
    </svg>
  ),
  arrowDownLong: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="w-full h-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
      />
    </svg>
  ),
  plant: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <path
        d="M11.964 6.96999C11.964 6.96999 8.88899 7.27599 7.27899 5.93499C5.66899 4.59299 6.03599 2.02999 6.03599 2.02999C6.03599 2.02999 9.11099 1.72399 10.722 3.06499C12.332 4.40699 11.964 6.96999 11.964 6.96999Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 14C19.2652 14 19.5196 13.8946 19.7071 13.7071C19.8946 13.5196 20 13.2652 20 13V11C20 10.7348 19.8946 10.4804 19.7071 10.2929C19.5196 10.1053 19.2652 9.99999 19 9.99999H5C4.73478 9.99999 4.48043 10.1053 4.29289 10.2929C4.10536 10.4804 4 10.7348 4 11V13C4 13.2652 4.10536 13.5196 4.29289 13.7071C4.48043 13.8946 4.73478 14 5 14M19 14H5M19 14L17 22H7L5 14M12.036 6.96999C12.036 6.96999 15.111 7.27599 16.721 5.93499C18.331 4.59299 17.964 2.02999 17.964 2.02999C17.964 2.02999 14.889 1.72399 13.279 3.06499C11.669 4.40699 12.036 6.96999 12.036 6.96999Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  pawn: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M14 19H34M40 44H8V40L14 37H34L40 40V44Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.74 19L33 37H15L20.26 19"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.0001 4C22.2263 3.99933 20.5025 4.58821 19.0999 5.67406C17.6972 6.7599 16.6953 8.28112 16.2515 9.99854C15.8077 11.716 15.9473 13.5322 16.6483 15.1616C17.3493 16.791 18.572 18.1413 20.1241 19H27.8761C29.4282 18.1413 30.6509 16.791 31.3519 15.1616C32.0529 13.5322 32.1925 11.716 31.7487 9.99854C31.3049 8.28112 30.3029 6.7599 28.9003 5.67406C27.4977 4.58821 25.7739 3.99933 24.0001 4Z"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  ),
  brain: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      strokeWidth={1.5}
    >
      <path
        d="M6.99993 14C6.56341 14.0007 6.1323 14.0966 5.73667 14.281C5.34104 14.4655 4.99044 14.734 4.70932 15.068C4.4282 15.4019 4.22335 15.7932 4.10906 16.2145C3.99476 16.6358 3.97378 17.0769 4.04758 17.5072C4.12137 17.9374 4.28817 18.3463 4.53632 18.7055C4.78448 19.0646 5.10801 19.3652 5.48435 19.5864C5.86068 19.8076 6.28075 19.944 6.71523 19.986C7.14971 20.0281 7.58815 19.9749 7.99993 19.83"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.26391 15.605C3.66548 15.3169 3.1482 14.8843 2.75876 14.3462C2.36933 13.8082 2.12 13.1817 2.03327 12.5232C1.94655 11.8647 2.02515 11.195 2.262 10.5745C2.49885 9.95396 2.88648 9.40219 3.38991 8.96896M3.41991 8.88796C3.09196 8.39721 2.94821 7.80624 3.01413 7.21969C3.08005 6.63313 3.35138 6.08882 3.78009 5.6831C4.2088 5.27739 4.76723 5.03645 5.35652 5.00293C5.94582 4.96941 6.52797 5.14547 6.99991 5.49996M7.23791 5.56496C7.07839 5.226 6.99708 4.85553 6.99999 4.48092C7.0029 4.10631 7.08997 3.73715 7.25475 3.40072C7.41953 3.06428 7.65781 2.76918 7.95198 2.53723C8.24615 2.30528 8.58869 2.1424 8.95428 2.06064C9.31987 1.97887 9.69916 1.98032 10.0641 2.06486C10.4291 2.14941 10.7704 2.31489 11.0627 2.54907C11.3551 2.78326 11.5912 3.08017 11.7534 3.41785C11.9156 3.75552 11.9999 4.12534 11.9999 4.49996V20C11.9999 20.5304 11.7892 21.0391 11.4141 21.4142C11.0391 21.7892 10.5303 22 9.99991 22C9.46948 22 8.96077 21.7892 8.5857 21.4142C8.21063 21.0391 7.99991 20.5304 7.99991 20M11.9999 6.99996C11.9999 7.79561 12.316 8.55867 12.8786 9.12128C13.4412 9.68389 14.2043 9.99996 14.9999 9.99996M16.9999 14C17.4364 14.0006 17.8675 14.0965 18.2632 14.281C18.6588 14.4654 19.0094 14.734 19.2905 15.068C19.5716 15.4019 19.7765 15.7932 19.8908 16.2145C20.0051 16.6357 20.0261 17.0769 19.9523 17.5071C19.8785 17.9374 19.7117 18.3463 19.4635 18.7054C19.2154 19.0645 18.8918 19.3652 18.5155 19.5864C18.1392 19.8075 17.7191 19.9439 17.2846 19.986C16.8501 20.0281 16.4117 19.9748 15.9999 19.83"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.736 15.605C20.3344 15.3169 20.8517 14.8843 21.2411 14.3462C21.6306 13.8082 21.8799 13.1817 21.9666 12.5232C22.0534 11.8647 21.9748 11.195 21.7379 10.5745C21.5011 9.95396 21.1134 9.40219 20.61 8.96896M20.58 8.88796C20.908 8.39721 21.0517 7.80624 20.9858 7.21969C20.9199 6.63313 20.6485 6.08882 20.2198 5.6831C19.7911 5.27739 19.2327 5.03645 18.6434 5.00293C18.0541 4.96941 17.4719 5.14547 17 5.49996M12 4.49996C12.0001 4.12534 12.0843 3.75552 12.2465 3.41785C12.4087 3.08017 12.6448 2.78326 12.9372 2.54907C13.2296 2.31489 13.5708 2.14941 13.9358 2.06486C14.3008 1.98032 14.68 1.97887 15.0456 2.06064C15.4112 2.1424 15.7538 2.30528 16.0479 2.53723C16.3421 2.76918 16.5804 3.06428 16.7452 3.40072C16.9099 3.73715 16.997 4.10631 16.9999 4.48092C17.0028 4.85553 16.9215 5.226 16.762 5.56496M16 20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7892 14.5304 22 14 22C13.4696 22 12.9609 21.7892 12.5858 21.4142C12.2107 21.0391 12 20.5304 12 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  home: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-full h-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  ),
  snowflake: (
    <svg
      fill="#9DAEE0"
      height="25px"
      width="25px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 298 298"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g>
          {" "}
          <path d="M289.5,140.5h-24.606l11.031-11.03c2.93-2.929,2.93-7.678,0.001-10.606c-2.929-2.929-7.678-2.93-10.606-0.001 L243.681,140.5h-36.369l16.182-17.392c2.821-3.032,2.65-7.777-0.383-10.6c-1.243-1.156-2.775-1.802-4.345-1.961 c-0.952-0.047-21.495-0.003-21.495-0.003L221.315,86.5H251.5c4.143,0,7.5-3.357,7.5-7.5s-3.357-7.5-7.5-7.5h-15.186l17.69-17.69 c2.929-2.93,2.929-7.678,0-10.608c-2.93-2.928-7.844-2.928-10.774,0L225.167,61.1V45.5c0-4.143-3.357-7.5-7.5-7.5 c-4.143,0-7.5,3.357-7.5,7.5v30.601l-24.837,25.004l-0.415-22.645c-0.001-0.036,0.035-0.07,0.034-0.106 c-0.035-1.824-0.704-3.641-2.07-5.059c-2.873-2.982-7.778-3.07-10.761-0.194l-15.951,15.226V53.107l21.47-21.304 c2.929-2.93,3.012-7.678,0.083-10.607c-2.93-2.928-7.803-2.928-10.732,0l-10.821,10.696V7.5c0-4.143-3.357-7.5-7.5-7.5 c-4.143,0-7.5,3.357-7.5,7.5v24.393l-10.53-10.696c-2.93-2.928-7.594-2.928-10.524,0c-2.929,2.93-3.054,7.678-0.125,10.607 l21.179,21.304v35.421l-16.176-15.475c-3.009-2.847-7.67-2.718-10.52,0.289c-1.075,1.136-1.683,2.52-1.914,3.955 c-0.142,0.583-0.203,1.188-0.201,1.811l-0.088,21.229l-25.1-24.944V45.5c0-4.143-3.357-7.5-7.5-7.5s-7.5,3.357-7.5,7.5v14.894 L55.142,43.202c-2.93-2.928-7.594-2.928-10.524,0c-2.929,2.93-2.887,7.678,0.042,10.608L62.392,71.5H46.5 c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5h30.892l24.744,24.744l-23.057,0.831c-4.021,0.146-7.524,3.435-7.563,7.418 c-0.004,0.112-0.349,0.225-0.349,0.337c0,0.003,0,0.007,0,0.011c0,0.008,0.345,0.017,0.345,0.024 c0.045,1.875,0.955,3.736,2.395,5.158L89.748,140.5H55.025l-21.638-21.638c-2.93-2.928-7.678-2.928-10.607,0 c-2.929,2.93-2.929,7.678,0,10.607l11.03,11.03H8.5c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5h25.02L22.78,166.239 c-2.929,2.93-2.929,7.678,0,10.607c1.465,1.464,3.385,2.196,5.304,2.196c1.919,0,3.839-0.732,5.304-2.196L54.734,155.5h35.027 l-15.253,16.394c-2.821,3.032-2.65,7.777,0.383,10.6c1.444,1.344,3.277,2.009,5.106,2.009c0.034,0,0.068-0.005,0.103-0.005 c0.022,0,0.044,0.003,0.065,0.003c0.018,0,0.037,0,0.055,0l22.005-0.125L77.101,209.5H46.5c-4.143,0-7.5,3.357-7.5,7.5 s3.357,7.5,7.5,7.5h15.601l-17.399,17.399c-2.929,2.93-2.929,7.678,0,10.607c1.465,1.464,3.385,2.196,5.304,2.196 c1.919,0,3.672-0.732,5.137-2.196l17.025-17.191V250.5c0,4.143,3.357,7.5,7.5,7.5s7.5-3.357,7.5-7.5v-30.185l25.445-25.278 l0.977,24.39c0.148,4.046,3.517,7.306,7.532,7.225c1.364-0.027,2.844-0.465,4.312-1.543c1.063-0.781,15.734-15.812,15.734-15.812 v35.385l-20.971,21.137c-2.93,2.929-2.846,7.678,0.082,10.607c1.465,1.465,3.425,2.197,5.345,2.197 c1.919,0,3.693-0.732,5.157-2.196l10.387-10.532V290.5c0,4.143,3.357,7.5,7.5,7.5c4.143,0,7.5-3.357,7.5-7.5v-25.31l11.404,11.237 c1.465,1.464,3.468,2.196,5.387,2.196c1.919,0,3.881-0.732,5.345-2.196c2.929-2.93,2.783-7.678-0.146-10.607l-21.99-21.845v-35.7 c0,0,13.729,12.896,15.896,14.976c2.167,2.08,3.942,3.25,6.525,3.25c0.015,0,0.03,0,0.046,0c4.142,0,7.48-3.604,7.455-7.746 l-0.306-23.696l24.384,24.551V250.5c0,4.143,3.357,7.5,7.5,7.5c4.143,0,7.5-3.357,7.5-7.5v-15.891l18.064,17.897 c1.465,1.464,3.467,2.196,5.387,2.196c1.919,0,3.88-0.732,5.345-2.196c2.929-2.93,2.95-7.678,0.021-10.607L236.605,224.5H251.5 c4.143,0,7.5-3.357,7.5-7.5s-3.357-7.5-7.5-7.5h-29.894l-25.742-25.742l23.059-0.831c0.082-0.003,0.162-0.016,0.243-0.021 c0.03-0.002,0.06-0.005,0.09-0.008c3.977-0.319,7.037-3.709,6.892-7.736c-0.087-2.424-1.32-4.531-3.155-5.837L209.138,155.5h34.835 l21.345,21.346c1.465,1.465,3.384,2.197,5.304,2.197c1.919,0,3.839-0.732,5.303-2.196c2.93-2.929,2.93-7.678,0.001-10.606 l-10.74-10.74H289.5c4.143,0,7.5-3.357,7.5-7.5S293.643,140.5,289.5,140.5z M200.795,125.483L186.823,140.5h-19.507l15.002-15.002 L200.795,125.483z M170.21,95.784l0.356,20.002l-14.399,14.315V109.16L170.21,95.784z M127.263,95.865l13.904,13.323v20.205 l-13.925-14.008L127.263,95.865z M96.862,126.444l19.762-0.712l14.768,14.768h-20.299L96.862,126.444z M97.246,169.477 L110.25,155.5h20.851l-13.841,13.841L97.246,169.477z M127.863,201.599l-0.854-21.042l14.158-14.241v21.604L127.863,201.599z M170.819,201.264l-14.652-13.478v-22.179l14.442,14.359L170.819,201.264z M200.991,168.564l-19.614,0.706l-13.77-13.77h20.292 L200.991,168.564z"></path>{" "}
        </g>{" "}
      </g>
    </svg>
  ),
  paint: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-paintbrush"
    >
      <path d="m14.622 17.897-10.68-2.913" />
      <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" />
      <path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15" />
    </svg>
  ),
  heart: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-heart-pulse"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  ),
};

export default function Icon({
  name,
  as = "span",
  className,
}: {
  name: keyof typeof iconDefs;
  as?: "span" | "div";
  className?: string;
}) {
  if (!iconDefs[name]) return null;

  const baseClassName = "h-5 w-5";

  if (as === "span")
    return (
      <span className={twMerge(baseClassName, className)}>
        {iconDefs[name]}
      </span>
    );

  return (
    <div className={twMerge(baseClassName, className)}>{iconDefs[name]}</div>
  );
}
