import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
  getFrameMessage,
} from "frames.js/next/server";
import Link from "next/link";
import { kv } from "@vercel/kv";
import { DEBUG_HUB_OPTIONS } from "../../debug/constants";

type State = {
  page: "homeframe";
};

const initialState = { page: "homeframe" } as const;

const reducer: FrameReducer<State> = (state, action) => {
  return {
    page: "homeframe",
  };
};

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...DEBUG_HUB_OPTIONS,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  let frame;

  if (frameMessage) {
    const { castId, requesterFid } = frameMessage;

    const uniqueId = `fid:${requesterFid}`;

    const existingRequests = await kv.hgetall(uniqueId);

    console.log(existingRequests);
    if (existingRequests) {
      // Check status of request
      console.log(existingRequests);
      // if() success, frame is x
      frame = (
        <FrameContainer
          postUrl="/examples/slow-request/frames"
          pathname="/examples/slow-request"
          state={state}
          previousFrame={previousFrame}
        >
          <FrameImage src="" />
          <FrameButton href={""}>Open image</FrameButton>
        </FrameContainer>
      );
    } else {
      // start request, don't await it! Return a loading page, let this run in the background
      fetch(
        `${process.env.NEXT_PUBLIC_HOST}/examples/slow-request/slow-fetch`,
        {
          method: "POST",
          body: JSON.stringify({
            postBody: previousFrame.postBody,
            params,
            searchParams,
          }),
        }
      );
    }
  } else {
    frame = (
      <FrameContainer
        postUrl="/examples/slow-request/frames"
        pathname="/examples/slow-request"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="w-full h-full bg-slate-700 text-white justify-center items-center">
            Prompt dall-e
          </div>
        </FrameImage>
        <FrameInput text="prompt dall-e" />
        <FrameButton onClick={dispatch}>Imagine</FrameButton>
      </FrameContainer>
    );
  }

  // then, when done, return next frame
  return (
    <div className="p-4">
      frames.js starter kit with slow requests.{" "}
      <Link
        href={`/debug?url=${process.env.NEXT_PUBLIC_HOST || "http://localhost:3000"}`}
        className="underline"
      >
        Debug
      </Link>
      {frame}
    </div>
  );
}
