import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import './App.css'

const defaultCode = `# Welcome to PyBee!
# Write your Python code here and press Run.

print("Hello from PyBee! 🐝")
print("Let's code Python on your iPad!")

# Try some math
result = 10 + 5
print(f"10 + 5 = {result}")

# Example list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}!")
`

const examples = {
  stars: `# Example: Star pyramid
for i in range(1, 6):
    print("⭐" * i)`,
  math: `# Example: Multiplication table
for num in range(1, 11):
    print(f"{num} x 5 = {num * 5}")`,
  names: `# Example: Favorite fruits
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}!")`
}

function App() {
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem('pybee-code')
    return saved || defaultCode
  })
  const [output, setOutput] = useState('✅ PyBee is ready. Press Run to execute code.')
  const [isRunning, setIsRunning] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [status, setStatus] = useState('Loading Python runtime...')
  const pyodideRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('pybee-code', code)
  }, [code])

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const { loadPyodide: load } = await import('pyodide')
        const pyodide = await load({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
        })
        pyodideRef.current = pyodide
        setIsReady(true)
        setStatus('Python runtime ready')
      } catch (error) {
        setStatus('Runtime failed to load')
        setOutput(`❌ Failed to load Python runtime: ${error.message}`)
      }
    }

    loadPyodide()
  }, [])

  const handleRun = async () => {
    if (!pyodideRef.current) {
      setOutput('⏳ Python is still loading. Please wait a moment.')
      return
    }

    setIsRunning(true)
    setStatus('Running code...')
    setOutput('')

    try {
      const pyodide = pyodideRef.current
      let buffer = ''

      pyodide.setStdout({
        batched: (text) => {
          buffer += text
          setOutput((prev) => prev + text)
        }
      })

      pyodide.setStderr({
        batched: (text) => {
          buffer += text
          setOutput((prev) => prev + text)
        }
      })

      await pyodide.runPythonAsync(code)

      if (!buffer.trim()) {
        setOutput('✅ Script executed successfully with no output.')
      } else {
        setOutput((prev) => prev + '\n✅ Script executed successfully.')
      }

      setStatus('Execution finished')
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`)
      setStatus('Execution error')
    } finally {
      setIsRunning(false)
    }
  }

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/x-python' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pybee.py'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setStatus('Saved as pybee.py')
  }

  const handleLoadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileLoad = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      setCode(text)
      setStatus(`Loaded ${file.name}`)
      setOutput(`📁 Loaded ${file.name}`)
    } catch (error) {
      setOutput(`❌ Could not load file: ${error.message}`)
    } finally {
      event.target.value = ''
    }
  }

  const handleReset = () => {
    setCode(defaultCode)
    setStatus('Code reset to starter example')
    setOutput('🧹 Starter code restored.')
  }

  const loadExample = (exampleKey) => {
    const selected = examples[exampleKey]
    setCode(selected)
    setStatus(`Loaded ${exampleKey} example`)
    setOutput(`📘 Example loaded: ${exampleKey}`)
  }

  return (
    <div className="pybee-app">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">🐝</div>
          <div>
            <h1>PyBee</h1>
            <p>Python workspace</p>
          </div>
        </div>

        <div className="status-pill">
          <span className={`status-dot ${isReady ? 'ready' : 'loading'}`} />
          {status}
        </div>
      </header>

      <div className="toolbar">
        <button className="primary" onClick={handleRun} disabled={isRunning || !isReady}>
          {isRunning ? 'Running...' : 'Run code'}
        </button>
        <button className="secondary" onClick={handleSave}>Save file</button>
        <button className="secondary" onClick={handleLoadClick}>Load file</button>
        <button className="secondary" onClick={handleReset}>Reset</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".py,.txt"
          style={{ display: 'none' }}
          onChange={handleFileLoad}
        />
      </div>

      <div className="example-row">
        <button onClick={() => loadExample('stars')}>Star pattern</button>
        <button onClick={() => loadExample('math')}>Math loop</button>
        <button onClick={() => loadExample('names')}>Fruit list</button>
      </div>

      <main className="workspace">
        <section className="panel editor-panel">
          <div className="panel-header">
            <span>Editor</span>
          </div>

          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              tabSize: 4,
              padding: { top: 16, bottom: 16 }
            }}
          />
        </section>

        <section className="panel console-panel">
          <div className="panel-header">
            <span>Console</span>
          </div>
          <pre className="console-output">{output}</pre>
        </section>
      </main>
    </div>
  )
}

export default App
