import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import './App.css'

function App() {
  const [code, setCode] = useState(`# Welcome to PyBee!
# Write your Python code here and press Run

print("Hello from PyBee! 🐝")
print("Let's code Python on your iPad!")

# Try some math
result = 10 + 5
print(f"10 + 5 = {result}")
`)

  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const pyodideRef = useRef(null)

  // Initialize Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      const { loadPyodide: load } = await import('pyodide')
      const pyodide = await load()
      pyodideRef.current = pyodide
      setOutput('✅ PyBee Ready! Press Run to execute code.')
    }

    loadPyodide().catch(err => {
      setOutput(`❌ Error loading Python: ${err.message}`)
    })
  }, [])

  // Handle code execution
  const handleRun = async () => {
    if (!pyodideRef.current) {
      setOutput('⏳ Python is still loading... try again in a moment')
      return
    }

    setIsRunning(true)
    setOutput('⏳ Running...\n')

    try {
      const pyodide = pyodideRef.current
      
      // Capture output
      let capturedOutput = ''
      const oldLog = console.log
      
      pyodide.setStdout({
        batched: (text) => {
          capturedOutput += text
          setOutput(prev => prev + text)
        }
      })

      // Run the code
      await pyodide.runPythonAsync(code)
      
      if (capturedOutput === '') {
        setOutput('✅ Code executed successfully (no output)')
      } else {
        setOutput('✅ Code executed successfully!\n\n' + capturedOutput)
      }
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  // Clear output
  const handleClear = () => {
    setOutput('')
  }

  // Load example code
  const loadExample = (exampleCode) => {
    setCode(exampleCode)
    setOutput('📝 Example loaded! Press Run to execute.')
  }

  return (
    <div className="pybee-container">
      {/* Header */}
      <header className="pybee-header">
        <h1>🐝 PyBee</h1>
        <p>Python Coding on iPad</p>
      </header>

      {/* Main content */}
      <div className="pybee-main">
        {/* Editor section */}
        <div className="editor-section">
          <h2>Code Editor</h2>
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 4,
            }}
          />
        </div>

        {/* Output section */}
        <div className="output-section">
          <h2>Output</h2>
          <pre className="output-box">{output}</pre>
        </div>
      </div>

      {/* Control buttons */}
      <div className="pybee-controls">
        <button 
          className="btn btn-run" 
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Running...' : '▶ Run Code'}
        </button>
        
        <button 
          className="btn btn-clear" 
          onClick={handleClear}
        >
          🗑 Clear Output
        </button>

        <div className="btn-group">
          <button 
            className="btn btn-example"
            onClick={() => loadExample(`# Example: Print Stars
for i in range(1, 6):
    print("⭐" * i)`)}
          >
            ⭐ Example 1
          </button>
          
          <button 
            className="btn btn-example"
            onClick={() => loadExample(`# Example: Loop
for num in range(1, 11):
    print(f"{num} x 5 = {num * 5}")`)}
          >
            🔢 Example 2
          </button>

          <button 
            className="btn btn-example"
            onClick={() => loadExample(`# Example: List
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}!")`)}
          >
            🍎 Example 3
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
