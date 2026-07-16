import { type RefObject, useCallback, useEffect, useRef } from "react";

const MIN_CALIBRATION = 0.5;
const MAX_CALIBRATION = 1.6;
const CALIBRATION_BOUNDARY = 150;

type ScrollState = {
	generation: number;
	keyDownCode: string | null;
};

/**
 * Vimium-style scrolling: a tap always travels the full distance, while holding
 * the key continues the same animation until keyup.
 */
export function useSmoothShortcutScroll(
	targetRef: RefObject<HTMLElement | null>,
	distance = 100,
) {
	const stateRef = useRef<ScrollState>({
		generation: 0,
		keyDownCode: null,
	});
	const animationFramesRef = useRef(new Set<number>());

	useEffect(() => {
		const stopContinuousScroll = (event: KeyboardEvent) => {
			const state = stateRef.current;
			if (event.code === state.keyDownCode) {
				state.keyDownCode = null;
				state.generation += 1;
			}
		};
		const stopOnBlur = () => {
			stateRef.current.keyDownCode = null;
			stateRef.current.generation += 1;
		};

		window.addEventListener("keyup", stopContinuousScroll);
		window.addEventListener("blur", stopOnBlur);
		return () => {
			window.removeEventListener("keyup", stopContinuousScroll);
			window.removeEventListener("blur", stopOnBlur);
			for (const frameId of animationFramesRef.current) {
				cancelAnimationFrame(frameId);
			}
			animationFramesRef.current.clear();
		};
	}, []);

	const scroll = useCallback(
		(direction: -1 | 1, event: KeyboardEvent) => {
			const element = targetRef.current;
			if (!element || !distance || event.repeat) return;

			const state = stateRef.current;
			state.generation += 1;
			state.keyDownCode = event.code;
			const activationGeneration = state.generation;
			const amount = Math.abs(distance);
			const duration = Math.max(100, 20 * Math.log(amount));

			let totalDelta = 0;
			let totalElapsed = 0;
			let calibration = 1;
			let previousTimestamp: number | null = null;

			const scheduleFrame = (animate: FrameRequestCallback) => {
				const frameId = requestAnimationFrame((timestamp) => {
					animationFramesRef.current.delete(frameId);
					animate(timestamp);
				});
				animationFramesRef.current.add(frameId);
			};

			const animate: FrameRequestCallback = (timestamp) => {
				if (previousTimestamp === null) {
					previousTimestamp = timestamp;
					scheduleFrame(animate);
					return;
				}

				const elapsed = timestamp - previousTimestamp;
				previousTimestamp = timestamp;
				totalElapsed += elapsed;

				const isKeyStillDown =
					stateRef.current.generation === activationGeneration &&
					stateRef.current.keyDownCode !== null;

				if (
					isKeyStillDown &&
					totalElapsed >= 75 &&
					calibration >= MIN_CALIBRATION &&
					calibration <= MAX_CALIBRATION
				) {
					if (1.05 * calibration * amount < CALIBRATION_BOUNDARY) {
						calibration *= 1.05;
					}
					if (CALIBRATION_BOUNDARY < 0.95 * calibration * amount) {
						calibration *= 0.95;
					}
				}

				let delta = Math.ceil((amount * elapsed * calibration) / duration);
				if (!isKeyStillDown) {
					delta = Math.max(0, Math.min(delta, amount - totalDelta));
				}

				const before = element.scrollTop;
				element.scrollTop += direction * delta;
				if (delta > 0 && element.scrollTop !== before) {
					totalDelta += delta;
					scheduleFrame(animate);
				}
			};

			scheduleFrame(animate);
		},
		[distance, targetRef],
	);

	const scrollDown = useCallback(
		(event: KeyboardEvent) => scroll(1, event),
		[scroll],
	);
	const scrollUp = useCallback(
		(event: KeyboardEvent) => scroll(-1, event),
		[scroll],
	);

	return { scrollDown, scrollUp };
}
