import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import AppComponent from "@Components/shared/AppComponent";


export interface IProps {
    collapsed: boolean,
    defaultCollapsed: boolean,
    nodeLabel: string,
    className: string,
    itemClassName: string,
    childrenClassName: string,
    treeViewClassName: string, 
    onClick: any;
    childs: any;
    path: string;
}

export interface IState {
    collapsed: boolean;
}


class TreeView extends AppComponent<IProps, IState> {
  
  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.defaultCollapsed
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(...args) {
    this.setState({ collapsed: !this.state.collapsed });
    if (this.props.onClick) {
      this.props.onClick(...args);
    }
  }

  render() {
    const {
      collapsed = this.state.collapsed,
      className = '',
      itemClassName = '',
      treeViewClassName = '',
      childrenClassName = '',
      nodeLabel,
      children,
      defaultCollapsed,
      ...rest
    } = this.props;

    let arrowClassName = 'tree-view_arrow';
    let containerClassName = 'tree-view_children';
    if (collapsed) {
      arrowClassName += ' tree-view_arrow-collapsed';
      containerClassName += ' tree-view_children-collapsed';
    }

    const arrow = (
      <div
        {...rest}
        className={className + ' ' + arrowClassName}
        onClick={this.handleClick}
      />
    );

    return (
      <div className={'tree-view ' + treeViewClassName}>
          <Link replace={false} key={this.props.path} to={this.props.path}>
        <div className={'tree-view_item ' + itemClassName}>
          {arrow}
          {nodeLabel}
        </div>
        </Link>

        <div className={containerClassName + ' ' + childrenClassName}>
          {collapsed ? null : children}
        </div>
        {!collapsed && this.props.childs && this.props.childs.map(child =>
            <div style={{marginLeft: '10px'}}>
                <TreeView path={child.path} childs={child.childs} collapsed={false} defaultCollapsed={true} nodeLabel={child.title} className="asd" itemClassName="asd" childrenClassName="asd" treeViewClassName="ads" onClick={null}>
                </TreeView>
            </div>
        )
        }
      </div>
    );
  }
}

export default TreeView;