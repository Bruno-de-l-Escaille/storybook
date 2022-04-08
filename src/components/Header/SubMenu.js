import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import style from "./SubMenu.module.scss";

export class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVertical: false,
    };
  }

  handleOnClick = () => {
    this.setState({ isVertical: !this.state.isVertical });
  };

  renderItemMenu = (item) => {
    const { Link } = this.props;
    return (
      <li
        key={`smenu-${Math.random()}`}
        className={`${style.item} ${item.className ? item.className : ""} `}
      >
        <img src={item.iconUrl} />
        {Link ? (
          <Link href={item.url}>
            <a>{item.title}</a>
          </Link>
        ) : (
          <RouterLink to={item.url}>{item.title} </RouterLink>
        )}
      </li>
    );
  };

  renderItemMenuWithSubmenu = (item) => {
    const { Link } = this.props;

    return (
      <li className={style.dropdown} key={`smenu-${Math.random()}`}>
        <RouterLink to={item.url} className={style.item}>
          <img src={item.iconUrl} />
          <a className={style.title}>{item.title}</a>
          <i className="icon-sb-arrow-down"></i>
        </RouterLink>
        <div>
          <ul>{this.renderSubmenu(item.submenu)}</ul>
          {item.more &&
            (Link ? (
              <Link href={item.more.url}>
                <a className={style.more}>{item.more.title}</a>
              </Link>
            ) : (
              <RouterLink to={item.more.url} className={style.more}>
                {item.more.title}
              </RouterLink>
            ))}
        </div>
      </li>
    );
  };

  renderSubmenu = (data) => {
    const { Link } = this.props;
    return data.map((item) => (
      <li key={`smenu-${Math.random()}`}>
        <div
          className={
            this.state.isVertical ? style.subitemvertical : style.subitem
          }
        >
          {item.avatarUrl && (
            <img className={style.avatar} src={item.avatarUrl} />
          )}
          {item.iconUrl && <img src={item.iconUrl} />}

          {Link ? (
            <Link href={item.url}>
              <a>{item.title}</a>
            </Link>
          ) : (
            <RouterLink to={item.url}>{item.title} </RouterLink>
          )}
        </div>
      </li>
    ));
  };

  render() {
    const { menu, currentCommunity } = this.props;
    return menu.length === 0 ? (
      this.props.children
    ) : (
      <div className={this.state.isVertical ? style.vertical : ""}>
        <nav className={style.container}>
          <span className={style.control} onClick={() => this.handleOnClick()}>
            {this.state.isVertical ? (
              <>
                <i className="icon-sb-menu hide-for-small-only"></i>
                <i className="icon-sb-close show-for-small-only"></i>
              </>
            ) : (
              <i className="icon-sb-menu"></i>
            )}
          </span>

          <ul className={style.menu}>
            {menu.map((item) => {
              if (!item.community || (item.community && currentCommunity))
                return item.submenu
                  ? this.renderItemMenuWithSubmenu(item)
                  : this.renderItemMenu(item);
              else return null;
            })}
          </ul>
        </nav>
        <div className={style.content}>{this.props.children}</div>
      </div>
    );
  }
}
