import React, { useEffect, useRef, useState } from "react";
import SunEditor from "suneditor-react";
import plugins from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";

import { uploadMedia } from "../../api";
import { getApiUrl } from "../../utils";
import { I18N } from "../../i18n";
import TweetEmbed from "./plugins/TweetEmbed";
import QuoteEmbed from "./plugins/QuoteEmbed";
import ArticleEmbed from "./plugins/ArticleEmbed";
import EventEmbed from "./plugins/EventEmbed";
import FieldsSelector from "./plugins/FieldsSelector";
import QuizLayout from "./plugins/QuizLayout";
import "./editor.scss";

export const TTPEditor = (props) => {
  const {
    auth,
    env,
    lng,
    initialContent,
    setContent,
    initPlugins = [],
    dynamicFields,
  } = props;
  const editorRef = useRef();
  const [fieldsModalOpen, setFieldsModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activatedPlugins, setActivatedPlugins] = useState(null);
  const [buttonList, setButtonList] = useState([]);

  const initEditor = () => {
    editorRef.current.util.createTagsWhitelist("div");

    // Store params for all plugins in this.context.params variable
    editorRef.current.core.plugins.article_embed.initParams.call(
      editorRef.current,
      editorRef.current.core.context,
      auth,
      env,
      lng
    );
  };

  useEffect(() => {
    let tabList = [
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
      "image",
      "video",
    ];
    let tabPlugins = { ...plugins };
    if (initPlugins.includes("TweetEmbed")) {
      tabList.push("tweet_embed");
      tabPlugins = { ...tabPlugins, TweetEmbed };
    }
    if (initPlugins.includes("QuoteEmbed")) {
      tabList.push("quote_embed");
      tabPlugins = { ...tabPlugins, QuoteEmbed };
    }
    if (initPlugins.includes("ArticleEmbed")) {
      tabList.push("article_embed");
      tabPlugins = { ...tabPlugins, ArticleEmbed };
    }
    if (initPlugins.includes("EventEmbed")) {
      tabList.push("event_embed");
      tabPlugins = { ...tabPlugins, EventEmbed };
    }
    if (initPlugins.includes("DynamicFields")) {
      tabList.push("dynamic_fields");
      tabPlugins = { ...tabPlugins, DynamicFieldPlugin };
    }
    if (initPlugins.includes("QuizLayout")) {
      tabList.push("quiz_layout");
      tabPlugins = { ...tabPlugins, QuizLayoutPlugin };
    }
    tabList.push("showBlocks");
    tabList.push("fullScreen");
    setButtonList(tabList);
    setActivatedPlugins(tabPlugins);
  }, []);

  const getSunEditorInstance = (sunEditor) => {
    editorRef.current = sunEditor;
  };

  const handleChange = (content) => {
    setContent(content);
  };

  const handlePaste = (event, cleanData, maxCharCount, core) => {
    let content = cleanData.replace(/\s+style="[^"]*"/gi, "");
    return content.replace(/(<\/?h)([0-1])/gi, "$12");
  };

  const handleImageUploadBefore = (files, info, e, uploadHandler) => {
    const apiUrl = getApiUrl(env);

    uploadMedia({ apiUrl, token: auth.token, data: files[0] })
      .then((resp) => {
        const imgUrl = resp.data.data.image_url;
        uploadHandler({
          result: [
            {
              url: imgUrl,
              name: files[0].name,
              size: files[0].size,
            },
          ],
        });
      })
      .catch((e) => {
        uploadHandler({ result: [] });
      });
  };

  const handleAddField = (field) => {
    editorRef.current.core.focus();
    editorRef.current.insertHTML(field);
  };

  const handleQuizLayout = (content) => {
    editorRef.current.core.focus();
    editorRef.current.setContents(content);
  };

  const DynamicFieldPlugin = {
    name: "dynamic_fields",
    display: "command",
    title: I18N[lng]["customize"],
    innerHTML:
      '<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9055 14.0095C11.9324 14.0095 11.9593 14.0095 11.9916 14.0095C12.0024 14.0095 12.0132 14.0095 12.0239 14.0095C12.0401 14.0095 12.0616 14.0095 12.0778 14.0095C13.6553 13.9826 14.9314 13.428 15.8736 12.3674C17.9465 10.0306 17.6019 6.02485 17.5642 5.64258C17.4296 2.77283 16.0728 1.39988 14.9529 0.759163C14.1184 0.279975 13.1438 0.0215366 12.0562 0H12.0186C12.0132 0 12.0024 0 11.997 0H11.9647C11.3671 0 10.1933 0.0969145 9.06804 0.737627C7.93738 1.37834 6.55904 2.75129 6.42443 5.64258C6.38674 6.02485 6.04216 10.0306 8.11505 12.3674C9.05189 13.428 10.3279 13.9826 11.9055 14.0095ZM7.862 5.77718C7.862 5.76103 7.86738 5.74487 7.86738 5.73411C8.04506 1.87368 10.7856 1.4591 11.9593 1.4591H11.9809C11.9916 1.4591 12.0078 1.4591 12.0239 1.4591C13.4777 1.49141 15.949 2.08366 16.1159 5.73411C16.1159 5.75026 16.1159 5.76641 16.1213 5.77718C16.1266 5.81487 16.5035 9.47608 14.7914 11.4036C14.113 12.1682 13.2084 12.545 12.0186 12.5558C12.0078 12.5558 12.0024 12.5558 11.9916 12.5558C11.9809 12.5558 11.9755 12.5558 11.9647 12.5558C10.7802 12.545 9.87028 12.1682 9.19726 11.4036C7.49049 9.48685 7.85661 5.80948 7.862 5.77718Z" fill="currentColor"/><path d="M23.0565 20.6535C23.0565 20.6481 23.0565 20.6427 23.0565 20.6374C23.0565 20.5943 23.0511 20.5512 23.0511 20.5027C23.0188 19.4367 22.9488 16.9438 20.6121 16.147C20.5959 16.1416 20.5744 16.1362 20.5583 16.1308C18.13 15.5116 16.111 14.1118 16.0894 14.0956C15.761 13.8641 15.3087 13.9449 15.0772 14.2733C14.8457 14.6017 14.9265 15.054 15.2549 15.2855C15.3464 15.3501 17.4893 16.8415 20.1706 17.5307C21.4251 17.9776 21.5651 19.3182 21.6028 20.5458C21.6028 20.5943 21.6028 20.6374 21.6082 20.6804C21.6136 21.165 21.5812 21.9134 21.4951 22.3441C20.6229 22.8395 17.2039 24.5516 12.0029 24.5516C6.82333 24.5516 3.38286 22.8341 2.50525 22.3387C2.4191 21.908 2.38141 21.1596 2.39218 20.675C2.39218 20.632 2.39757 20.5889 2.39757 20.5404C2.43525 19.3129 2.57524 17.9722 3.82975 17.5253C6.51105 16.8361 8.65393 15.3394 8.74546 15.2801C9.0739 15.0486 9.15466 14.5963 8.92314 14.2679C8.69162 13.9395 8.23935 13.8587 7.91092 14.0902C7.88939 14.1064 5.8811 15.5063 3.44209 16.1254C3.42055 16.1308 3.4044 16.1362 3.38825 16.1416C1.05153 16.9438 0.981537 19.4367 0.949232 20.4974C0.949232 20.5458 0.949232 20.5889 0.943848 20.632C0.943848 20.6374 0.943848 20.6427 0.943848 20.6481C0.938464 20.9281 0.93308 22.3657 1.21844 23.0871C1.27228 23.2271 1.3692 23.3456 1.49841 23.4263C1.65994 23.534 5.53113 26 12.0083 26C18.4854 26 22.3566 23.5286 22.5181 23.4263C22.6419 23.3456 22.7442 23.2271 22.7981 23.0871C23.0673 22.371 23.0619 20.9335 23.0565 20.6535Z" fill="currentColor"/></svg>',

    add: function (core, targetElement) {},
    action: function () {
      setFieldsModalOpen(true);
    },
  };

  const QuizLayoutPlugin = {
    name: "quiz_layout",
    display: "command",
    title: I18N[lng]["quiz"],
    innerHTML:
      '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_35499_11634)"><path d="M11.1964 2.9902C10.6607 2.33178 9.93304 1.81165 9.01343 1.42995C8.09382 1.04825 7.0893 0.857422 6 0.857422C4.91072 0.857422 3.90623 1.04825 2.9866 1.42995C2.06696 1.81165 1.33931 2.33168 0.803579 2.9902C0.267828 3.64866 0 4.36625 0 5.14304C0 5.81265 0.201944 6.44006 0.605997 7.02485C1.01005 7.60967 1.56243 8.10081 2.2634 8.49811C2.21423 8.67662 2.15621 8.84622 2.08922 9.00707C2.02226 9.16776 1.962 9.29948 1.90843 9.40221C1.85482 9.5048 1.78234 9.6187 1.69075 9.74359C1.5993 9.86865 1.53011 9.95687 1.48322 10.0082C1.43639 10.0596 1.35938 10.1443 1.25217 10.2627C1.1451 10.3809 1.07586 10.458 1.04465 10.4938C1.04012 10.496 1.02229 10.516 0.991052 10.5541C0.959834 10.592 0.944166 10.6109 0.944166 10.6109L0.903988 10.6712C0.881636 10.7045 0.871598 10.7257 0.873802 10.7345C0.876054 10.7436 0.871598 10.7659 0.860433 10.8015C0.849245 10.8373 0.850395 10.8641 0.863764 10.8819V10.8886C0.881636 10.9645 0.917311 11.0259 0.970881 11.0728C1.02445 11.1195 1.08482 11.1429 1.15172 11.1429H1.18523C1.47548 11.1071 1.72992 11.0582 1.94863 10.9957C3.11832 10.6966 4.14514 10.1564 5.02903 9.3751C5.36382 9.41082 5.68749 9.42864 5.99995 9.42864C7.08923 9.42864 8.09377 9.23784 9.01338 8.85602C9.93299 8.47428 10.6607 7.95434 11.1964 7.29589C11.7321 6.63748 12 5.91981 12 5.14302C12 4.36635 11.7322 3.64866 11.1964 2.9902ZM10.443 6.85068C9.97638 7.37738 9.34693 7.79597 8.55454 8.10618C7.76215 8.41632 6.91053 8.57157 5.99984 8.57157C5.72755 8.57157 5.43739 8.55374 5.12936 8.51795L4.74766 8.47789L4.45971 8.73242C3.91068 9.2146 3.29678 9.59623 2.61822 9.87749C2.82354 9.51597 2.97979 9.13199 3.08698 8.72583L3.26777 8.08289L2.6852 7.74819C2.10484 7.41765 1.65512 7.02596 1.33586 6.57279C1.01664 6.11976 0.857103 5.6431 0.857103 5.14314C0.857103 4.53151 1.09036 3.96236 1.55685 3.43557C2.02348 2.90883 2.65286 2.49028 3.4453 2.18003C4.23774 1.86975 5.08921 1.71448 5.99998 1.71448C6.91067 1.71448 7.76212 1.86968 8.55451 2.17993C9.34688 2.49021 9.97633 2.90874 10.443 3.43548C10.9095 3.96227 11.1428 4.53144 11.1428 5.14302C11.1428 5.7546 10.9095 6.32389 10.443 6.85068Z" fill="currentColor"/><ellipse cx="3.75" cy="5.25" rx="0.75" ry="0.75" fill="currentColor"/><ellipse cx="6" cy="5.25" rx="0.75" ry="0.75" fill="currentColor"/><ellipse cx="8.25" cy="5.25" rx="0.75" ry="0.75" fill="currentColor"/></g><defs><clipPath id="clip0_35499_11634"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>',

    add: function (core, targetElement) {},
    action: function () {
      setQuizModalOpen(true);
    },
  };

  if (!activatedPlugins) {
    return null;
  }

  return (
    <div id="ttp-editor">
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        placeholder={I18N[lng]["write_here"]}
        lang={lng}
        token={auth.token}
        setOptions={{
          attributesWhitelist: {
            all: "*",
            input: "checked",
          },
          height: "auto",
          minHeight: "300px",
          showPathLabel: false,
          resizingBar: false,
          imageUrlInput: false,
          imageWidth: "75%",
          formats: ["p", "blockquote", "h2", "h3", "h4", "h5", "h6"],
          buttonList: [buttonList],
          plugins: activatedPlugins,
        }}
        setContents={initialContent}
        onChange={(c) => handleChange(c)}
        onPaste={handlePaste}
        onImageUploadBefore={handleImageUploadBefore}
        onLoad={initEditor}
      />
      <FieldsSelector
        isOpen={fieldsModalOpen}
        onCancel={() => setFieldsModalOpen(false)}
        dynamicFields={dynamicFields}
        lng={lng}
        onAddField={handleAddField}
      />
      <QuizLayout
        isOpen={quizModalOpen}
        onCancel={() => setQuizModalOpen(false)}
        body={props.quizBody}
        questions={props.quizQuestions}
        lng={lng}
        setContent={handleQuizLayout}
      />
    </div>
  );
};
