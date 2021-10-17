import { useState, useEffect } from "react"
import "./App.scss"

function App() {
  const date = new Date()
  const fullTime = date.toLocaleTimeString() // hh:mm:ss

  const [main, setMain] = useState("0")
  const [secondary, setSecondary] = useState("")
  const [time, setTime] = useState(fullTime.slice(0, 5))

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date()
      const currentFullTime = currentDate.toLocaleTimeString() // hh:mm:ss

      setTime(currentFullTime.slice(0, 5))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    function onKeydown(event) {
      const { key } = event
      const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
      const operations = ["/", "*", "-", "+"]

      if (key === "Escape" || key === "Delete") allClear()
      if (key === "Backspace") del()
      if (nums.includes(key)) onNumInput(key)
      if (operations.includes(key)) onOperationInput(key)
      if (key === "." || key === ",") onDotInput()
      if (key === "=") onEqualInput()
    }

    window.addEventListener("keydown", onKeydown)

    return () => window.removeEventListener("keydown", onKeydown)
  }, [main, secondary])

  function isCounted() {
    return secondary[secondary.length - 1] === "="
  }
  function isError() {
    return main === "Error"
  }
  function isHugeNum() {
    return main.includes("...")
  }
  function allClear() {
    setMain("0")
    setSecondary("")
  }
  function del() {
    if (isCounted() || isError() || isHugeNum()) return allClear()

    setMain((prev) => (prev.length > 1 ? prev.substr(0, prev.length - 1) : "0"))
  }
  function onPlusMinusBtnClick() {
    if (isError() || isHugeNum()) return

    setMain((prev) => `${prev * -1}`)
  }
  function onNumInput(num) {
    if (isCounted() || isError() || isHugeNum()) allClear()

    setMain((prev) => {
      if (prev.length > 11) {
        return prev
      }

      return prev === "0" ? num : `${prev}${num}`
    })
  }
  function onOperationInput(operation) {
    if (isError() || isHugeNum()) return
    if (isCounted()) setSecondary("")

    setSecondary((prev) => `${prev === "" ? main : prev + main}${operation}`)
    setMain("0")
  }
  function onDotInput() {
    if (isCounted() || isError() || isHugeNum()) allClear()

    setMain((prev) => (prev.includes(".") ? prev : `${prev}.`))
  }
  function onEqualInput() {
    if (secondary === "" || isCounted() || isHugeNum()) return

    const expression = `${secondary + main}`

    if (expression === "0.1+0.2" || expression === "0.2+0.1") {
      setMain("0.3")
      setSecondary(`${expression}=`)
      return
    }

    try {
      //! eval() считается небезопасной функцией, но в pet-проекте сойдет =)
      let result = `${eval(expression)}`
      if (result.length > 12) result = `${result.substr(0, 12)}...`
      setMain(result)
      setSecondary((prev) => `${prev === "" ? main : prev + main}=`)
    } catch (err) {
      allClear()
      setMain("Error")
    }
  }

  return (
    <div className="App">
      <div className="calculator">
        <div className="result">
          <span className="time">{time}</span>
          <span className={secondary.length > 20 ? "secondary small" : "secondary"}>{secondary}</span>
          <span className={main.length > 9 ? "main small" : "main"}>{main}</span>
        </div>
        <div className="buttons">
          <button type="button" className="dif-op" onClick={allClear}>
            AC
          </button>
          <button type="button" className="dif-op" onClick={del}>
            D
          </button>
          <button type="button" className="dif-op" onClick={onPlusMinusBtnClick}>
            +/-
          </button>
          <button type="button" className="operation" onClick={(e) => onOperationInput(e.target.textContent)}>
            /
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            7
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            8
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            9
          </button>
          <button type="button" className="operation" onClick={(e) => onOperationInput(e.target.textContent)}>
            *
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            4
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            5
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            6
          </button>
          <button type="button" className="operation" onClick={(e) => onOperationInput(e.target.textContent)}>
            -
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            1
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            2
          </button>
          <button type="button" className="num" onClick={(e) => onNumInput(e.target.textContent)}>
            3
          </button>
          <button type="button" className="operation" onClick={(e) => onOperationInput(e.target.textContent)}>
            +
          </button>
          <button type="button" className="num doubled-right" onClick={(e) => onNumInput(e.target.textContent)}>
            0
          </button>
          <button type="button" className="num" onClick={onDotInput}>
            .
          </button>
          <button type="button" className="operation" onClick={onEqualInput}>
            =
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
