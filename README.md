# WebP Wizard

![License](https://img.shields.io/github/license/ManishRShetty/webp-wizard)
![Stars](https://img.shields.io/github/stars/ManishRShetty/webp-wizard)
![Languages](https://img.shields.io/github/languages/top/ManishRShetty/webp-wizard)

WebP Wizard is a tool designed to make image conversion to [WebP format](https://developers.google.com/speed/webp) simple, fast, and efficient. With newly added **AI-powered features**, WebP Wizard not only compresses images but intelligently optimizes them for quality and content—helping you deliver the best visuals with the smallest files.

---

## Features

- **Batch Conversion**: Convert multiple images to WebP format in one go.
- **Lossless & Lossy Compression**: Choose your preferred compression type for the best balance of size and quality.
- **AI-Powered Quality Optimization**: Automatically adjust compression settings based on image content, using AI to ensure optimal perceived visual quality at minimal size.
- **AI Image Enhancement**: Use optional AI upscaling and denoising before conversion for sharper results.
- **Smart Format Suggestion**: AI selects best-suited settings (lossy/lossless, quality level) for each input image.
- **Command-line Interface**: Script and automate your image conversion workflows.
- **Preserves Metadata**: Keep important metadata like EXIF, color profiles, and more.
- **Cross-Platform**: Works on major operating systems.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (if implemented in JavaScript/TypeScript)
- Or relevant installation for alternative language (Python, Go, Rust, etc.)

### Installation

Clone the repository:
```bash
git clone https://github.com/ManishRShetty/webp-wizard.git
cd webp-wizard
```

Install dependencies:
```bash
npm install
```
*(Or follow language-specific setup if not Node.js — update as applicable.)*

### Usage

**Basic usage example:**
```bash
node index.js input.jpg
```

**Batch convert a folder:**
```bash
node index.js ./images/
```

**Enable AI-powered features:**
```bash
node index.js --ai-optimize input.jpg
```

**More advanced options:**
```bash
node index.js --quality 90 --lossless ./assets/
```

For a full list of options:
```
node index.js --help
```

---

## Example

**Single file with AI optimization:**
```bash
webp-wizard --ai-optimize photo.png
```

**Batch processing:**
```bash
webp-wizard images/*.jpg
```

---

## Roadmap

- [ ] GUI application
- [ ] Integration with cloud storage
- [x] AI-powered quality and enhancement features
- [ ] AI-based image categorization for further automation
- [ ] Support for additional formats

---

## AI Features: Details

### AI-Powered Optimization

WebP Wizard uses integrated AI models to:
- Analyze image content (e.g., faces, text, landscapes).
- Dynamically determine compression levels for *each* image to minimize artifacts.
- Optionally enhance sharpness or reduce noise using AI before conversion.

This ensures a balance between tiny file size and visually optimal quality—without guesswork.

### Smart Suggestions

The AI assistant can recommend:
- Whether to use lossy or lossless conversion per image.
- The best quality settings based on the detected content and its importance.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [WebP documentation](https://developers.google.com/speed/webp)
- Contributors and testers
- AI component powered by open-source models and research

---

## Contact

For questions or support, open an [issue](https://github.com/ManishRShetty/webp-wizard/issues) or reach out via [GitHub Discussions](https://github.com/ManishRShetty/webp-wizard/discussions).

---

*Happy optimizing with WebP Wizard!*
