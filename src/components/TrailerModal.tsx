import React from "react";

interface TrailerModalProps {
  isOpen: boolean;
  trailerKey: string;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, trailerKey, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative w-full max-w-4xl bg-transparent p-0 rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ×
        </button>
        <div className="w-full h-auto">
          <iframe
            width="100%"
            height="400px"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            style={{ border: "none", display: "block" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
