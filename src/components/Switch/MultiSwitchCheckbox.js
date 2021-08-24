import React, { Component } from "react";
import styles from "./MultiSwitch.module.scss";
import classnames from "classnames";

export default class MultiSwitchCheckbox extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            isChecked : props.isChecked,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      
        if (this.state.isChecked !== nextProps.isChecked) {
            this.setState({ isChecked: !this.state.isChecked });
        }
      
    }



    render() {
        let { labels, vals, name, title } = this.props;
        if (!labels || labels.length === 0) {
            return null;
        }

        let returnDiv = [];
        for (let i = 0; i < labels.length; i++) {
            returnDiv.push(
                <li key={`switch-${vals[i]}`} className={styles.item }>
                    <span className={ styles.itemLabel }>{labels[i]}</span>

                    <label>
                        <input
                            value={vals[i]}
                            name={name}
                            checked={this.state.isChecked[i]}
                            onChange={this._handleChange.bind(this, i, vals[i])}
                            className={styles.switch}
                            type="checkbox"
                        />
                        <div className="switch-frame">
                            <div className="switch-handle" />
                        </div>
                    </label>
                </li>
            );
        }

        return (
            <div className={classnames(styles.switches, this.props.isDark ? styles.switchesdark : "")}>
               <div className={ styles.title }>  {title && <strong>{title}</strong>} </div>
                <ul>{returnDiv}</ul>
                <br/>
            </div>
       );
    }

    _handleChange(i, val) {
        
        let tab = this.state.isChecked;
        tab[i]= !tab[i];
        this.setState({ isChecked : tab }, function () {
            this.props.onChange(val + " : "+this.state.isChecked[i]);
        });
    }
}

