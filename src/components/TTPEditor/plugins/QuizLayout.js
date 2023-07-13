import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import IconClose from "../../Icons/IconClose";

import { I18N } from "../../../i18n";
import styles from "./QuizLayout.module.scss";

const QuizLayout = ({
  isOpen,
  onCancel,
  lng,
  body = "",
  questions = [],
  setContent,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const tab = [];
    questions.forEach((question) => {
      tab.push({ ...question, answer: question.type === "TEXT" ? "" : [] });
    });
    setData(tab);
  }, []);

  const handleChange = (questionKey, content) => {
    const tab = data.map((question) => {
      if (question.key === questionKey) {
        question.answer = content;
      }
      return question;
    });
    setData(tab);
  };

  const handleChoiceChange = (questionKey, checked, value) => {
    const tab = data.map((question) => {
      if (question.key === questionKey) {
        checked
          ? question.answer.push(value)
          : question.answer.filter((i) => i !== value);
      }
      return question;
    });
    setData(tab);
  };

  const handlePaste = (event, cleanData, maxCharCount, core) => {
    let content = cleanData.replace(/\s+style="[^"]*"/gi, "");
    return content.replace(/(<\/?h)([0-1])/gi, "$12");
  };

  const renderQuiz = () => {
    return questions.map((question) => {
      return (
        <div className={styles.question}>
          <h3 className={styles.question_title}>{question.title}</h3>
          {question.type === "TEXT" && (
            <SunEditor
              placeholder={I18N[lng].write_here}
              setOptions={{
                attributesWhitelist: {
                  all: "style",
                  input: "checked",
                },
                height: "auto",
                minHeight: "250px",
                showPathLabel: false,
                resizingBar: false,
                imageUrlInput: false,
                imageWidth: "75%",
                formats: ["p", "blockquote", "h2", "h3", "h4", "h5", "h6"],
                buttonList: [
                  [
                    "undo",
                    "redo",
                    "formatBlock",
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "outdent",
                    "indent",
                    "align",
                    "list",
                    "table",
                    "link",
                    "fullScreen",
                    "showBlocks",
                  ],
                ],
              }}
              onChange={(c) => handleChange(question.key, c)}
              onPaste={handlePaste}
            />
          )}

          {question.type === "SELECT" && question.choices?.length > 0 && (
            <ul>
              {question.choices.map((choice, idx) => (
                <li key={`i${idx}`}>
                  <input
                    type="radio"
                    name={`choice-${question.key}`}
                    id={`choice-${question.key}-${idx}`}
                    value={idx}
                    onChange={(e) =>
                      handleChoiceChange(question.key, e, choice)
                    }
                  />
                  <label for={`choice-${question.key}-${idx}`}>{choice}</label>
                </li>
              ))}
            </ul>
          )}

          {question.type === "MULTI_SELECT" && question.choices?.length > 0 && (
            <ul>
              {question.choices.map((choice, idx) => (
                <li key={`i${idx}`}>
                  <input
                    type="checkbox"
                    name={`choice-${question.key}`}
                    id={`choice-${question.key}-${idx}`}
                    value={idx}
                    onChange={(e) =>
                      handleChoiceChange(question.key, e, choice)
                    }
                  />
                  <label for={`choice-${question.key}-${idx}`}>{choice}</label>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    });
  };

  const handleSave = () => {
    let content = body;
    data.forEach((question) => {
      let answer = "";
      if (question.type === "SELECT") {
        let str = "<ul>";
        question.answer.forEach((i) => {
          str += "<li>" + i + "</li>";
        });
        str += "</ul>";
        answer = str;
      } else if (question.type === "MULTI_SELECT") {
        let str = "<ul>";
        question.answer.forEach((i) => {
          str += "<li>" + i + "</li>";
        });
        str += "</ul>";
        answer = str;
      } else {
        answer = question.answer;
      }
      content = content.replace("{{" + question.key + "}}", answer);
    });
    console.log("=======");
    console.log(content);
    setContent(content);
    onCancel();
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={{
        base: styles.modalContent,
        afterOpen: styles.modalContentAfterOpen,
        beforeClose: styles.modalContentBeforeClose,
      }}
      overlayClassName={styles.modalOverlay}
      closeTimeoutMS={200}
    >
      <div className={`${styles.confirm} `}>
        <div className={styles.header}>{I18N[lng].quiz}</div>
        <div className={styles.close} onClick={onCancel}>
          <IconClose width={14} />
        </div>
        <div className={styles.body}>
          {questions.length === 0 ? "No questions found" : renderQuiz()}
        </div>
        <div className={styles.footer}>
          <button className={styles.yes} onClick={handleSave}>
            save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QuizLayout;
