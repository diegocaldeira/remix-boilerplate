import React, { useState } from "react"

const CopyTextBox = () => {
  const [text, setText] = useState("")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Text copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div style={{ margin: "20px" }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button
        onClick={handleCopy}
        style={{ padding: "10px", marginLeft: "10px" }}
      >
        Copy
      </button>
    </div>
  )
}

export default CopyTextBox
