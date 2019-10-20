import * as React from "react";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import Globals from "@Globals";
import AccountService from "@Services/AccountService";
import { Dropdown, Collapse } from "bootstrap3-native";
import bind from 'bind-decorator';
import '@Styles/topMenu.scss';
import StyledComponent , {createGlobalStyle} from "styled-components";

class TopMenu extends React.Component<{}, { logoutAction: boolean, show: string, menuHover: boolean, tabHover: string }> {

    constructor(props) {
        super(props);
        this.state = { logoutAction: false, show: null, menuHover: false, tabHover : null };
    }

    @bind
    async onClickSignOut(e: any) {
        e.preventDefault();

        await AccountService.logout();
        this.setState({ logoutAction: true });
    }

    private elDropdown: HTMLAnchorElement;
    private elCollapseButton: HTMLButtonElement;

    componentDidMount() {
        if (this.elDropdown)
            var dropdown = new Dropdown(this.elDropdown);

        if (this.elCollapseButton)
            var collapse = new Collapse(this.elCollapseButton);
    }

    getDisplayAttribute(cond: boolean) {
        return cond === true ? "block" : "none";
    }

    componentDidUpdate() {
        if (document.getElementById('content-container')) {
            if (this.state.show || this.state.menuHover) {
                document.getElementById('content-container').style.filter = 'opacity(0.5)';
            } else {
                document.getElementById('content-container').style.filter = '';
            }
        }
    }

    timer = null

