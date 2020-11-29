import * as React from "react";
import Home from "@Components/shared/svgs/HomeIcon";
import editorStore from "@Store/EditorStore";
import uuidv4 from "uuid/v4";

interface IProps {
    translate: any;
}

interface IState {
}

export default class HomeButton extends React.Component<IProps, IState> {

  state = {
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
        <div
            style={{
                display: "flex",
                height: "100%",
            }}>
            <a
                id="logo-editor"
                style={{
                    color: "white",
                    display: "flex",
                    padding: "5px 14px",
                    borderRadius: "3px",
                    marginLeft: "5px",
                    textDecoration: "none",
                }}
                href="/"
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "15px",
                        fontWeight: 600,
                        height: "100%",
                        position: "relative",
                    }}
                >
                    <span
                        style={{
                            marginRight: "5px",
                        }}
                    >
                        <Home width="24px" height="24px" />
                    </span>
                    <span
                        style={{
                            display: "block",
                            right: 0,
                            fontSize: "15px",
                            fontWeight: 500,
                        }}
                    >{this.props.translate("home")}</span>
                </div>
            </a>
            <div
                id="logo-editor"
                style={{
                    color: "white",
                    display: "flex",
                    padding: "5px 14px",
                    position: "relative",
                    borderRadius: "3px",
                    marginLeft: "5px",
                    textDecoration: "none",
                }}
            >
                <a
                    style={{
                        color: "white",
                        textDecoration: "none",
                    }}
                    href="javascript:"
                    onClick={e => {
                        document.getElementById("myResizeList").classList.toggle("show");
                
                        const onDown = e => {
                            if (!document.getElementById("myResizeList").contains(e.target)) {
                                // if (!e.target.matches(".dropbtn-font-size")) {
                                let dropdowns = document.getElementsByClassName(
                                    "dropdown-content-font-size"
                                );
                                let i;
                                for (i = 0; i < dropdowns.length; i++) {
                                    let openDropdown = dropdowns[i];
                                    if (openDropdown.classList.contains("show")) {
                                        openDropdown.classList.remove("show");
                                    }
                                }
                    
                                document.removeEventListener("mouseup", onDown);
                            }
                        };
                
                        document.addEventListener("mouseup", onDown);
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "15px",
                            fontWeight: 600,
                            height: "100%",
                            position: "relative",
                        }}
                    >
                        Resize
                    </div>
                </a>
            <div
                id="myResizeList"
                style={{
                    left: "5px",
                    zIndex: 9999999999,
                    background: "white",
                    display: "none" ,
                    color: "black",
                    flexDirection: "column",
                    padding: "20px",
                }}
                className="dropdown-content-font-size dropbtn-font-size"
            >
                <form style={{margin: 0,}} action="/action_page.php">
                    <input style={{margin: "15px 10px",}} type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                    <span>Menu</span>
                    <br/>
                    <input style={{margin: "15px 10px",}} type="checkbox" id="vehicle2" name="vehicle2" value="Car"/>
                    <span>Instagram Post</span>
                    <br/>
                    <input style={{margin: "15px 10px",}} type="checkbox" id="vehicle3" name="vehicle3" value="Boat"/>
                    <span>Facebook Post</span>
                    <br/>
                </form>
                <button
                    onClick={e => {
                        const images = Array.from(editorStore.images2.values());
                        localStorage.setItem("items", JSON.stringify(images));
                        const url = `/editor/${uuidv4()}/resize/6`;
                        window.open(url);
                    }}
                    style={{
                        width: "100px",
                        border: "none",
                        background: "#80808030",
                        padding: "7px 12px",
                        borderRadius: "5px",
                        marginTop: "10px",
                        marginLeft: "9px",
                    }}
                >Resize</button>
            </div>
            </div>
            <p
                id="savingState"
                style={{
                    color: "hsla(0,0%,100%,.5)",
                    fontStyle: "italic",
                    margin: "auto",
                    marginLeft: "20px",
                    fontSize: "14px",
                    fontWeight: 400,
                }}
            >{this.props.translate("allChangesSaved")}</p>
        </div>
    );
  }
}
