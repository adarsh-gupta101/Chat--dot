// hook to map models with sub model

let submodels: { [key: string]: string[] }[] = [
  {
    claude: [
      "claude-3-haiku",
      "claude-3-sonnet",
      "claude-3-5-sonnet",
      "claude-3-opus",
    ],
    openai: ["gpt-3.5-turbo", "gpt-4o", "gpt-4omini"],
    google: ["gemini-1.5-flash", "gemini-1.5-pro"],
    meta: ["llama-3.1-70b", "llama-3.1-405b"],
  },
];

export function useSubModels(model: string) {
  return submodels[0][model];
}
