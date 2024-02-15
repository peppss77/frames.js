import { FrameImage, NextServerPageProps } from "frames.js/next/server";
import { FrameLink, currentFrame } from "../components";
import { Frame, RouterAppState, initialState } from "../types";

export default function CheckValueFrame({ searchParams }: NextServerPageProps) {
  const frame = currentFrame({ searchParams, initialState });

  const textInputValue = frame.previousFrame?.postBody?.untrustedData.inputText;

  if (!textInputValue) {
    return (
      <Frame {...{ frame }}>
        <FrameImage>
          <div>You did not provide any value</div>
        </FrameImage>
        <FrameLink<RouterAppState>
          to={(state) => ({ path: "/", state: { ...state, answersCount: 0 } })}
        >
          Reset
        </FrameLink>
      </Frame>
    );
  }

  const val = parseInt(textInputValue, 10);
  const isCorrectAnswer = val === frame.state.correctAnswer;

  return (
    <Frame {...{ frame }}>
      <FrameImage>
        <div tw="flex flex-col">
          <div tw="flex">
            {isCorrectAnswer ? "You are the 💣" : "😢 wrong answer"}
          </div>
          <div tw="flex">This is answer #{frame.state.answersCount}</div>
        </div>
      </FrameImage>
      {!isCorrectAnswer ? (
        <FrameLink to="/enter-value">Try again</FrameLink>
      ) : (
        <FrameLink<RouterAppState>
          to={(state) => ({ path: "/", state: { ...state, answersCount: 0 } })}
        >
          Reset
        </FrameLink>
      )}
    </Frame>
  );
}
