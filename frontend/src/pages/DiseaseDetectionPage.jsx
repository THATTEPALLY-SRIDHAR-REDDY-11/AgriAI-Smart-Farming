import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { diseaseService } from '../services/diseaseService';
import { ErrorAlert } from '../components/ErrorAlert';
import { UploadCloud, Image as ImageIcon, Scan, CheckCircle2, Bot, Info } from 'lucide-react';

export const DiseaseDetectionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid leaf image file (JPG/PNG).');
      return;
    }
    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');

    try {
      const result = await diseaseService.predictDisease(user.profileId, selectedFile);
      setPrediction(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze crop image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToAdvisory = () => {
    if (prediction) {
      navigate('/farmer/advisory', {
        state: {
          crop: prediction.crop,
          disease: prediction.disease,
          confidence: prediction.confidence
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">AI Crop Disease Detection</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload a clear photograph of an affected crop leaf to classify diseases using MobileNetV2 transfer learning.
        </p>
      </div>

      <ErrorAlert message={error} />

      {/* Drag & Drop Upload Container */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-white shadow-sm ${
          selectedFile ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 hover:border-emerald-400'
        }`}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Leaf Preview"
              className="w-64 h-64 object-cover rounded-2xl mx-auto border-4 border-white shadow-lg"
            />
            <div className="flex justify-center gap-3">
              <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Analyzing with MobileNetV2...' : <><Scan className="w-4 h-4" /> Run AI Diagnosis</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Drag & Drop Leaf Image Here</h3>
              <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
            </div>
            <label className="inline-block cursor-pointer px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-200 transition-colors">
              Choose Image File
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Prediction Result Display */}
      {prediction && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Diagnosis Complete</h3>
                <p className="text-xs text-slate-500">MobileNetV2 Classification Output</p>
              </div>
            </div>

            {prediction.is_mock && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Info className="w-3.5 h-3.5" /> Dev Mode Simulation
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Crop Type</p>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{prediction.crop}</h4>
            </div>

            <div className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Detected Condition</p>
              <h4 className="text-2xl font-extrabold text-emerald-900 mt-1">{prediction.disease}</h4>
            </div>
          </div>

          {/* Confidence Score Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-700">MobileNetV2 Model Confidence</span>
              <span className="text-emerald-700">{(prediction.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                style={{ width: `${prediction.confidence * 100}%` }}
              />
            </div>
          </div>

          {/* AI Advisory Action Trigger */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleGoToAdvisory}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 text-sm"
            >
              <Bot className="w-5 h-5" /> Get AI Grounded Advisory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetectionPage;
