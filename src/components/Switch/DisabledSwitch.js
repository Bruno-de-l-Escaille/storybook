import React, { Component } from "react";
import styles from "./MultiSwitch.module.scss";
import classnames from "classnames";

export default class DisabledSwitch extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { name } = this.props;
        return (
            
            <div className={classnames(styles.switches, this.props.isDark ? styles.switchesdark : "")}>
            <br/>
            <div className={styles.item}>  
                <span className={styles.itemLabel}>Profil public</span>
                <label>
                    <input
                        ref="switch"
                        name={name}
                        checked={this.props.isChecked}
                        onChange={this._handleChange.bind(this)}
                        className={styles.switch}
                        type="checkbox"
                    />
                    <div className="switch-frame">
                        <div className="switch-handle" />
                    </div>
                    
                </label>
                 
            </div>
            <br/>
            </div>
        );
    }

    _handleChange() {}
}
