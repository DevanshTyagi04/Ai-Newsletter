export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/70 via-purple-500/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold md:text-6xl text-gray-900">
            Smarter News, Just for You
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Get personalized, AI-powered newsletters based on your interests.
            Delivered daily, weekly, or bi-weekly — straight to your inbox.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/signin"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
            >
              Get Started
            </a>
            <a
              href="/learn-more"
              className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-white via-indigo-50/30 to-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Newsletter?
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-indigo-600">
              🎯 Tailored to You
            </h3>
            <p className="mt-3 text-gray-600">
              Choose from tech, finance, sports, and more. Get only the news you
              actually care about.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-purple-600">
              🤖 AI Summarized
            </h3>
            <p className="mt-3 text-gray-600">
              Skip the noise. Our AI condenses multiple articles into clear,
              concise newsletters.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-pink-600">
              ⏰ Automated Delivery
            </h3>
            <p className="mt-3 text-gray-600">
              Pick your frequency: daily, weekly, or bi-weekly. Sit back while
              we handle the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        {/* Soft Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/40 via-pink-400/30 to-transparent" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to stay ahead?
          </h2>
          <p className="mt-4 text-gray-700">
            Join now and get your personalized newsletter delivered straight to
            your inbox.
          </p>
          <a
            href="/signin"
            className="mt-8 inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
          >
            Sign Up Free
          </a>
        </div>
      </section>
    </main>
  );
}
