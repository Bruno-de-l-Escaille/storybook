import React, { Component } from "react";

import styles from "./MultiSwitch.module.scss";

export default class MultiSwitchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: this.props.selectedValue || this.props.vals[0],
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.selectedOption != nextProps.selectedValue) {
            this.setState({ selectedOption: nextProps.selectedValue });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.selectedValue !== this.props.selectedValue) {
            this.setState({
                selectedOption: nextProps.selectedValue,
            });
        }
    }

    handleChange = (e) => {
        const val = e.target.value;
        const { afterChange } = this.props;
        this.setState({ selectedOption: val });
        afterChange(val);
    };

    render() {
        let { labels, vals, name, title } = this.props;
        const { selectedOption } = this.state;

        if (!labels || labels.length === 0) {
            return null;
        }

        let returnDiv = [];
        for (let i = 0; i < labels.length; i++) {
            returnDiv.push(
                <li key={`switch-${vals[i]}`} className={styles.item}>
                    <span className={styles.itemLabel}>{labels[i]}</span>

                    <label>
                        <input
                            value={vals[i]}
                            name={name}
                            checked={selectedOption === vals[i]}
                            onChange={this.handleChange.bind(this)}
                            className={styles.switch}
                            type="radio"
                        />
                        <div className="switch-frame">
                            <div className="switch-handle" />
                        </div>
                    </label>
                </li>
            );
        }

        return (
            <div className={styles.switches}>
                {title && <strong>{title}</strong>}
                <ul>{returnDiv}</ul>
            </div>
        );
    }
}
