import { FrameImage, FrameInput } from "frames.js/next/server";
import { Frame, FrameLink, type FrameRouteComponentProps } from "../components";
import { RouterAppState } from "../types";

export async function HomeFrame({
  $routerState,
}: FrameRouteComponentProps<RouterAppState>) {
  return (
    <Frame $routerState={$routerState}>
      <FrameImage>
        <div>Hello world</div>
      </FrameImage>
      <FrameLink to="/enter-value">Enter →</FrameLink>
    </Frame>
  );
}

export async function EnterValueFrame({
  $routerState,
}: FrameRouteComponentProps<RouterAppState>) {
  return (
    <Frame $routerState={$routerState}>
      <FrameImage>
        <div>Please enter 1 or 0.</div>
      </FrameImage>
      <FrameInput text="Type 1 or 0"></FrameInput>
      <FrameLink to="/">← Back</FrameLink>
      <FrameLink to="/check-value">Check →</FrameLink>
    </Frame>
  );
}

export async function CheckValueFrame({
  $routerState,
}: FrameRouteComponentProps<RouterAppState>) {
  const textInputValue = $routerState.frame.postBody?.untrustedData.inputText;

  if (!textInputValue) {
    return (
      <Frame $routerState={$routerState}>
        <FrameImage>
          <div>You did not provide any value</div>
        </FrameImage>
      </Frame>
    );
  }

  const val = parseInt(textInputValue, 10);
  const isCorrectAnswer = val === $routerState.state.correctAnswer;

  return (
    <Frame $routerState={$routerState}>
      <FrameImage>
        <div>{isCorrectAnswer ? "You are the 💣" : "😢 wrong answer"}</div>
      </FrameImage>
      {!isCorrectAnswer ? (
        <FrameLink to="/enter-value">Try again</FrameLink>
      ) : (
        <FrameLink to="/">Reset</FrameLink>
      )}
    </Frame>
  );
}
