import React, { useRef } from "react";
import SunEditor from "suneditor-react";
import plugins from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";

import TweetEmbed from "./plugins/TweetEmbed";
import QuoteEmbed from "./plugins/QuoteEmbed";
import ArticleEmbed from "./plugins/ArticleEmbed";
import "./editor.scss";

const I18N = {
  en: {
    write_here: "Write here",
  },
  fr: {
    write_here: "Écrire ici ...",
  },
  nl: {
    write_here: "Schrijf hier ...",
  },
};

export const TTPEditor = ({ auth, env, lng, initialContent, setContent }) => {
  const editorRef = useRef();

  const initEditor = () => {
    editorRef.current.util.createTagsWhitelist("div");
  };

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

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    // dispatch(uploadTmpMedia({ token: auth.token, data: files[0] })).then(
    //   (resp) => {
    //     const url = resp.payload.data.data.url;
    //     const startsWithHttp = url.lastIndexOf("http://", 0) === 0;
    //     const startsWithHttps = url.lastIndexOf("https://", 0) === 0;
    //     const isAbsolute = startsWithHttp || startsWithHttps;
    //     const imgUrl = isAbsolute ? url : `${TTP_API_URL}/${url}`;
    //     uploadHandler({
    //       result: [
    //         {
    //           url: imgUrl,
    //           name: files[0].name,
    //           size: files[0].size,
    //         },
    //       ],
    //     });
    //   }
    // );
  };

  return (
    <div id="ttp-editor">
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        placeholder={I18N[lng]["write_here"]}
        lang={lng}
        token={auth.token}
        setOptions={{
          allowedClassNames: "^se-|__se__|katex|ttp-|author|article-embed",
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
              "image",
              "video",
              "tweet_embed",
              "quote_embed",
              "article_embed",
              "showBlocks",
              "fullScreen",
            ],
          ],
          plugins: { ...plugins, TweetEmbed, QuoteEmbed, ArticleEmbed },
        }}
        setContents={initialContent}
        onChange={(c) => handleChange(c)}
        onPaste={handlePaste}
        onImageUploadBefore={handleImageUploadBefore}
        onLoad={initEditor}
      />
    </div>
  );
};
