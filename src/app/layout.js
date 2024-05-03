import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatDataGen",
  description: "Generate high-quality chat datasets for training conversational AI models.",
  keywords: "chat data, conversational AI, dataset generation, natural language processing, chat dataset, chatbot training data, AI chat, conversation dataset, NLP dataset, language model training, text generation, dialogue generation, chatbot development, machine learning, artificial intelligence, AI models, conversation generation, chatbot training, data science, chat data collection, chat corpus, dialogue dataset, text dataset, conversation analysis, conversation modeling, language understanding, chatbot dataset, training data generation, dialogue corpus, conversational data, AI conversation, chat history, message dataset, language model development, conversation simulation, AI language, virtual assistant training, text corpus, dialogue modeling, conversation simulator, dialogue training data, conversational dataset, conversational interface, chatbot corpus, conversation engine, dialogue system, chatbot architecture, machine learning dataset, AI training data, chatbot learning, chatbot simulator, chatbot AI, conversational agent, conversation API, virtual conversation, NLP training data, AI dialogue, conversation analytics, chatbot platform",
  author: "InnovateXcel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
