import { useState, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

interface SpinSegment {
  id: string
  text: string
  color: string
}

const segments: SpinSegment[] = [
  { id: '1', text: 'won 100', color: '#FF6384' },
  { id: '2', text: 'won 200', color: '#36A2EB' },
  { id: '3', text: 'won 300', color: '#FFCE56' },
  { id: '4', text: 'won 400', color: '#4BC0C0' },
  { id: '5', text: 'won 500', color: '#9966FF' },
  { id: '6', text: 'won 600', color: '#FF9F40' },
]

export default function SpinGame() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const controls = useAnimationControls()
  const rotationRef = useRef(0)

  const spinWheel = () => {
    if (!spinning) {
      setSpinning(true)
      setResult(null)
      console.log(rotationRef.current)
      const newRotation = (rotationRef.current) + 1440 + Math.floor(Math.random() * 360)
      console.log(newRotation,newRotation%360)
      rotationRef.current = newRotation

      controls.start({
        rotate: newRotation,
        transition: { duration: 6, ease: "easeOut" }
      }).then(() => {
        setSpinning(false)
        const normalizedRotation = newRotation % 360
        const winningIndex = Math.floor((normalizedRotation) / 60)
        const selectedSegment = segments[(segments.length -3 - winningIndex)%6]
        setResult(selectedSegment.text)
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Spin Game</h1>
      <div className="relative w-80 h-80">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.g
            animate={controls}
          >
            {segments.map((segment, index) => {
              const angle = 360 / segments.length
              const startAngle = index * angle
              const endAngle = (index + 1) * angle

              const startX = 50 + 50 * Math.cos((startAngle * Math.PI) / 180)
              const startY = 50 + 50 * Math.sin((startAngle * Math.PI) / 180)
              const endX = 50 + 50 * Math.cos((endAngle * Math.PI) / 180)
              const endY = 50 + 50 * Math.sin((endAngle * Math.PI) / 180)
              

              const pathData = [
                `M 50 50`,
                `L ${startX} ${startY}`,
                `A 50 50 0 0 1 ${endX} ${endY}`,
                `Z`,
              ].join(' ')

              return (
                <path
                  key={segment.id}
                  d={pathData}
                  fill={segment.color}
                  stroke="#000"
                  strokeWidth="0.5"
                />
              )
            })}
            {segments.map((segment, index) => {
              const angle = 360 / segments.length
              const midAngle = (index * angle + (index + 1) * angle) / 2
              const textX = 50 + 35 * Math.cos((midAngle * Math.PI) / 180)
              const textY = 50 + 35 * Math.sin((midAngle * Math.PI) / 180)

              return (
                // <text
                //   key={segment.id}
                //   x={textX}
                //   y={textY}
                //   textAnchor="middle"
                //   dominantBaseline="middle"
                //   fill="#fff"
                //   fontSize="4"
                //   fontWeight="bold"
                //   transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                // >
                //   {segment.text}
                // </text>
              )
            })}
          </motion.g>
        </svg>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-black"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-20 h-20 flex items-center justify-center border-2 border-black">
          <button
            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold"
            onClick={spinWheel}
            disabled={spinning}
          >
            Start
          </button>
        </div>
      </div>
      <div className="mt-8 text-xl font-semibold">
        {result && `Result: ${result}`}
      </div>
    </div>
  )
}