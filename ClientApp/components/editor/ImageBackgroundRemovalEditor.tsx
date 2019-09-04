import React, {PureComponent} from 'react';  
import styled, {createGlobalStyle} from 'styled-components';
import axios from 'axios';
import { Helmet } from "react-helmet";
import Globals from '@Globals';

export interface IProps {
  }
  
  interface IState {
      res: any;
      res2: any;
      mediaId: string;
      width: number;
      height: number;
      scale: number;
      brushSize: number;
  }

class MediaEditPopup extends PureComponent<IProps, IState> {
    state = {
        res: null,
        res2: null,
        width: 600,
        height: 400,
        scale: 1,
        brushSize: 0.5,
        mediaId: "",
    }
    
    componentDidMount = () => {
    var self = this;
    var mediaId = this.props.match.params.media_id;
    this.setState({mediaId});
        var strokeWidth = 8;
var bufferSize;

var svgElement = svgElement = document.getElementById("svgElement");
var rect;
var path = null;
var strPath;
var buffer = []; // Contains the last positions of the mouse cursor

var cursor = document.getElementById("cursor");

cursor.addEventListener("mousedown", function (e) {
    var getMousePosition = function (e) {
        return {
            x: (e.pageX - rect.left) / self.state.scale,
            y: (e.pageY - rect.top) / self.state.scale,
        }
    };

    rect = svgElement.getBoundingClientRect();
    console.log('mouseDOwn');
    bufferSize = document.getElementById("cmbBufferSize").value;
    path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#000");
    path.setAttribute("stroke-width", 8 * self.state.brushSize);
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
    buffer = [];
    var pt = getMousePosition(e);
    appendToBuffer(pt);
    strPath = + pt.x + "," + pt.y + " ";
    path.setAttribute("d", strPath);
    svgElement.firstChild.firstChild.appendChild(path);
    updateSvgPath();

    svgElement.addEventListener("mousemove", function (e) {
        console.log('mousemove ')
        if (path) {
            appendToBuffer(getMousePosition(e));
            updateSvgPath();
        }
    });

    cursor.addEventListener("mouseup", function () {
        console.log('mouseup');
        if (path) {
            path = null;
        }
    });
});

svgElement.addEventListener("mousedown", function (e) {
    console.log('eeee e', e, rect);
    var getMousePosition = function (e) {
        return {
            x: (e.pageX - rect.left) / self.state.scale,
            y: (e.pageY - rect.top) / self.state.scale,
        }
    };
    rect = svgElement.getBoundingClientRect();
    console.log('mouseDOwn');
    bufferSize = document.getElementById("cmbBufferSize").value;
    path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#000");
    path.setAttribute("stroke-width",  8 * self.state.brushSize);
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
    buffer = [];
    var pt = getMousePosition(e);
    console.log('point ', pt);
    appendToBuffer(pt);
    strPath = + pt.x + "," + pt.y + " ";
    path.setAttribute("d", strPath);
    svgElement.firstChild.firstChild.appendChild(path);
    updateSvgPath();

    svgElement.addEventListener("mousemove", function (e) {
        console.log('mousemove ')
        if (path) {
            appendToBuffer(getMousePosition(e));
            updateSvgPath();
        }
    });

    svgElement.addEventListener("mouseup", function () {
        if (path) {
            path = null;
        }
    });
});

svgElement.addEventListener("mouseenter", function (e) {
    var mousemove = (e) => {
        document.getElementById("cursor").style.left = e.clientX + "px";
        document.getElementById("cursor").style.top = e.clientY + "px";
    }
    
    document.addEventListener("mousemove", mousemove);

    svgElement.addEventListener("mouseleave", function (e) {
        document.removeEventListener("mousemove", mousemove);
    });
});

// svgElement.addEventListener("mousemove", function (e) {
//     if (path) {
//         appendToBuffer(getMousePosition(e));
//         updateSvgPath();
//     }
// });

// svgElement.addEventListener("mouseup", function () {
//     if (path) {
//         path = null;
//     }
// });

// var getMousePosition = function (e) {
//     return {
//         x: e.pageX - rect.left,
//         y: e.pageY - rect.top
//     }
// };

var appendToBuffer = function (pt) {
    buffer.push(pt);
    while (buffer.length > bufferSize) {
        buffer.shift();
    }
};

// Calculate the average point, starting at offset in the buffer
var getAveragePoint = function (offset) {
    var len = buffer.length;
    if (len % 2 === 1 || len >= bufferSize) {
        var totalX = 0;
        var totalY = 0;
        var pt, i;
        var count = 0;
        for (i = offset; i < len; i++) {
            count++;
            pt = buffer[i];
            totalX += pt.x;
            totalY += pt.y;
        }
        return {
            x: totalX / count,
            y: totalY / count
        }
    }
    return null;
};

var updateSvgPath = function () {
    var pt = getAveragePoint(0);

    if (pt) {
        // Get the smoothed part of the path that will not change
        strPath += pt.x + "," + pt.y + " ";

        // Get the last part of the path (close to the current mouse position)
        // This part will change if the mouse moves again
        var tmpPath = "";
        for (var offset = 2; offset < buffer.length; offset += 2) {
            pt = getAveragePoint(offset);
            tmpPath += pt.x + "," + pt.y + " ";
        }

        // Set the complete current path coordinates
        path.setAttribute("points", strPath + tmpPath);
    }
};

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  
  var res;
  var self = this;
  toDataURL(`https://localhost:64099/images/${mediaId}.jpg`, function(dataUrl) {
    // console.log('RESULT:', dataUrl)
    self.setState({res: dataUrl})
  })

  toDataURL(`https://localhost:64099/images/${mediaId}_removebackground.png`, function(dataUrl) {
    // console.log('RESULT:', dataUrl)
    self.setState({res2: dataUrl})
  })

  var knob = document.getElementById('knob');
    knob.addEventListener('mousedown', function(e) {
        var startX = e.pageX;
        var startY = e.pageY;
        var brushSize = self.state.brushSize;

        var onMove = function(e) {
            var deltaX = e.pageX - startX;
            var deltaY = e.pageY - startY;
            console.log('deltaX ', deltaX);
            console.log('deltaY ', deltaY);
            var newBrushSize = brushSize + deltaX / 300 * 5;
            self.setState({brushSize: newBrushSize});
        }

        var onUp = function(e) {

            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    })

    }

    handleAddNewKeyword = () => {
        var keywords = [...this.state.keywords, ""];
        this.setState({keywords});
    }

    handleSubmit = () => {
        var url = `/api/Media/Edit`;
        axios.post(url, {title: this.ref.innerHTML, id: this.props.item.id, keywords: this.state.keywords })
            .then(res => {
                if (res.status === 200) {
                    this.props.closePopup();
                }
            });
    }

    handleDeleteTemplate = () => {
        var url = `/api/Media/Delete?id=${this.props.item.id}`;
        axios.delete(url);
    }

    handleKeywordChanged = (index, e) => {
        var keywords = this.state.keywords.map((kw, id) => {
            if (id === index) {
                return e.target.value;
            }
            return kw;
        });

        this.setState({keywords});
    }

    handleRemove = (index, e) => {
        var keywords = this.state.keywords.filter((kw, id) => id !== index);
        this.setState({keywords});
    }

    ref = null;

    handleZoomIn = (e) => {
        var scale = this.state.scale;
        scale = scale + 0.1;
        var width = this.state.width / this.state.scale * scale;
        var height = this.state.height / this.state.scale * scale;
        this.setState({width, height, scale});
    }

    handleZoomOut = (e) => {
        var scale = this.state.scale;
        scale = scale - 0.1;
        var width = this.state.width / this.state.scale * scale;
        var height = this.state.height / this.state.scale * scale;
        this.setState({width, height, scale});
    }

    handleSave = (e) => {
        var self = this;``
        var svgImage = document.getElementById("svgElement");
        var s = new XMLSerializer().serializeToString(svgImage);

      var url = `/api/Media/Add`;
      var i = new Image(); 

      var encodedData = window.btoa(s);

        axios.post(url, {id: self.state.mediaId, ext: "svg", userEmail: Globals.serviceUser.username, color: 'white', data: encodedData, width: i.width, height: i.height, type: 8, keywords: ["123", "123"], title: 'Manh quynh'})
        .then(() => {
          // url = `/api/Font/Search`;
          // fetch(url, {
          //   mode: 'cors'
          // })
          //   .then(response => response.text())
          //   .then(html => {
          //     var fontsList = JSON.parse(html).value;
          //     self.setState({ fontsList });
          //   });
        });
    }

  render() {  

      console.log('render ');
      
        return (<div>
            <Helmet>
              <title>Home page - RCB (TypeScript)</title>
            </Helmet>
            
          <div className="container"><div className='unblurred'><div className='unblurred' id="divSmoothingFactor">
            <div
                style={{
                    marginTop: '10px',
                    background: 'white',
                    padding: '10px',
                    marginBottom: '10px',
                }}
            >
            <label className='unblurred' for="cmbBufferSize">Buffer size:</label>
            <select id="cmbBufferSize">
                <option value="1">1 - No smoothing</option>
                <option value="4">4 - Sharp curves</option>
                <option value="8" selected="selected">8 - Smooth curves</option>
                <option value="12">12 - Very smooth curves</option>
                <option value="16">16 - Super smooth curves</option>
                <option value="20">20 - Hyper smooth curves</option>
            </select>
        <div><div>
              Kích cỡ cây cọ
            </div> <div style={{
                position: 'relative',
                height: '30px',    
                width: '300px',
            }} className="editor-slider">
                <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    marginTop: '-4px',
                    border: '1px solid #fff',
                    height: '8px',
                    borderRadius: '4px',
                }} className="bar"></div> 
                <div className="filler"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '50%',
                        marginTop: '-4px',
                        border: '1px solid #fff',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: '8d8d8d',
                        width: this.state.brushSize * 100 / 5 + '%',
                    }}
                ></div> 
                <div className="knob" id="knob"
                    style={{
                        position: 'absolute',
                        top: 0,
                        zIndex: 100,
                        height: '30px',
                        width: '30px',
                        marginLeft: '-15px',
                        borderRadius: '15px',
                        left: this.state.brushSize * 100 / 5 + '%',
                        background: '#585858',
                    }}
                ></div>
            </div></div>
            <button onClick={this.handleSave.bind(this)}>Save</button>
        <div style={{
            position: 'absolute',
            width: `${8 * this.state.scale * this.state.brushSize}px`,
            height: `${8 * this.state.scale * this.state.brushSize}px`,
            border: '1px solid rgba(0,0,0,.5)',
            top: 0,
            zIndex: 1,
            marginLeft: `-${8 * this.state.scale * this.state.brushSize / 2}px`,
            marginTop: `-${8 * this.state.scale * this.state.brushSize / 2}px`,
            borderRadius: '50%',
            pointerEvents: 'none',
        }} id="cursor"></div>

      <div data-v-f65674dc className="editor-upper-controls"><button data-v-f65674dc title="Close" className="editor-button close-button"><i data-v-f65674dc className="icon-cross" /></button> <div data-v-f65674dc className="editor-button-group hidden-xs"><button onClick={this.handleZoomOut.bind(this)} data-v-f65674dc title="Zoom out" className="editor-button zoom-out-button"><i data-v-f65674dc className="icon-minus" />-</button> <button data-v-f65674dc title="Set zoom to 100%" className="editor-button zoom-restore-button">
            180%
          </button> <button onClick={this.handleZoomIn.bind(this)} data-v-f65674dc title="Zoom in" className="editor-button zoom-in-button"><i data-v-f65674dc className="icon-plus" />+</button></div> <div data-v-f65674dc className="editor-button-group"><button data-v-f65674dc title="Undo" className="editor-button undo-button"><i data-v-f65674dc className="icon-undo2" /></button> <button data-v-f65674dc title="Redo" disabled="disabled" className="editor-button redo-button"><i data-v-f65674dc className="icon-redo2" /></button></div> <button data-v-f65674dc title="Download" className="editor-button download-button hidden-sm hidden-md hidden-lg"><i data-v-f65674dc className="icon-download2" /></button></div>
      
        <div
            style={{
                width: this.state.width + 'px',
                height: this.state.height + 'px',
                overflow: 'hidden',
                backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA3LjkzNyA3LjkzOCcgaGVpZ2h0PSczMCcgd2lkdGg9JzMwJz48ZyBmaWxsPScjYzZkNWU5Jz48cGF0aCBwYWludC1vcmRlcj0nc3Ryb2tlIGZpbGwgbWFya2VycycgZD0nTS4wMTQuMDE0SDMuOTdWMy45N0guMDE0ek0zLjk3IDMuOTY4aDMuOTU0djMuOTU1SDMuOTd6Jy8+PC9nPjwvc3ZnPgo=")`,
            }}
        >
        <svg 
            style={{
                width: this.state.width + 'px',
                height: this.state.height + 'px',
            }}
            id="svg" className='unblurred' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="svgElement" x="0px" y="0px" width="600px" height="400px" viewBox="0 0 600 400" enable-background="new 0 0 600 400" xmlSpace="preserve">
          <defs>
              <mask id="myCircle">
                <image style={{
                    width: "500px",
                }} href={this.state.res2} />
              </mask>
          </defs>
          <image className='unblurred' mask="url(#myCircle)" style={{width: "500px",}} href={this.state.res}/>
        </svg>
        </div>
        <canvas id="canvas"/>
        </div>
        </div>
        </div>
        </div>
        </div>);  
    }  
}  

export default MediaEditPopup;