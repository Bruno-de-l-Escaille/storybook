import React, { Component } from "react";
import styles from "./MultiSwitch.module.scss";
import classnames from "classnames";

export default class Switch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
        };
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
                            checked={this.state.isChecked}
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

    _handleChange() {
         this.setState({ isChecked: !this.state.isChecked }, function () {
            this.props.onChange(this.state.isChecked);
        });
    }
}

