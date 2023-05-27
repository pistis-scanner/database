
export enum Language {
  Python = "Python",
  Java = "Java",
  Javascript = "Javascript",
  PHP = "PHP",
  Erleng = "Erleng",
  Go = "Go",
  Ruby = "Ruby",
  DotNet = "dotnet",
  Dart = "dart",
  Rust = "rust",
}

export enum Ecosystem {
  Python = "PyPI",
  Java = "Maven",
  Javascript = "npm",
  PHP = "Packagist",
  Erleng = "Hex",
  Go = "Go",
  Ruby = "RubyGems",
  DotNet = "NuGet",
  Dart = "Pub",
  Rust = "crates.io",
}


export const Languages = [
  { name: Language.Python, ecosystem: Ecosystem.Python },
  { name: Language.Java, ecosystem: Ecosystem.Java },
  { name: Language.Javascript, ecosystem: Ecosystem.Javascript },
  { name: Language.PHP, ecosystem: Ecosystem.PHP },
  { name: Language.Erleng, ecosystem: Ecosystem.Erleng },
  { name: Language.Go, ecosystem: Ecosystem.Go },
  { name: Language.Ruby, ecosystem: Ecosystem.Ruby },
  { name: Language.DotNet, ecosystem: Ecosystem.DotNet },
  { name: Language.Dart, ecosystem: Ecosystem.Dart },
  { name: Language.Rust, ecosystem: Ecosystem.Rust },

]


export const getSupportedLanguages = () => [Language.Python, Language.Javascript]

export const getEcosystemForLanguage = (language: Language) => {
  return Languages.find((l) => l.name === language)?.ecosystem
}

export const getLanguageForEcosystem = (ecosystem: Ecosystem) => {
  return Languages.find((l) => l.ecosystem === ecosystem)?.name
}

export const getSupportedEcosystems = () => {
  return getSupportedLanguages().map((l) => getEcosystemForLanguage(l))
}
