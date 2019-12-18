import React, { Component } from "react";
import { connect } from "react-redux";
import Editor, {
  createEditorStateWithText,
  composeDecorators
} from "draft-js-plugins-editor";
import createVideoPlugin from "draft-js-video-plugin";
import createAlignmentPlugin from "draft-js-alignment-plugin";
import "../styles/draft-emoji-plugin.css";
import "../styles/draft-toolbar-plugin.css";
import "draft-js/dist/Draft.css";
import "../styles/focusedStyles.css";
import "../styles/toolbarStyles.css";
import "../styles/buttonStyles.css";
import "../styles/anchorStyles.css";
import linkStyles from "../styles/buttonStyles.css";
import "draft-js-alignment-plugin/lib/plugin.css";
import {
  requestPostDataByLanguage,
  requestEditablePostContents,
  requestDisplayableContent,
  requestDisplayablePostByLanguage
} from "../../../../reduxStore/actions/helperActions.js";
// import addLinkPlugin from "../editable/plugins/addLinkPlugin";
import { createLinkPlugin } from "../editable/plugins/AddLink";
import { colorStyleMap } from "../editable/plugins/ColorPicker";

var placeholderText = "Hello, you shouldn't really see that text, hmmm";

class DisplayableRichText extends Component {
  constructor(props) {
    super(props);

    // this._linkPlugin = createLinkPlugin({
    //   theme: linkStyles,
    //   placeholder: "https://..."
    // });
    this._alignmentPlugin = createAlignmentPlugin();
    const videoDecorator = composeDecorators(this._alignmentPlugin.decorator);
    this._videoPlugin = createVideoPlugin({ videoDecorator });
    this._linkPlugin = createLinkPlugin();

    this.plugins = [
      // this._linkPlugin,
      this._videoPlugin,
      this._alignmentPlugin,
      // addLinkPlugin
      // plugindecoraator
      this._linkPlugin
    ];

    this.state = {
      loadedData: false,
      editorState: createEditorStateWithText(placeholderText)
    };
  }

  onChange = editorState => {
    this.setState({
      editorState: editorState
    });
  };

  // focus = () => {
  //   this.editor.focus();
  // };

  componentDidUpdate(prevProps) {
    const { displayedContent } = this.props;

    if (displayedContent && displayedContent !== prevProps.displayedContent) {
      this.setState({
        editorState: displayedContent
      });
    }
  }

  componentDidMount() {
    // Cammot use componentDidMount to set editorState
    // It causes draft to loose decorators
  }

  render() {
    return (
      <div>
        <div className="editor">
          <Editor
            readOnly="true"
            onChange={this.onChange}
            editorState={this.state.editorState}
            plugins={this.plugins}
            customStyleMap={colorStyleMap}
            // Ummm, what is that for?
            ref={element => {
              this.editor = element;
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { name, initState } = ownProps;

  var displayablePost = requestDisplayablePostByLanguage(
    initState,
    state.language.selectedLanguage
  );

  return {
    displayedContent: displayablePost[name]
  };
};

export default connect(mapStateToProps)(DisplayableRichText);
