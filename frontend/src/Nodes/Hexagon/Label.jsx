const Label = ({ children }) => {
  return (
    <div className="bold pointer-events-none absolute -bottom-2 rounded-full bg-black/60 px-5 text-center font-thin text-zinc-400 shadow shadow-blue-500/20">
      {children}
    </div>
  )
}

export default Label
