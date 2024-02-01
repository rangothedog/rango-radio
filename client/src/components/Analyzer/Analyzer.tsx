import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';

import styles from './Analyzer.css';

export interface AnalyzerData {
  analyzer: AnalyserNode,
  bufferLength: number,
  dataArray: Uint8Array
}

export interface AnalyzerProps {
  data?: AnalyzerData;
  isPlaying?: boolean;
}

export function Analyzer(props: AnalyzerProps) {  
  console.log("Analyzer", props);
  console.log("Analyzer.styles", styles);

  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(props.data?.analyzer ?? null);
  const [dataArray, setDatatArray] = useState<Uint8Array | null>(props.data?.dataArray ?? null);
  const [bufferLength, setBufferLength] = useState<number>(props.data?.bufferLength ?? 0);
  const [isPlaying, setIsPlaying] = useState<boolean>(props.isPlaying ?? false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function animateBars(analyser, canvas, canvasCtx, dataArray, bufferLength) {
    
    console.log("Analyzer.animateBars", analyser, canvas, canvasCtx, dataArray, bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
      canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  const draw = (dataArray, analyzer, bufferLength, canvas) => {    
    if (canvas && analyzer) {      
      const canvasCtx = canvas.getContext("2d");
      console.log("Analyzer.draw", canvasCtx);
      const animate = () => {
        requestAnimationFrame(animate);
        canvas.width = canvas.width;
        animateBars(analyzer, canvas, canvasCtx, dataArray, bufferLength);
      };
      animate();
    }
  };

  // Effect to draw the waveform on mount and update
  useEffect(() => {
    console.log("Analyzer.useEffect", canvasRef.current);
    draw(dataArray, analyzer, bufferLength, canvasRef.current);
  }, [dataArray, analyzer, bufferLength, canvasRef.current, isPlaying]);

  // Return the canvas element
  return (
    <canvas
      className={"audio-analyzer"}
      ref={canvasRef}
    />
  );
};
