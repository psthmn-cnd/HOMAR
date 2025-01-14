import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Badge, Popover, PopoverHeader, PopoverBody } from "reactstrap";

const styles = {
  container: {
    margin: "0 0.2rem"
  },
  videoAddBadge: {
    fontSize: "1rem",
    fontFamily: "Anonymous Pro, monospace"
  },
  popoverHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  popoverButton: {
    margin: "0 0.5em"
  }
};

class VideoAdd extends Component {
  state = {
    url: "The youtube video url...",
    open: false,
    popoverOpen: false
  };

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false
      });
    }

    this.preventNextClose = false;
  };

  togglePopover = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  addVideo = () => {
    const { editorState, onChange, linkedUrl } = this.props;
    onChange(this.props.modifier(editorState, { src: linkedUrl }));
  };

  render() {
    const { linkedUrl } = this.props;


    return (
      <div style={styles.container}>
        <Badge
          style={styles.videoAddBadge}
          color="primary"
          id="videoAdd"
          type="button"
          onClick={this.togglePopover}
        >
          Video
        </Badge>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target="videoAdd"
        >
          <PopoverHeader style={styles.popoverHeader}>
            <Button
              color="warning"
              style={styles.popoverButton}
              onClick={this.addVideo}
            >
              {`Click to plugin video 📺`}
            </Button>
          </PopoverHeader>
          <PopoverBody>
            {`The link below is the one that will be used to create a video, youtube and vimeo links are both supported.`}
            <br />
            <br />
            {linkedUrl}
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    linkedUrl: state.postEdit.linkedUrl
  };
};

export default connect(mapStateToProps)(VideoAdd);