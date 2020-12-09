import React from "react";
import styled from "styled-components";
import HighQualityImage from "@Components/shared/svgs/HighQualityImage";

const SvgTest = props => (
    <div
        id="myDownloadList"
        style={{
            right: "5px",
            zIndex: 9999999999,
            background: "white",
            display: "none"
        }}
        className="dropdown-content-font-size"
    >
        <div style={{ display: "flex", width: "100%" }}>
            <div
                id="myDropdownFontSize-3"
                style={{
                    borderRadius: "5px",
                    width: "100%",
                    overflow: "hidden"
                }}
            >
                <ul
                    style={{
                        padding: 0,
                        listStyle: "none",
                        width: "100%",
                    }}
                >
                    <li
                        style={{
                            boxShadow: "rgba(55, 53, 47, 0.09) 0px 1px 0px",
                            marginBottom: "1px"
                        }}
                    >
                        <DownloadButton
                            onClick={props.downloadPNG.bind(this, true, true)}
                        >
                            <HighQualityImage width="35px" height="35px" style={{ marginRight: "10px", }} />
                            <div>
                                <p style={{ marginBottom: "0px" }}>PNG</p>
                                <span
                                    style={{
                                        fontSize: "13px"
                                    }}
                                >
                                    {/* Ảnh chất lượng cao */}
                                    {props.translate("highQualityImage")}
                                </span>
                            </div>
                        </DownloadButton>
                    </li>
                    <li
                        style={{
                            boxShadow: "rgba(55, 53, 47, 0.09) 0px 1px 0px",
                            marginBottom: "1px"
                        }}
                    >
                        <DownloadButton
                            onClick={props.downloadPNG.bind(this, false, false)}
                        >
                            <svg
                                style={{ width: "35px", marginRight: "10px" }}
                                version="1.1"
                                id="Capa_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 58 58"
                                xmlSpace="preserve"
                            >
                                <g>
                                    <path
                                        d="M50.949,12.187l-5.818-5.818l-5.047-5.048l0,0l-0.77-0.77C38.964,0.201,38.48,0,37.985,0H8.963
C7.777,0,6.5,0.916,6.5,2.926V39v16.537V56c0,0.837,0.842,1.653,1.838,1.91c0.05,0.013,0.098,0.032,0.15,0.042
C8.644,57.983,8.803,58,8.963,58h40.074c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.101-0.029,0.152-0.043
C50.659,57.652,51.5,56.837,51.5,56v-0.463V39V13.978C51.5,13.211,51.407,12.644,50.949,12.187z M47.935,12H39.5V3.565l4.248,4.249
L47.935,12z M8.963,2h28.595C37.525,2.126,37.5,2.256,37.5,2.391V14h11.608c0.135,0,0.265-0.025,0.391-0.058
c0,0.015,0.001,0.021,0.001,0.036v12.693l-8.311-7.896c-0.195-0.185-0.445-0.284-0.725-0.274c-0.269,0.01-0.521,0.127-0.703,0.325
l-9.795,10.727l-4.743-4.743c-0.369-0.369-0.958-0.392-1.355-0.055L8.5,37.836V2.926C8.5,2.709,8.533,2,8.963,2z M8.963,56
c-0.071,0-0.135-0.026-0.198-0.049C8.609,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.11,0.34-0.265,0.414
C49.172,55.975,49.108,56,49.037,56H8.963z M10.218,39l14.245-12.124L34.776,37.19c0.391,0.391,1.023,0.391,1.414,0
s0.391-1.023,0-1.414l-4.807-4.807l9.168-10.041l8.949,8.501V39H10.218z"
                                    />
                                    <path
                                        d="M19.354,51.43c-0.019,0.446-0.171,0.764-0.458,0.95s-0.672,0.28-1.155,0.28c-0.191,0-0.396-0.022-0.615-0.068
s-0.429-0.098-0.629-0.157c-0.201-0.06-0.385-0.123-0.554-0.191c-0.169-0.068-0.299-0.135-0.39-0.198l-0.697,1.107
c0.182,0.137,0.405,0.26,0.67,0.369c0.264,0.109,0.54,0.207,0.827,0.294s0.565,0.15,0.834,0.191
c0.269,0.041,0.503,0.062,0.704,0.062c0.401,0,0.791-0.039,1.169-0.116c0.378-0.077,0.713-0.214,1.005-0.41
c0.292-0.196,0.524-0.456,0.697-0.779c0.173-0.323,0.26-0.723,0.26-1.196v-7.848h-1.668V51.43z"
                                    />
                                    <path
                                        d="M28.767,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205h-2.898V54h1.641v-3.637h1.217
c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
c0-0.483-0.103-0.918-0.308-1.306S29.099,45.018,28.767,44.744z M28.145,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
s-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
C28.295,47.451,28.245,47.795,28.145,48.073z"
                                    />
                                    <path
                                        d="M35.76,49.926h1.709v2.488c-0.073,0.101-0.187,0.178-0.342,0.232c-0.155,0.055-0.317,0.098-0.485,0.13
c-0.169,0.032-0.337,0.055-0.506,0.068c-0.169,0.014-0.303,0.021-0.403,0.021c-0.328,0-0.641-0.077-0.937-0.232
c-0.296-0.155-0.561-0.392-0.793-0.711s-0.415-0.729-0.547-1.23c-0.132-0.501-0.203-1.094-0.212-1.777
c0.009-0.702,0.082-1.294,0.219-1.777s0.326-0.877,0.567-1.183c0.241-0.306,0.515-0.521,0.82-0.649
c0.305-0.128,0.626-0.191,0.964-0.191c0.301,0,0.592,0.06,0.875,0.178c0.282,0.118,0.533,0.31,0.752,0.574l1.135-1.012
c-0.374-0.364-0.798-0.638-1.271-0.82c-0.474-0.183-0.984-0.273-1.531-0.273c-0.593,0-1.144,0.111-1.654,0.335
c-0.511,0.224-0.955,0.549-1.333,0.978c-0.378,0.429-0.675,0.964-0.889,1.606c-0.214,0.643-0.321,1.388-0.321,2.235
s0.107,1.595,0.321,2.242c0.214,0.647,0.51,1.185,0.889,1.613c0.378,0.429,0.82,0.752,1.326,0.971s1.06,0.328,1.661,0.328
c0.301,0,0.604-0.022,0.909-0.068c0.305-0.046,0.602-0.123,0.889-0.232s0.561-0.248,0.82-0.417s0.494-0.385,0.704-0.649v-3.896
H35.76V49.926z"
                                    />
                                    <path
                                        d="M19.069,23.638c3.071,0,5.569-2.498,5.569-5.569S22.14,12.5,19.069,12.5S13.5,14.998,13.5,18.069
S15.998,23.638,19.069,23.638z M19.069,14.5c1.968,0,3.569,1.601,3.569,3.569s-1.601,3.569-3.569,3.569S15.5,20.037,15.5,18.069
S17.101,14.5,19.069,14.5z"
                                    />
                                </g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                            </svg>
                            <div>
                                <p style={{ marginBottom: "0px" }}>JPG</p>
                                <span
                                    style={{
                                        fontSize: "13px"
                                    }}
                                >
                                    {/* Kích thước tập tin ảnh nhỏ */}
                                    {props.translate("smallFileSizeImage")}
                                </span>
                            </div>
                        </DownloadButton>
                    </li>
                    <li
                        style={{
                            boxShadow: "rgba(55, 53, 47, 0.09) 0px 1px 0px",
                            marginBottom: "1px"
                        }}
                    >
                        <DownloadButton
                            onClick={props.downloadPDF.bind(this, false)}
                        >
                            <svg
                                style={{ width: "35px", marginRight: "10px" }}
                                version="1.1"
                                id="Capa_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 58 58"
                                xmlSpace="preserve"
                            >
                                <g>
                                    <path
                                        d="M50.95,12.187l-0.771-0.771L40.084,1.321L39.313,0.55C38.964,0.201,38.48,0,37.985,0H8.963C7.777,0,6.5,0.916,6.5,2.926V39
v16.537V56c0,0.837,0.842,1.653,1.838,1.91c0.05,0.013,0.098,0.032,0.15,0.042C8.644,57.983,8.803,58,8.963,58h40.074
c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.1-0.029,0.15-0.042C50.658,57.653,51.5,56.837,51.5,56v-0.463V39V13.978
C51.5,13.211,51.408,12.645,50.95,12.187z M47.935,12H39.5V3.565L47.935,12z M8.963,56c-0.071,0-0.135-0.026-0.198-0.049
C8.609,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.109,0.339-0.265,0.414C49.172,55.974,49.108,56,49.037,56H8.963z
M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595C37.525,2.126,37.5,2.256,37.5,2.391V14h11.609c0.135,0,0.264-0.025,0.39-0.058
c0,0.015,0.001,0.021,0.001,0.036V39H8.5z"
                                    />
                                    <path
                                        d="M22.042,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205h-2.898V54h1.641v-3.637h1.217
c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
c0-0.483-0.103-0.918-0.308-1.306S22.375,45.018,22.042,44.744z M21.42,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
c-0.164,0.155-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
C21.57,47.451,21.52,47.795,21.42,48.073z"
                                    />
                                    <path
                                        d="M31.954,45.4c-0.424-0.446-0.957-0.805-1.6-1.073s-1.388-0.403-2.235-0.403h-3.035V54h3.814
c0.127,0,0.323-0.016,0.588-0.048c0.264-0.032,0.556-0.104,0.875-0.219c0.319-0.114,0.649-0.285,0.991-0.513
s0.649-0.54,0.923-0.937s0.499-0.889,0.677-1.477s0.267-1.297,0.267-2.126c0-0.602-0.105-1.188-0.314-1.757
C32.694,46.355,32.378,45.847,31.954,45.4z M30.758,51.73c-0.492,0.711-1.294,1.066-2.406,1.066h-1.627v-7.629h0.957
c0.784,0,1.422,0.103,1.914,0.308s0.882,0.474,1.169,0.807s0.48,0.704,0.581,1.114c0.1,0.41,0.15,0.825,0.15,1.244
C31.496,49.989,31.25,51.02,30.758,51.73z"
                                    />
                                    <polygon
                                        points="35.598,54 37.266,54 37.266,49.461 41.477,49.461 41.477,48.34 37.266,48.34 37.266,45.168 41.9,45.168 
41.9,43.924 35.598,43.924 	"
                                    />
                                    <path
                                        d="M38.428,22.961c-0.919,0-2.047,0.12-3.358,0.358c-1.83-1.942-3.74-4.778-5.088-7.562c1.337-5.629,0.668-6.426,0.373-6.802
c-0.314-0.4-0.757-1.049-1.261-1.049c-0.211,0-0.787,0.096-1.016,0.172c-0.576,0.192-0.886,0.636-1.134,1.215
c-0.707,1.653,0.263,4.471,1.261,6.643c-0.853,3.393-2.284,7.454-3.788,10.75c-3.79,1.736-5.803,3.441-5.985,5.068
c-0.066,0.592,0.074,1.461,1.115,2.242c0.285,0.213,0.619,0.326,0.967,0.326h0c0.875,0,1.759-0.67,2.782-2.107
c0.746-1.048,1.547-2.477,2.383-4.251c2.678-1.171,5.991-2.229,8.828-2.822c1.58,1.517,2.995,2.285,4.211,2.285
c0.896,0,1.664-0.412,2.22-1.191c0.579-0.811,0.711-1.537,0.39-2.16C40.943,23.327,39.994,22.961,38.428,22.961z M20.536,32.634
c-0.468-0.359-0.441-0.601-0.431-0.692c0.062-0.556,0.933-1.543,3.07-2.744C21.555,32.19,20.685,32.587,20.536,32.634z
M28.736,9.712c0.043-0.014,1.045,1.101,0.096,3.216C27.406,11.469,28.638,9.745,28.736,9.712z M26.669,25.738
c1.015-2.419,1.959-5.09,2.674-7.564c1.123,2.018,2.472,3.976,3.822,5.544C31.031,24.219,28.759,24.926,26.669,25.738z
M39.57,25.259C39.262,25.69,38.594,25.7,38.36,25.7c-0.533,0-0.732-0.317-1.547-0.944c0.672-0.086,1.306-0.108,1.811-0.108
c0.889,0,1.052,0.131,1.175,0.197C39.777,24.916,39.719,25.05,39.57,25.259z"
                                    />
                                </g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                            </svg>

                            <div>
                                <p style={{ marginBottom: "0px" }}>
                                    PDF Standard
                </p>
                                <span
                                    style={{
                                        fontSize: "13px"
                                    }}
                                >
                                    {/* Kích thước tập tin nhỏ, nhiều trang */}
                                    {props.translate("pdfStandardDesc")}
                                </span>
                            </div>
                        </DownloadButton>
                    </li>
                    {/* <li
            style={{
              boxShadow: "rgba(55, 53, 47, 0.09) 0px 1px 0px",
              marginBottom: "1px"
            }}
          >
            <button
              onClick={props.downloadPDF.bind(this, true)}
              style={{
                width: "100%",
                border: "none",
                textAlign: "left",
                padding: "5px 12px",
                display: "flex"
              }}
            >
              <svg
                style={{ width: "35px", marginRight: "10px" }}
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 58 58"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M50.95,12.187l-0.771-0.771L40.084,1.321L39.313,0.55C38.964,0.201,38.48,0,37.985,0H8.963C7.777,0,6.5,0.916,6.5,2.926V39
v16.537V56c0,0.837,0.842,1.653,1.838,1.91c0.05,0.013,0.098,0.032,0.15,0.042C8.644,57.983,8.803,58,8.963,58h40.074
c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.1-0.029,0.15-0.042C50.658,57.653,51.5,56.837,51.5,56v-0.463V39V13.978
C51.5,13.211,51.408,12.645,50.95,12.187z M47.935,12H39.5V3.565L47.935,12z M8.963,56c-0.071,0-0.135-0.026-0.198-0.049
C8.609,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.109,0.339-0.265,0.414C49.172,55.974,49.108,56,49.037,56H8.963z
M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595C37.525,2.126,37.5,2.256,37.5,2.391V14h11.609c0.135,0,0.264-0.025,0.39-0.058
c0,0.015,0.001,0.021,0.001,0.036V39H8.5z"
                  />
                  <path
                    d="M22.042,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205h-2.898V54h1.641v-3.637h1.217
c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
c0-0.483-0.103-0.918-0.308-1.306S22.375,45.018,22.042,44.744z M21.42,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
c-0.164,0.155-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
C21.57,47.451,21.52,47.795,21.42,48.073z"
                  />
                  <path
                    d="M31.954,45.4c-0.424-0.446-0.957-0.805-1.6-1.073s-1.388-0.403-2.235-0.403h-3.035V54h3.814
c0.127,0,0.323-0.016,0.588-0.048c0.264-0.032,0.556-0.104,0.875-0.219c0.319-0.114,0.649-0.285,0.991-0.513
s0.649-0.54,0.923-0.937s0.499-0.889,0.677-1.477s0.267-1.297,0.267-2.126c0-0.602-0.105-1.188-0.314-1.757
C32.694,46.355,32.378,45.847,31.954,45.4z M30.758,51.73c-0.492,0.711-1.294,1.066-2.406,1.066h-1.627v-7.629h0.957
c0.784,0,1.422,0.103,1.914,0.308s0.882,0.474,1.169,0.807s0.48,0.704,0.581,1.114c0.1,0.41,0.15,0.825,0.15,1.244
C31.496,49.989,31.25,51.02,30.758,51.73z"
                  />
                  <polygon
                    points="35.598,54 37.266,54 37.266,49.461 41.477,49.461 41.477,48.34 37.266,48.34 37.266,45.168 41.9,45.168 
41.9,43.924 35.598,43.924 	"
                  />
                  <path
                    d="M38.428,22.961c-0.919,0-2.047,0.12-3.358,0.358c-1.83-1.942-3.74-4.778-5.088-7.562c1.337-5.629,0.668-6.426,0.373-6.802
c-0.314-0.4-0.757-1.049-1.261-1.049c-0.211,0-0.787,0.096-1.016,0.172c-0.576,0.192-0.886,0.636-1.134,1.215
c-0.707,1.653,0.263,4.471,1.261,6.643c-0.853,3.393-2.284,7.454-3.788,10.75c-3.79,1.736-5.803,3.441-5.985,5.068
c-0.066,0.592,0.074,1.461,1.115,2.242c0.285,0.213,0.619,0.326,0.967,0.326h0c0.875,0,1.759-0.67,2.782-2.107
c0.746-1.048,1.547-2.477,2.383-4.251c2.678-1.171,5.991-2.229,8.828-2.822c1.58,1.517,2.995,2.285,4.211,2.285
c0.896,0,1.664-0.412,2.22-1.191c0.579-0.811,0.711-1.537,0.39-2.16C40.943,23.327,39.994,22.961,38.428,22.961z M20.536,32.634
c-0.468-0.359-0.441-0.601-0.431-0.692c0.062-0.556,0.933-1.543,3.07-2.744C21.555,32.19,20.685,32.587,20.536,32.634z
M28.736,9.712c0.043-0.014,1.045,1.101,0.096,3.216C27.406,11.469,28.638,9.745,28.736,9.712z M26.669,25.738
c1.015-2.419,1.959-5.09,2.674-7.564c1.123,2.018,2.472,3.976,3.822,5.544C31.031,24.219,28.759,24.926,26.669,25.738z
M39.57,25.259C39.262,25.69,38.594,25.7,38.36,25.7c-0.533,0-0.732-0.317-1.547-0.944c0.672-0.086,1.306-0.108,1.811-0.108
c0.889,0,1.052,0.131,1.175,0.197C39.777,24.916,39.719,25.05,39.57,25.259z"
                  />
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
              <div>
                <p style={{ marginBottom: "0px" }}>PDF Print</p>
                <span
                  style={{
                    fontSize: "13px"
                  }}
                >
                  {props.translate("pdfPrint")}
                </span>
              </div>
            </button>
          </li> */}
                    <li
                        style={{
                            boxShadow: "rgba(55, 53, 47, 0.09) 0px 1px 0px",
                            marginBottom: "1px"
                        }}
                    >
                        <DownloadButton
                            onClick={props.downloadVideo.bind(this)}
                        >
                            <svg
                                style={{ width: "35px", marginRight: "10px" }}
                                version="1.1"
                                id="Capa_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 58 58"
                                xmlSpace="preserve"
                            >
                                <g>
                                    <path
                                        d="M50.95,12.187l-0.77-0.77l0,0L40.084,1.321c0,0-0.001-0.001-0.002-0.001l-0.768-0.768C38.965,0.201,38.48,0,37.985,0H8.963
C7.777,0,6.5,0.916,6.5,2.926V39v16.537V56c0,0.838,0.843,1.654,1.839,1.91c0.05,0.013,0.097,0.032,0.148,0.042
C8.644,57.983,8.803,58,8.963,58h40.074c0.16,0,0.319-0.017,0.475-0.048c0.051-0.01,0.098-0.029,0.148-0.042
C50.657,57.654,51.5,56.838,51.5,56v-0.463V39V13.978C51.5,13.213,51.408,12.646,50.95,12.187z M42.5,21c0,7.168-5.832,13-13,13
s-13-5.832-13-13s5.832-13,13-13c2.898,0,5.721,0.977,8,2.76V13v1h1h1.948C41.792,16.093,42.5,18.502,42.5,21z M40.981,12H39.5
v-1.717V3.565L47.935,12H40.981z M8.963,56c-0.071,0-0.135-0.025-0.198-0.049C8.609,55.876,8.5,55.72,8.5,55.537V41h41v14.537
c0,0.183-0.109,0.339-0.265,0.414C49.172,55.975,49.108,56,49.037,56H8.963z M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595
C37.525,2.126,37.5,2.256,37.5,2.392v5.942C35.115,6.826,32.342,6,29.5,6c-8.271,0-15,6.729-15,15s6.729,15,15,15s15-6.729,15-15
c0-2.465-0.607-4.849-1.749-7h6.357c0.135,0,0.264-0.025,0.39-0.058c0,0.014,0.001,0.02,0.001,0.036V39H8.5z"
                                    />
                                    <polygon
                                        points="20.42,50.814 17.426,43.924 15.758,43.924 15.758,54 17.426,54 17.426,47.068 19.695,52.674 21.145,52.674 
23.4,47.068 23.4,54 25.068,54 25.068,43.924 23.4,43.924 	"
                                    />
                                    <path
                                        d="M32.868,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205H27.57V54h1.641v-3.637h1.217
c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
c0-0.483-0.103-0.918-0.308-1.306S33.201,45.018,32.868,44.744z M32.246,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
s-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
C32.396,47.451,32.346,47.795,32.246,48.073z"
                                    />
                                    <path
                                        d="M41.146,43.924h-1.668l-4.361,6.426v1.299h4.361V54h1.668v-2.352h1.053V50.35h-1.053V43.924z M39.479,50.35H36.58
l2.898-4.512V50.35z"
                                    />
                                    <path
                                        d="M37.037,20.156l-11-7c-0.308-0.195-0.698-0.208-1.019-0.033C24.699,13.299,24.5,13.635,24.5,14v14
c0,0.365,0.199,0.701,0.519,0.877C25.169,28.959,25.334,29,25.5,29c0.187,0,0.374-0.053,0.537-0.156l11-7
C37.325,21.66,37.5,21.342,37.5,21S37.325,20.34,37.037,20.156z M26.5,26.179V15.821L34.637,21L26.5,26.179z"
                                    />
                                </g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                                <g></g>
                            </svg>
                            <div>
                                <p style={{ marginBottom: "4px" }}>Video</p>
                                <span
                                    style={{
                                        fontSize: "13px"
                                    }}
                                >
                                    MP4
                </span>
                            </div>
                        </DownloadButton>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

export default SvgTest;

const DownloadButton = styled.button`
    width: 100%;
    border: none;
    text-align: left;
    padding: 10px 12px;
    display: flex;
`;