    render() {
        const loggedIn = Globals.serviceUser && Globals.serviceUser.username !== undefined;

        return <div
        style={{
          boxShadow: "0 1px 8px rgba(38,49,71,.08)"
        }}
      >
        <div className="container" style={{}}>
          <div
            style={{
              height: "50px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                width: "105px",
                height: "39px",
                textAlign: "center",
                lineHeight: "39px",
                fontSize: "16px"
              }}
            ></div>
            <a id="logo" href="/">
            <svg
              style={{
                transform: "scale(0.5)",
                transformOrigin: "center 20px"
              }}
              width="160"
              height="60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <metadata id="metadata190397">image/svg+xml</metadata>

              <g>
                <title>background</title>
                <rect
                  fill="none"
                  id="canvas_background"
                  height="62"
                  width="162"
                  y="-1"
                  x="-1"
                />
              </g>
              <g>
                <title>Layer 1</title>
                <g stroke="null" id="logo-group">
                  <g
                    stroke="null"
                    font-style="normal"
                    font-weight="700"
                    font-size="72px"
                    font-family="'Brandmark1 Bold'"
                    text-anchor="middle"
                    id="title"
                  >
                    <path
                      stroke="null"
                      fill="#56aaff"
                      transform="translate(0,365.45123291015625) "
                      d="m4.52583,-318.85031c1.04036,2.24451 2.4275,4.29098 4.23078,6.00737c1.87264,1.71639 3.95335,3.10271 6.31149,4.02692c2.4275,0.99023 5.06306,1.45233 7.69863,1.45233c2.63557,0 5.27114,-0.46211 7.69863,-1.45233c2.35814,-0.92421 4.43885,-2.31053 6.31149,-4.02692c1.80328,-1.71639 3.19042,-3.76286 4.23078,-6.00737c1.04036,-2.31053 1.52586,-4.75308 1.52586,-7.32767l0,-32.0173l-10.40356,-3.30075l0,18.74828c-0.55486,-0.26406 -1.10971,-0.52812 -1.66457,-0.72617c-2.4275,-0.99023 -4.99371,-1.45233 -7.69863,-1.45233c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.92421 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.75308 -1.52586,7.26166c0,2.57459 0.55486,5.01714 1.52586,7.32767zm18.2409,-16.2397c5.13242,0 9.3632,4.02692 9.3632,8.91203c0,4.95113 -4.23078,8.91203 -9.3632,8.91203c-5.13242,0 -9.3632,-3.9609 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203z"
                      id="path190399"
                    />
                    <path
                      stroke="null"
                      fill="#56aaff"
                      transform="translate(0,365.45123291015625) "
                      d="m58.15835,-307.8258l0,0l0,-16.2397c0,-6.33745 5.40985,-11.55263 12.13748,-11.55263l0,-9.90226c-3.05171,0 -6.03406,0.59414 -8.80834,1.71639c-2.63557,1.05624 -5.06306,2.6406 -7.14378,4.62105c-2.08071,1.91444 -3.67592,4.22496 -4.85499,6.79955c-1.17907,2.6406 -1.73393,5.41323 -1.73393,8.3179l0,16.2397l10.40356,0z"
                      id="path190401"
                    />
                    <path
                      stroke="null"
                      fill="#56aaff"
                      transform="translate(0,365.45123291015625) "
                      d="m97.54557,-344.99227l0.06936,2.11248c-2.77428,-1.3203 -5.82599,-2.04647 -8.94706,-2.04647c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.99023 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.8191 -1.52586,7.32767c0,2.50857 0.55486,5.01714 1.52586,7.32767c1.04036,2.24451 2.4275,4.22496 4.23078,6.00737c1.87264,1.71639 3.95335,3.03669 6.31149,4.02692c2.4275,0.92421 5.06306,1.45233 7.69863,1.45233c3.12107,0 6.17278,-0.72617 8.94706,-2.04647l-0.06936,1.51835l10.40356,0l0,-37.16648l-10.40356,0zm-4.16142,26.53805c-1.38714,0.79218 -3.05171,1.25429 -4.71628,1.25429c-5.13242,0 -9.3632,-4.02692 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203c1.80328,0 3.60657,0.46211 5.06306,1.45233c1.52586,0.8582 2.70492,2.1785 3.3985,3.69684c0.62421,1.18827 0.90164,2.44256 0.90164,3.76286c0,1.58436 -0.41614,3.10271 -1.24843,4.48902c-0.83228,1.3203 -1.942,2.44256 -3.3985,3.16872z"
                      id="path190403"
                    />
                    <path
                      stroke="null"
                      fill="#56aaff"
                      transform="translate(0,365.45123291015625) "
                      d="m124.14507,-344.46415l0,-0.06602c0,-5.74331 4.92435,-10.49639 11.02777,-10.49639l0,-9.90226c-2.913,0 -5.75663,0.59414 -8.3922,1.65038c-2.56621,0.99023 -4.85499,2.44256 -6.79699,4.35699c-1.942,1.84842 -3.53721,4.02692 -4.57757,6.46948c-1.10971,2.50857 -1.66457,5.21519 -1.66457,7.92181l0,36.70437l10.40356,0l0,-27.39625l11.02777,0l0,-9.24211l-11.02777,0z"
                      id="path190405"
                    />
                    <path
                      stroke="null"
                      fill="#56aaff"
                      transform="translate(0,365.45123291015625) "
                      d="m157.99997,-335.35407l0,-9.24211l-11.02777,0l0,-11.81669l-10.40356,3.30075l0,25.61384c0,2.77263 0.55486,5.41323 1.66457,7.92181c1.04036,2.44256 2.63557,4.62105 4.57757,6.46948c1.942,1.91444 4.23078,3.36677 6.79699,4.42301c2.63557,1.05624 5.47921,1.58436 8.3922,1.58436l0,-9.90226c-6.10342,0 -11.02777,-4.68707 -11.02777,-10.49639l0,-7.85579l11.02777,0z"
                      id="path190407"
                    />
                  </g>
                  <g
                    stroke="null"
                    font-style="normal"
                    font-weight="400"
                    font-size="32px"
                    font-family="Montserrat"
                    text-anchor="middle"
                    id="tagline"
                  />
                </g>
              </g>
            </svg>
            </a>
            <div
              style={{
                height: "100%",
                textAlign: "center",
                lineHeight: "39px",
                fontSize: "16px",
                padding: "10px"
              }}
            >
              {!loggedIn ? <button
        id="login-btn"
        style={{
            height: '30px',
            lineHeight: '30px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '4px',
            fontFamily: 'AvenirNextRoundedPro',
            color: '#555',
            display: 'block',
            padding: '0 10px',
        }}
        onClick={() => {location.href='/login';}}
    >Đăng nhập</button>
    :
    <button
        style={{
            height: '30px',
            lineHeight: '25px',
            border: 'none',
            fontSize: '15px',
            borderRadius: '4px',
            // background: 'rgba(55, 53, 47, 0.08)',
            fontFamily: 'AvenirNextRoundedPro-Medium',
        }}
        className="button-list"
        onClick={this.onClickSignOut}
    >Đăng xuất</button>}
            </div>
          </div>
        </div>
      </div>;
    }
}

export default withRouter(TopMenu as any);