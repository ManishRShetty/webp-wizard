# WebP Wizard

![License](https://img.shields.io/github/license/ManishRShetty/webp-wizard)
![Stars](https://img.shields.io/github/stars/ManishRShetty/webp-wizard)
![Languages](https://img.shields.io/github/languages/top/ManishRShetty/webp-wizard)

WebP Wizard is a tool designed to make image conversion to [WebP format](https://developers.google.com/speed/webp) simple, fast, and efficient. Whether you’re optimizing images for a website, app, or digital project, WebP Wizard helps you squeeze the best performance out of your assets without sacrificing quality.

---

## Features

- **Batch Conversion**: Convert multiple images to WebP format in one go.
- **Lossless & Lossy Compression**: Choose your preferred compression type for the best balance of size and quality.
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

Basic usage example:
```bash
node index.js input.jpg
```

Batch convert a folder:
```bash
node index.js ./images/
```

More advanced options:
```
node index.js --quality 90 --lossless ./assets/
```

For a full list of options:
```
node index.js --help
```

---

## Example

**Single file:**
```bash
webp-wizard photo.png
```

**Batch processing:**
```bash
webp-wizard images/*.jpg
```

---

## Roadmap

- [ ] GUI application
- [ ] Integration with cloud storage
- [ ] Support for additional formats

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

---

## Contact

For questions or support, open an [issue](https://github.com/ManishRShetty/webp-wizard/issues) or reach out via [GitHub Discussions](https://github.com/ManishRShetty/webp-wizard/discussions).

---

*Happy optimizing with WebP Wizard!*
