import ReactPlayer from "react-player";

interface Props {
  src: string;
  reproduciendo: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export const VideoActivo = ({ src, reproduciendo, onPlay, onPause }: Props) => (
  <ReactPlayer
    url={src}
    width="100%"
    height="100%"
    controls
    playing={reproduciendo}
    onPlay={onPlay}
    onPause={onPause}
    style={{
      objectFit: "cover",
      position: "absolute",
      top: 0,
      left: 0,
    }}
    config={{
      file: {
        attributes: {
          style: {
            objectFit: "cover",
            width: "100%",
            height: "100%",
          },
        },
      },
    }}
  />
);
