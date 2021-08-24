import React, { Component } from "react";
import styles from "./MultiSwitch.module.scss";
import classnames from "classnames";

export default class MultiSwitchAll extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            isChecked : props.isChecked,
            isAllChecked: false,
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
       returnDiv.push(
            <li className={styles.item }>
                 <span className={ styles.itemLabel }>Tous</span>
                 <label>
                        <input
                            value="all"
                            name="all"
                            checked={this.state.isAllChecked}
                            onChange={this._changeAll.bind(this)}
                            className={styles.switch}
                            type="checkbox"
                        />
                        <div className="switch-frame">
                            <div className="switch-handle" />
                        </div>
                </label>
            </li>
       );
        for (let i = 0; i < labels.length; i++) {
            returnDiv.push(
                <li key={`switch-${vals[i]}`} className={ styles.item }>
                    <span className={ styles.itemLabel}>{labels[i]}</span>

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
                <ul>
                {returnDiv}
                </ul>
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
        let flag=true;
        for(let i=0; i<this.state.isChecked.length; i++){
              if(!this.state.isChecked[i]){
                 flag=false;
             }
        }
        if(flag) this.setState({ isAllChecked : true });
        else     this.setState({ isAllChecked : false });

    }

     _changeAll() {
        this.setState({ isAllChecked : !this.state.isAllChecked }, function () {
            this.props.onChange(this.state.isAllChecked);
        });

        if(!this.state.isAllChecked){
            let data=this.state.isChecked;
            for(let i=0; i<data.length; i++ ){
                data[i]=true;
            }
            this.setState({ isChecked : data });
        }

        else{
             let data=this.state.isChecked;
            for(let i=0; i<data.length; i++ ){
                data[i]=false;
            }
            this.setState({ isChecked : data });

        }
    }
}

