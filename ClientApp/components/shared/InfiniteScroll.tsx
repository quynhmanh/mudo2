import * as React from 'react';
import Loader from '@Components/shared/Loader';
import { throttle, delay, debounce, } from 'lodash';
import clonePseudoElements from 'htmltoimage/clonePseudoElements';

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

export class InfiniteScroll extends React.PureComponent<InfiniteScrollProps, {}> {
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

    componentDidMount() {
        this.scrollHandler = debounce(this.checkWindowScroll.bind(this), this.props.throttle);
        this.resizeHandler = debounce(this.checkWindowScroll.bind(this), this.props.throttle);
        this.loadMore = debounce(this.props.onLoadMore, this.props.throttle);

        document.addEventListener('scroll', this.scrollHandler);
        // window.addEventListener('resize', this.resizeHandler);
        this.containerSroll.addEventListener('scroll', this.scrollHandler);

        this.sentinel = document.getElementById(this.props.refId);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('resize', this.resizeHandler);
    }

    checkWindowScroll = () => {
        if (this.props.isLoading) {
            return;
        }

        if (!this.sentinel) {
            this.sentinel = document.getElementById(this.props.refId);
        }
        if (
            this.props.hasMore &&
            this.sentinel &&
            this.sentinel.getBoundingClientRect().top - window.innerHeight < this.props.threshold
        ) {
            this.loadMore();
        }
    }

    render() {
        const sentinel = <div ref={i => { this.sentinel = i }} />;
        if (this.props.render) {
            return this.props.render({
                sentinel,
                children: this.props.children
            });
        }

        if (this.props.component) {
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
                    height: `calc(100% - ${(this.props.marginTop * 1)}px)`,
                    marginTop: this.props.marginTop * 1 + "px",
                    overflow: this.props.scroll && 'overlay',
                    overflowX: this.props.scroll ? "hidden" : 'visible',
                }}>
                {this.props.children}
                {/* {<div style={{marginBottom: '10px', height: '10%', color: 'white', position: 'relative'}} ref={i => this.sentinel = i}><Loader show={true} black={this.props.loaderBlack} /></div>} */}
            </div>
        );
    }
}

export default InfiniteScroll;