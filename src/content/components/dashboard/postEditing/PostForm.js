import React, { Component } from "react";
import { Editor, EditorState, convertToRaw } from "draft-js";
import { connect } from "react-redux";
import { compose } from "redux";
import moment from "moment";
import { firestoreConnect, getVal } from "react-redux-firebase";
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody
} from "reactstrap";
import {
  requestPostDataByLanguage,
  requestEditablePostContents
} from "./../../../../reduxStore/actions/helperActions";

import { createEditorStateWithText } from "draft-js-plugins-editor";
import EditableRichText from "../../common/blogPostComponents/editable/EditableRichText";
import "./../../../../styles/components/blog.css";
import BlogPostTitle from "../../common/blogPostComponents/BlogPostTitle";

class PostForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      content: null,
      editor: {
        titleEditor: EditorState.createEmpty(),
        summaryEditor: EditorState.createEmpty(),
        contentEditor: createEditorStateWithText("asd"),
        title: createEditorStateWithText("asd"),
        isPublished: false
      },
      staged: {
        postContents: {
          title: "",
          summary: "",
          content: ""
        },
        postData: {
          isPublished: false
        }
      }
    };
  }

  handleTitleChange = e => {
    this.props.handleEdit();

    this.setState(prevState => ({
      editor: {
        ...prevState.editor,
        titleEditor: e
      }
    }));
  };

  handleSummaryChange = e => {
    this.props.handleEdit();

    this.setState(prevState => ({
      editor: {
        ...prevState.editor,
        summaryEditor: e
      }
    }));
  };

  handleContentChange = e => {
    this.props.handleEdit();

    this.setState(prevState => ({
      editor: {
        ...prevState.editor,
        contentEditor: e
      }
    }));
  };

  /* REFACTOR ABOVE AROUND THIS */
  onChange = (editorState, target) => {
    this.setState(prevState => ({
      editor: { ...prevState.editor, [target]: editorState }
    }));
  };

  onUpdate = (editorState, target) => {
    this.setState(prevState => ({
      [target]: editorState
    }));
  };

  handleIsPublishedChange = () => {
    this.setState(prevState => ({
      editor: {
        ...prevState.editor,
        isPublished: !this.state.editor.isPublished
      }
    }));
  };

  loadPostDataIntoState = () => {
    const { data } = this.props;

    if (data) {
      var isPublished = data.post.isPublished ? data.post.isPublished : false;

      var postData = requestPostDataByLanguage(data.post, data.language);

      var editablePost = requestEditablePostContents(postData);

      this.setState({
        editor: {
          titleEditor: editablePost.title || createEditorStateWithText("asd"),
          summaryEditor:
            editablePost.summary || createEditorStateWithText("asd"),
          contentEditor:
            editablePost.content || createEditorStateWithText("asd"),
          isPublished
        }
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    let rawTitle = convertToRaw(
      this.state.editor.titleEditor.getCurrentContent()
    );
    let rawContent = convertToRaw(
      this.state.editor.contentEditor.getCurrentContent()
    );
    let rawSummary = convertToRaw(
      this.state.editor.summaryEditor.getCurrentContent()
    );

    this.setState(
      {
        staged: {
          postContents: {
            title: JSON.stringify(rawTitle),
            summary: JSON.stringify(rawSummary),
            content: JSON.stringify(rawContent)
          },
          postData: { isPublished: this.state.editor.isPublished }
        }
      },
      () => {
        this.props.handleSubmit(this.state.staged);
      }
    );
  };

  componentDidMount() {
    this.loadPostDataIntoState();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.loadPostDataIntoState();
    }
  }

  render() {
    const { data, author } = this.props;

    let date = moment(this.props.data.post.createdAt.toDate()).format(
      "MMM Do YY"
    );

    // console.log(this.props);
    const formGroupStyle = {};

    const labelStyle = {
      width: "100%",
      backgroundColor: "black",
      fontSize: "2rem",
      padding: "0.5rem"
    };

    var outerHeaderContainer = {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      background: "#58585852",
      padding: "0.2rem"
    };

    var innerHeaderContainer = {
      display: "flex",
      flexDirection: "column",
      margin: "0.5rem 0 0.5rem 0.5rem"
    };

    var avatarImage = {
      width: "64px",
      height: "64px",
      border: "2px solid black",
      borderRadius: "2px",
      margin: "0.5rem 0 0.5rem 0.5rem"
    };

    // console.log(data.post)
    // if(data) {
    //   console.log("data")
    // } else {

    //   console.log("fukk")
    // }

    return (
      <div className="container">
        <div className="postAbstract">
          <h5>NEW POST</h5>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup style={formGroupStyle}>
              <Label for="titleEditor" style={labelStyle}>
                Title
              </Label>
              {/* <div className="abstractHeader" style={outerHeaderContainer}>
                <img alt="avateur" style={avatarImage} src={author.avatarURL} />
                <div className="" style={innerHeaderContainer}>
                  <div className="abstractTitle">
                    <Editor
                      id="titleEditor"
                      onChange={e => {
                        this.handleTitleChange(e);
                      }}
                      editorState={this.state.editor.titleEditor}
                    />
                  </div>
                  <span className="abstractDetails">
                    {`${date} by ${author.nick}`}
                  </span>
                </div>
              </div> */}
              <BlogPostTitle
                post={data.post}
                isEditable={true}
                onUpdate={editorState => {
                  this.onUpdate(editorState, "title");
                }}
              />
            </FormGroup>
            <FormGroup style={formGroupStyle}>
              <Label for="summaryEditor" style={labelStyle}>
                Summary
              </Label>
              <Editor
                id="summaryEditor"
                onChange={e => {
                  this.handleSummaryChange(e);
                }}
                editorState={this.state.editor.summaryEditor}
              />
            </FormGroup>
            <FormGroup style={formGroupStyle}>
              <Label for="contentEditor" style={labelStyle}>
                Content
              </Label>
              <div className="abstractContent">
                {/* <EditableRichText
                  name="content"
                  // onChange={this.handleContentChange}
                  onChange={editorState => {
                    this.onUpdate(editorState, "content");
                  }}
                  initState={data.post}
                  isEditable={false}
                  // editorState={this.state.editor.contentEditor}
                  // type="content/header"
                /> */}
              </div>
            </FormGroup>
            <FormGroup check>
              <legend>Is published?</legend>
              <Label check>
                <Input
                  type="checkbox"
                  checked={this.state.editor.isPublished}
                  onChange={this.handleIsPublishedChange}
                />{" "}
                Check me out
              </Label>
            </FormGroup>
            <div>
              <button>Submit</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state, ownProps) => {
//   var authorId = ownProps.data.post.authorId;

//   var author = getVal(state.firestore.data, `users/${authorId}`);

//   var nick = author ? author.nick : "null";

//   var avatarURL = author ? author.avatarURL : null;

//   // It seems I get access to blogPosts thanks to the parent of this component
//   // console.log(state.firestore.data);

//   return { ownProps };
// };

// export default compose(
//   connect(mapStateToProps),
//   firestoreConnect(props => [
//     { collection: "users", doc: `${props.data.post.authorId}` }
//   ])
// )(PostForm);

export default PostForm;
