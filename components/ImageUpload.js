import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import foodLabels101 from '../public/food_labels.json';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);

  // Load the TensorFlow.js model from the public directory
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tf.loadGraphModel('/food_model_js/model.json');
      setModel(loadedModel);
      console.log('Model loaded successfully');
    };
    loadModel();
  }, []);

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  // Preprocess the image and run predictions using the model
  const handleImageUpload = async () => {
    if (image && model) {
      const imgElement = document.getElementById('uploaded-image');
      const tensorImg = tf.browser.fromPixels(imgElement)
        .resizeNearestNeighbor([224, 224])  // Resize to model input size
        .toFloat()
        .expandDims();  // Add batch dimension

      const predictions = await model.predict(tensorImg).data();
      const topPredictions = getTopPredictions(predictions, 5);  // Get top 5 predictions
      setPredictions(topPredictions);
    } else {
      alert('Please upload an image and wait for the model to load!');
    }
  };

  // Helper function to get top predictions
  const getTopPredictions = (predictions, topK) => {
    const predictionArray = Array.from(predictions).map((probability, index) => ({
      index,
      probability
    }));

    const topKPredictions = predictionArray.sort((a, b) => b.probability - a.probability).slice(0, topK);

    const foodLabels = foodLabels101;;

    return topKPredictions.map(pred => ({
      className: foodLabels[pred.index] || 'Unknown',
      probability: pred.probability
    }));
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <form onSubmit={(e) => e.preventDefault()}>
        <label className="block text-gray-700 text-sm font-medium mb-4">
          Upload a photo of your fridge
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
        />

        {preview && (
          <div className="mt-4">
            <img id="uploaded-image" src={preview} alt="Preview" className="w-full h-auto max-w-sm rounded-lg shadow-lg" />
          </div>
        )}

        <button
          type="button"
          onClick={handleImageUpload}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg"
        >
          Detect Ingredients
        </button>

        {predictions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-500">Detected Ingredients:</h3>
            <ul className="list-disc list-inside text-gray-500">
              {predictions.map((prediction, index) => (
                <li key={index}>
                  {prediction.className} ({(prediction.probability * 100).toFixed(2)}%)
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
