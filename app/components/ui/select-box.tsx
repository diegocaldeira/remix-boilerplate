import { useState } from "react"

function MyCustomMultiselect({ items, onSubmit }) {
  const [selectedItems, setSelectedItems] = useState([])

  const handleCheckboxChange = (itemKey) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemKey)) {
        return prevSelectedItems.filter((key) => key !== itemKey)
      } else {
        return [...prevSelectedItems, itemKey]
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault() // Prevenir o comportamento padrão de recarregar a página
    onSubmit(selectedItems) // Passar os itens selecionados para a função de submit
  }

  return (
    <form onSubmit={handleSubmit}>
      {items.map((item) => (
        <div
          key={item.keyname}
          onClick={() => handleCheckboxChange(item.keyname)}
          className={`my-7 flex cursor-pointer items-start gap-2 rounded-xl border p-4 ${
            selectedItems.includes(item.keyname)
              ? "border-indigo-400 bg-indigo-100 shadow-md shadow-indigo-400/50"
              : "border-gray-300 bg-white"
          }`}
        >
          <div
            className={`h-5 w-5 rounded border ${
              selectedItems.includes(item.keyname)
                ? "border-indigo-400 bg-indigo-400"
                : "border-gray-300 bg-white"
            }`}
          >
            {selectedItems.includes(item.keyname) && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div>
            <div className="wrap-balance bg-black bg-gradient-to-br bg-clip-text text-left text-xl font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:leading-tight">
              {item.name}
            </div>
            <div className="wrap-balance bg-black bg-gradient-to-br bg-clip-text text-left leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:leading-tight">
              {item.description}
            </div>
          </div>
        </div>
      ))}
      <button type="submit" className="mt-4 rounded bg-blue-500 p-2 text-white">
        Submit
      </button>
    </form>
  )
}
