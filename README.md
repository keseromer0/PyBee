# 🐝 PyBee - Python Coding App for iPad

PyBee is a Python coding application designed for iPad. Write, edit, and execute Python code directly in your browser with a modern, iPad-friendly interface.

## Features

✨ **Core Features**
- 📝 Syntax-highlighted Python code editor (powered by Monaco Editor)
- ▶️ Run Python code directly in your browser (powered by Pyodide)
- 📊 Real-time output display
- 📱 Fully responsive iPad layout
- 🌙 Dark theme optimized for coding
- 🧪 Built-in code examples

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/keseromer0/PyBee.git
cd PyBee
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173` or access it on your iPad

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Usage

1. **Write Code**: Type your Python code in the left editor panel
2. **Run**: Click the "▶ Run Code" button to execute your code
3. **View Output**: See the results in the output panel on the right
4. **Clear Output**: Click "🗑 Clear Output" to clear the terminal
5. **Try Examples**: Use the example buttons to load sample code

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Monaco Editor** - Code editor component
- **Pyodide** - Python runtime in the browser
- **CSS3** - Responsive styling

## Project Structure

```
PyBee/
├── src/
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styling
│   ├── index.css        # Global styles
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## Roadmap

- [ ] Save/load code files
- [ ] Multiple Python examples and tutorials
- [ ] Code sharing feature
- [ ] Dark/Light theme toggle
- [ ] Installable PWA (home screen app)
- [ ] Advanced Python libraries support
- [ ] Code formatting (Prettier)
- [ ] Keyboard shortcuts

## Limitations

- Python runs in the browser via Pyodide, so some packages may not be available
- File system access is limited (can't directly access iPad files)
- Network requests may be restricted

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT License - feel free to use this project for personal or commercial purposes

## Author

Created by keseromer0

## Support

Having issues? Try:
1. Clear your browser cache
2. Refresh the page
3. Open in a fresh browser tab
4. Check the browser console for error messages

---

**Happy coding! 🐝💻**
