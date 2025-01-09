import React from "react";

const features = [
  {
    title: "Chat With All Claude, Google, OpenAI Models Simultaneously",
    description:
      "Ask the same question to different models and see how they respond.",
    icon: "💬",
    bgColor: "bg-blue-100",
  },
  {
    title: "Chat Individually with Each Models",
    description: "Chat with each model individually with an Intuitive UI.",
    icon: "💡",
    bgColor: "bg-green-100",
  },
  {
    title: "Create React Components on the fly (Beta)",
    description:
      "Just type the name of the component and what it does and boom... get the code for it.",
    icon: "💻",
    bgColor: "bg-purple-100",
  },
  {
    title: "Save up to 80% on your AI expenses!",
    description: "Get access to all AI models at a fraction of the cost.",
    icon: "💰",
    bgColor: "bg-red-100",
  },
  {
    title: "No Feature Limitations",
    description:
      "Access all features without any restrictions or hidden costs.",
    icon: "⚡",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Seamless Integration",
    description: "Easy to integrate with your existing workflow and tools.",
    icon: "🔧",
    bgColor: "bg-indigo-100",
  },
];

const FeaturesSection = () => {
  return (
    <div className=" py-12 h-[10/12] flex flex-col justify-center items-center bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-800 sm:text-4xl">
            Powerful Features at Your Fingertips
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            All the tools you need to maximize your AI potential
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg hover:shadow transition duration-300 border border-gray-300 shadow-lg 	`}
            >
              <div
                className={`text-2xl w-12 h-12 flex items-center ${feature.bgColor} justify-center rounded-full bg-opacity-80 dark:text-white`}
              >
                {feature.icon}
              </div>
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 ">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-800">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
