// client/src/components/Room/Whiteboard.jsx
import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Pen, Trash2, Download } from 'lucide-react';

function Whiteboard({ socket, roomId, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // 'pen' or 'eraser'
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set initial context properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load existing whiteboard data
    if (socket) {
      socket.on('whiteboard-data', (data) => {
        if (data && data.length > 0) {
          setPaths(data);
          redrawCanvas(data);
        }
      });

      socket.on('whiteboard-draw', (data) => {
        if (data && data.length > 0) {
          setPaths(data);
          redrawCanvas(data);
        }
      });

      socket.on('whiteboard-clear', () => {
        setPaths([]);
        clearCanvas();
      });

      // Request initial whiteboard data
      socket.emit('get-whiteboard-data', { roomId });
    }

    return () => {
      if (socket) {
        socket.off('whiteboard-data');
        socket.off('whiteboard-draw');
        socket.off('whiteboard-clear');
      }
    };
  }, [socket, roomId]);

  const redrawCanvas = (pathsData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pathsData.forEach((path) => {
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.lineWidth;
      ctx.globalCompositeOperation = path.tool === 'eraser' ? 'destination-out' : 'source-over';

      ctx.beginPath();
      path.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    
    const newPath = {
      color: color,
      lineWidth: lineWidth,
      tool: tool,
      points: [pos]
    };

    setPaths(prev => [...prev, newPath]);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    setPaths(prev => {
      const newPaths = [...prev];
      const currentPath = newPaths[newPaths.length - 1];
      currentPath.points.push(pos);

      // Draw the line segment
      ctx.strokeStyle = currentPath.color;
      ctx.lineWidth = currentPath.lineWidth;
      ctx.globalCompositeOperation = currentPath.tool === 'eraser' ? 'destination-out' : 'source-over';

      const points = currentPath.points;
      const lastPoint = points[points.length - 2];

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      return newPaths;
    });
  };

  const stopDrawing = () => {
    if (isDrawing && socket) {
      socket.emit('whiteboard-draw', {
        roomId,
        data: paths
      });
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    setPaths([]);
    clearCanvas();
    
    if (socket) {
      socket.emit('whiteboard-clear', { roomId });
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Collaborative Whiteboard</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-700 flex items-center gap-4 flex-wrap">
          {/* Tool Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-colors ${
                tool === 'pen' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Pen"
            >
              <Pen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-colors ${
                tool === 'eraser' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Eraser"
            >
              <Eraser className="w-5 h-5" />
            </button>
          </div>

          {/* Color Palette */}
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === c ? 'border-purple-500 scale-110' : 'border-gray-600'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Line Width */}
          <div className="flex items-center gap-2 text-white">
            <label className="text-sm">Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm w-8">{lineWidth}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white flex items-center gap-2"
              title="Clear whiteboard"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white flex items-center gap-2"
              title="Download whiteboard"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-full bg-white rounded-lg cursor-crosshair"
          />
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;