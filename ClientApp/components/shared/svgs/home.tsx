import React from "react";

const SvgTest = props => (
  <span>
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M15.45 17.97L9.5 12.01a.25.25 0 010-.36l5.87-5.87a.75.75 0 00-1.06-1.06l-5.87 5.87c-.69.68-.69 1.8 0 2.48l5.96 5.96a.75.75 0 001.06-1.06z"
      />
    </svg>
  </span>
);

export default SvgTest;