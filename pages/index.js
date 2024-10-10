import ImageUpload from '../components/ImageUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-7">
      <div className=" rounded-lg p-1 ">
      <h1 className="text-8xl font-semibold italic text-green-800 mb-6" >
      <span className="not-italic text-7xl">🥒</span> wimf <span className="not-italic text-7xl">🥑</span>
        </h1>
      </div>
      <p className="text-gray-500 text-lg mb-8 p-2">What's In My Fridge?</p>

      {/* Image Upload Component */}
      <ImageUpload />

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-gray-600 text-sm">
          Discover recipes based on the ingredients in your fridge!
        </p>
        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg">
          Explore Recipes
        </button>
      </footer>
    </div>
  );
}