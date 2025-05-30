import React, {
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import {useFrameForVolumeProp} from '../audio/use-audio-frame.js';
import {usePreload} from '../prefetch.js';
import {SequenceContext} from '../SequenceContext.js';
import {SequenceVisibilityToggleContext} from '../SequenceManager.js';
import {useMediaBuffering} from '../use-media-buffering.js';
import {useMediaInTimeline} from '../use-media-in-timeline.js';
import {
	DEFAULT_ACCEPTABLE_TIMESHIFT,
	useMediaPlayback,
} from '../use-media-playback.js';
import {useMediaTagVolume} from '../use-media-tag-volume.js';
import {useSyncVolumeWithMediaTag} from '../use-sync-volume-with-media-tag.js';
import {useVideoConfig} from '../use-video-config.js';
import {
	useMediaMutedState,
	useMediaVolumeState,
} from '../volume-position-state.js';
import type {RemotionVideoProps} from './props.js';
import {isIosSafari, useAppendVideoFragment} from './video-fragment.js';

type VideoForPreviewProps = RemotionVideoProps & {
	onlyWarnForMediaSeekingError: boolean;
	onDuration: (src: string, durationInSeconds: number) => void;
	pauseWhenBuffering: boolean;
	_remotionInternalNativeLoopPassed: boolean;
	_remotionInternalStack: string | null;
};

const VideoForDevelopmentRefForwardingFunction: React.ForwardRefRenderFunction<
	HTMLVideoElement,
	VideoForPreviewProps
> = (props, ref) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	const volumePropFrame = useFrameForVolumeProp();
	const {fps, durationInFrames} = useVideoConfig();
	const parentSequence = useContext(SequenceContext);
	const {hidden} = useContext(SequenceVisibilityToggleContext);

	const [timelineId] = useState(() => String(Math.random()));
	const isSequenceHidden = hidden[timelineId] ?? false;

	const {
		volume,
		muted,
		playbackRate,
		onlyWarnForMediaSeekingError,
		src,
		onDuration,
		// @ts-expect-error
		acceptableTimeShift,
		acceptableTimeShiftInSeconds,
		toneFrequency,
		name,
		_remotionInternalNativeLoopPassed,
		_remotionInternalStack,
		style,
		pauseWhenBuffering,
		...nativeProps
	} = props;
	if (typeof acceptableTimeShift !== 'undefined') {
		throw new Error(
			'acceptableTimeShift has been removed. Use acceptableTimeShiftInSeconds instead.',
		);
	}

	const actualVolume = useMediaTagVolume(videoRef);

	const [mediaVolume] = useMediaVolumeState();
	const [mediaMuted] = useMediaMutedState();

	useMediaInTimeline({
		mediaRef: videoRef,
		volume,
		mediaVolume,
		mediaType: 'video',
		src,
		playbackRate: props.playbackRate ?? 1,
		displayName: name ?? null,
		id: timelineId,
		stack: props._remotionInternalStack,
	});

	useSyncVolumeWithMediaTag({
		volumePropFrame,
		actualVolume,
		volume,
		mediaVolume,
		mediaRef: videoRef,
	});

	useMediaPlayback({
		mediaRef: videoRef,
		src,
		mediaType: 'video',
		playbackRate: props.playbackRate ?? 1,
		onlyWarnForMediaSeekingError,
		acceptableTimeshift:
			acceptableTimeShiftInSeconds ?? DEFAULT_ACCEPTABLE_TIMESHIFT,
	});

	useMediaBuffering(videoRef, pauseWhenBuffering);

	const actualFrom = parentSequence
		? parentSequence.relativeFrom + parentSequence.cumulatedFrom
		: 0;
	const duration = parentSequence
		? Math.min(parentSequence.durationInFrames, durationInFrames)
		: durationInFrames;

	const actualSrc = useAppendVideoFragment({
		actualSrc: usePreload(src as string),
		actualFrom,
		duration,
		fps,
	});

	useImperativeHandle(
		ref,
		() => {
			return videoRef.current as HTMLVideoElement;
		},
		[],
	);

	useEffect(() => {
		const {current} = videoRef;
		if (!current) {
			return;
		}

		const errorHandler = () => {
			if (current?.error) {
				// eslint-disable-next-line no-console
				console.error('Error occurred in video', current?.error);
				// If user is handling the error, we don't cause an unhandled exception
				if (props.onError) {
					return;
				}

				throw new Error(
					`The browser threw an error while playing the video ${src}: Code ${current.error.code} - ${current?.error?.message}. See https://remotion.dev/docs/media-playback-error for help. Pass an onError() prop to handle the error.`,
				);
			} else {
				throw new Error('The browser threw an error');
			}
		};

		current.addEventListener('error', errorHandler, {once: true});
		return () => {
			current.removeEventListener('error', errorHandler);
		};
	}, [props.onError, src]);

	const currentOnDurationCallback =
		useRef<VideoForPreviewProps['onDuration']>();
	currentOnDurationCallback.current = onDuration;

	useEffect(() => {
		const {current} = videoRef;
		if (!current) {
			return;
		}

		if (current.duration) {
			currentOnDurationCallback.current?.(src as string, current.duration);
			return;
		}

		const onLoadedMetadata = () => {
			currentOnDurationCallback.current?.(src as string, current.duration);
		};

		current.addEventListener('loadedmetadata', onLoadedMetadata);
		return () => {
			current.removeEventListener('loadedmetadata', onLoadedMetadata);
		};
	}, [src]);

	useEffect(() => {
		const {current} = videoRef;

		if (!current) {
			return;
		}

		// Without this, on iOS Safari, the video cannot be seeked.
		// if a seek is triggered before `loadedmetadata` is fired,
		// the video will not seek, even if `loadedmetadata` is fired afterwards.

		// Also, this needs to happen in a useEffect, because otherwise
		// the SSR props will be applied.

		if (isIosSafari()) {
			current.preload = 'metadata';
		} else {
			current.preload = 'auto';
		}
	}, []);

	const actualStyle: React.CSSProperties = useMemo(() => {
		return {
			...style,
			opacity: isSequenceHidden ? 0 : style?.opacity ?? 1,
		};
	}, [isSequenceHidden, style]);

	return (
		<video
			ref={videoRef}
			muted={muted || mediaMuted}
			playsInline
			src={actualSrc}
			loop={_remotionInternalNativeLoopPassed}
			style={actualStyle}
			{...nativeProps}
		/>
	);
};

export const VideoForPreview = forwardRef(
	VideoForDevelopmentRefForwardingFunction,
);
