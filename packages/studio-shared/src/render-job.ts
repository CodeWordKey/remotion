import type {
	AudioCodec,
	Codec,
	ColorSpace,
	LogLevel,
	makeCancelSignal,
	PixelFormat,
	ProResProfile,
	StillImageFormat,
	StitchingState,
	VideoImageFormat,
	X264Preset,
} from '@remotion/renderer';

type BaseRenderProgress = {
	message: string;
	value: number;
};

export type RenderStep = 'bundling' | 'rendering' | 'stitching';

export type RenderingProgressInput = {
	frames: number;
	totalFrames: number;
	steps: RenderStep[];
	concurrency: number;
	doneIn: number | null;
};

export type StitchingProgressInput = {
	frames: number;
	totalFrames: number;
	doneIn: number | null;
	stage: StitchingState;
	codec: Codec;
};

export type DownloadProgress = {
	name: string;
	id: number;
	progress: number | null;
	totalBytes: number | null;
	downloaded: number;
};

export type CopyingState = {
	bytes: number;
	doneIn: number | null;
};

export type BundlingState = {
	progress: number;
	doneIn: number | null;
};

export type AggregateRenderProgress = {
	rendering: RenderingProgressInput | null;
	stitching: StitchingProgressInput | null;
	downloads: DownloadProgress[];
	bundling: BundlingState;
	copyingState: CopyingState;
};

export type JobProgressCallback = (
	options: BaseRenderProgress & AggregateRenderProgress,
) => void;

type RenderJobDynamicStatus =
	| {
			status: 'done';
			progress: BaseRenderProgress & AggregateRenderProgress;
	  }
	| {
			status: 'running';
			progress: BaseRenderProgress & AggregateRenderProgress;
	  }
	| {
			status: 'idle';
	  }
	| {
			status: 'failed';
			error: {
				message: string;
				stack: string | undefined;
			};
	  };

type RenderJobDynamicFields =
	| ({
			type: 'still';
			imageFormat: StillImageFormat;
			jpegQuality: number;
			frame: number;
			scale: number;
			offthreadVideoCacheSizeInBytes: number | null;
	  } & RenderJobDynamicStatus)
	| ({
			type: 'sequence';
			imageFormat: VideoImageFormat;
			jpegQuality: number | null;
			scale: number;
			concurrency: number;
			startFrame: number;
			endFrame: number;
			offthreadVideoCacheSizeInBytes: number | null;
	  } & RenderJobDynamicStatus)
	| ({
			type: 'video';
			imageFormat: VideoImageFormat;
			jpegQuality: number | null;
			scale: number;
			codec: Codec;
			audioCodec: AudioCodec;
			concurrency: number;
			crf: number | null;
			startFrame: number;
			endFrame: number;
			muted: boolean;
			enforceAudioTrack: boolean;
			proResProfile: ProResProfile | null;
			x264Preset: X264Preset | null;
			pixelFormat: PixelFormat;
			audioBitrate: string | null;
			videoBitrate: string | null;
			encodingBufferSize: string | null;
			encodingMaxRate: string | null;
			everyNthFrame: number;
			numberOfGifLoops: number | null;
			disallowParallelEncoding: boolean;
			offthreadVideoCacheSizeInBytes: number | null;
			colorSpace: ColorSpace;
	  } & RenderJobDynamicStatus);

import type {ChromiumOptions, OpenGlRenderer} from '@remotion/renderer';

export type RequiredChromiumOptions = Required<ChromiumOptions>;
export type UiOpenGlOptions = OpenGlRenderer | 'default';

export type RenderJob = {
	startedAt: number;
	compositionId: string;
	id: string;
	outName: string;
	deletedOutputLocation: boolean;
	logLevel: LogLevel;
	delayRenderTimeout: number;
	cancelToken: ReturnType<typeof makeCancelSignal>;
	chromiumOptions: RequiredChromiumOptions;
	envVariables: Record<string, string>;
	serializedInputPropsWithCustomSchema: string;
	multiProcessOnLinux: boolean;
	beepOnFinish: boolean;
	repro: boolean;
	binariesDirectory: string | null;
} & RenderJobDynamicFields;

export type RenderJobWithCleanup = RenderJob & {
	cleanup: (() => void)[];
};
