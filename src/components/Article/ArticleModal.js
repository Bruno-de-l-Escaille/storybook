import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";

import styles from "./Article.module.scss";

const customStyles = {
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "none",
    overflow: "none",
    padding: 0,
    top: "5%",
    left: "5%",
    right: "5%",
    bottom: "5%",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px rgba(41, 57, 77, 0.04)",
  },
};

export class ArticleModal extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }
  render() {
    const { article, showModal } = this.props;
    if (!showModal) {
      return false;
    }
    return (
      <div>
        {/* <button onClick={this.handleOpenModal}>Trigger Modal</button> */}
        <Modal isOpen={showModal} contentLabel="Minimal Modal Example">
          <button onClick={this.handleCloseModal}>Close Modal</button>
          <div>Content</div>
        </Modal>
      </div>
    );
  }
}

ArticleModal.propTypes = {
  showModal: PropTypes.bool,
};
ArticleModal.defaultProps = {
  showModal: false,
};
