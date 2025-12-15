import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const YouTubeVideo = ({ videoId }: { videoId: string }) => {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <View style={styles.videoContainer}>
      <YoutubePlayer
        height={200}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    marginTop: 12,
  },
});

export default YouTubeVideo;
