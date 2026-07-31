import { useEffect, useRef } from 'react';
import type { FaceLandmarks, HandLandmarks, PoseLandmarks } from '../../vision/types/Vision.types';

export interface LandmarksOverlayProps {
  hands: HandLandmarks | null;
  pose?: PoseLandmarks | null;
  face?: FaceLandmarks | null;
  enableLandmarks?: boolean;
}

// MediaPipe 21 Hand Topology Connections
const HAND_CONNECTIONS: Array<[number, number]> = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [5, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [9, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [13, 17], [17, 18], [18, 19], [19, 20],
  // Palm base
  [0, 17],
];

export function LandmarksOverlay({
  hands,
  pose,
  face,
  enableLandmarks = true,
}: LandmarksOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas resolution match to container element
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Clear frame canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!enableLandmarks) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Hand Landmarks & Skeleton
    if (hands && hands.landmarks) {
      hands.landmarks.forEach((handPoints) => {
        if (!handPoints || handPoints.length === 0) return;

        // Draw connections
        ctx.strokeStyle = '#a855f7'; // Purple line
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';

        HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
          const startPt = handPoints[startIdx];
          const endPt = handPoints[endIdx];
          if (startPt && endPt) {
            ctx.beginPath();
            ctx.moveTo((1 - startPt.x) * width, startPt.y * height); // Mirror X coordinate
            ctx.lineTo((1 - endPt.x) * width, endPt.y * height);
            ctx.stroke();
          }
        });

        // Draw keypoint nodes & index numbers
        handPoints.forEach((pt, idx) => {
          const x = (1 - pt.x) * width;
          const y = pt.y * height;

          // Keypoint circle
          ctx.fillStyle = idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20 ? '#ec4899' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();

          // Landmark Index Number
          ctx.fillStyle = '#ffffff';
          ctx.font = '9px sans-serif';
          ctx.fillText(idx.toString(), x + 5, y - 5);
        });
      });
    }

    // 2. Draw Pose Landmarks (if available)
    if (pose && pose.landmarks) {
      pose.landmarks.forEach((posePoints) => {
        posePoints.forEach((pt) => {
          const x = (1 - pt.x) * width;
          const y = pt.y * height;
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        });
      });
    }

    // 3. Draw Face Landmarks (if available)
    if (face && face.landmarks) {
      face.landmarks.forEach((facePoints) => {
        facePoints.forEach((pt, idx) => {
          // Render a subset or light mesh outline for face
          if (idx % 4 === 0) {
            const x = (1 - pt.x) * width;
            const y = pt.y * height;
            ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      });
    }
  }, [hands, pose, face, enableLandmarks]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}

export default LandmarksOverlay;
