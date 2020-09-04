import * as React from 'react';
import Loader from '@Components/shared/Loader';
import { throttle } from 'lodash';
import clonePseudoElements from 'htmltoimage/clonePseudoElements';
import ReactDOM from 'react-dom';

export interface InfiniteScrollProps {
  /**
   * Does the resource have more entities
   */
  hasMore: boolean;

  /**
   * Should show loading
   */
  isLoading: boolean;

  /**
   * Callback to load more entities
   */
  onLoadMore: () => void;

  /**
   * Scroll threshold
   */
  threshold?: number;

  /**
   * Throttle rate
   */
  throttle?: number;

  /** Children */
  children?: any;

  /**
   * Callback for convenient inline rendering and wrapping
   */
  render?: (a: object) => any;

  /**
   * A React component to act as wrapper
   */
  component?: any;

  scroll: boolean;

  loaderBlack: boolean;

  refId: string;

  marginTop: number;
}

interface IState {
    yLocation: number;
    showLeft: boolean;
    showRight: boolean;
}

export class InfiniteScroll extends React.PureComponent<InfiniteScrollProps, IState> {
  public static defaultProps: Pick<InfiniteScrollProps, 'threshold' | 'throttle' | 'loaderBlack'> = {
    threshold: 100,
    throttle: 64,
    loaderBlack: false,
  };
  private sentinel: HTMLElement;
  private containerSroll: HTMLDivElement;
  private scrollHandler: () => void;
  private resizeHandler: () => void;
  private loadMore: () => void;

  state = {
      yLocation: 0,
      showLeft: false,
      showRight: true,
  };

  componentDidMount() {
    this.scrollHandler = throttle(this.checkWindowScroll.bind(this), this.props.throttle);
    this.loadMore = throttle(this.props.onLoadMore, this.props.throttle);

    this.containerSroll.addEventListener('scroll', this.scrollHandler);
    this.sentinel = document.getElementById(this.props.refId);
  }

  componentDidUpdate() {
    console.log('this.containerSroll.scrollWidth ', this.containerSroll.scrollWidth);
    console.log('this.containerSroll.clientWidth ', this.containerSroll.clientWidth);
    console.log('this.containerScroll ', this.containerSroll);
    // if (this.containerSroll.scrollWidth == this.containerSroll.clientWidth) {
    //   this.setState({showRight: false});
    // }
    // this.containerSroll.scrollLeft -= 1;

    // console.log(ReactDOM.findDOMNode(this.props.children));

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }

  checkWindowScroll = () => {
    console.log('checkWindowScroll',this.containerSroll.scrollLeft )
    this.setState({yLocation: this.containerSroll.scrollLeft});

    if (this.containerSroll.scrollLeft == 0) {
      console.log('alo')
      this.setState({showLeft: false});
    } else {
      this.setState({showLeft: true});
    }

    if (this.containerSroll.offsetWidth + this.containerSroll.scrollLeft >= this.containerSroll.scrollWidth) {
        this.setState({showRight: false,});
    } else {
        this.setState({showRight: true,});
    }


    if (this.props.isLoading) {
      return;
    }

    if (!this.sentinel) {
      this.sentinel = document.getElementById(this.props.refId);
    }

    console.log('sentinel ', this.sentinel, this.sentinel.getBoundingClientRect().left - window.innerWidth)

    if (
      this.props.hasMore &&
      this.sentinel &&
    //   this.sentinel.getBoundingClientRect().left - window.innerWidth <
    //   this.props.threshold
      window.innerWidth - 80 - this.sentinel.getBoundingClientRect().left > 0
    ) {
      this.loadMore();
    }
  }

  render() {
    const sentinel = <div ref={i => {this.sentinel = i}} />;
    if(this.props.render) {
      return this.props.render({
        sentinel,
        children: this.props.children
      });
    }

    if(this.props.component) {
      const Container = this.props.component;
      return (
        <Container sentinel={sentinel}>
          {this.props.children}
        </Container>
      );
    }

    return (
      <div 
        id="object-container" 
        ref={i => this.containerSroll = i} 
        style={{
          height: "calc(100% + 50px)",
          // marginTop: this.props.marginTop * 1 + "px", 
          overflowX: "scroll",
          scrollBehavior: "smooth",
        }}>
            {this.state.showLeft && <button 
                        style={{
                            position: 'absolute',
                            top: '80px',
                            zIndex: 100,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            left: '-21px',
                            border: 'none',
                            background: 'white',
                        }} 
                        onClick={(e) => {
                            this.containerSroll.scrollLeft -= 700;
                            this.setState({yLocation: this.state.yLocation - 700});
                        }}
                        className="arrowWrapper___rLMf7 arrowLeft___2lAV4" 
                        data-categ="popularTemplates" 
                        data-value="btn_sliderLeft"
                    >
                        <svg 
                            style={{ transform: 'rotate(180deg)' }} 
                            viewBox="0 0 16 16" 
                            width="16" 
                            height="16" 
                            className="arrow___2yMKk"
                        >
                            <path d="M12.2339 8.7917L5.35411 15.6711C4.91648 16.109 4.20692 16.109 3.7695 15.6711C3.33204 15.2337 3.33204 14.5242 3.7695 14.0868L9.85703 7.99952L3.76968 1.91249C3.33222 1.47486 3.33222 0.765428 3.76968 0.327977C4.20714 -0.109651 4.91665 -0.109651 5.35429 0.327977L12.234 7.20751C12.4528 7.42634 12.562 7.71284 12.562 7.99948C12.562 8.28627 12.4526 8.57298 12.2339 8.7917Z"></path>
                        </svg>
                    </button>}
                    {this.props.children}
                    {this.state.showRight && <button 
                        style={{
                            position: 'absolute',
                            top: '80px',
                            zIndex: 100,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            right: '-21px',
                            border: 'none',
                            background: 'white',
                        }} 
                        onClick={(e) => {
                            this.containerSroll.scrollLeft += 700;
                            this.setState({yLocation: this.state.yLocation + 700});
                        }}
                        className="arrowWrapper___rLMf7 arrowLeft___2lAV4" 
                        data-categ="popularTemplates" 
                        data-value="btn_sliderLeft"
                    >
                        <svg 
                            style={{
                                // transform: 'rotate(180deg)',
                            }} 
                            viewBox="0 0 16 16" 
                            width="16" 
                            height="16" 
                            className="arrow___2yMKk"
                        >
                            <path d="M12.2339 8.7917L5.35411 15.6711C4.91648 16.109 4.20692 16.109 3.7695 15.6711C3.33204 15.2337 3.33204 14.5242 3.7695 14.0868L9.85703 7.99952L3.76968 1.91249C3.33222 1.47486 3.33222 0.765428 3.76968 0.327977C4.20714 -0.109651 4.91665 -0.109651 5.35429 0.327977L12.234 7.20751C12.4528 7.42634 12.562 7.71284 12.562 7.99948C12.562 8.28627 12.4526 8.57298 12.2339 8.7917Z"></path>
                        </svg>
                    </button>}
      </div>
    );
  }
}

export default InfiniteScroll;