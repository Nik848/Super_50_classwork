const Card = ({ title, content }) => {
  return (
    <div className="
      relative overflow-hidden inline-block
      max-w-[420px] m-6 p-8
      rounded-[2rem]
      border border-white/20
      bg-gradient-to-br from-red-200 via-orange-500 to-yellow-200
      text-white
      backdrop-blur-xl
      shadow-[0_0_30px_rgba(255,0,255,0.5)]
      transition-all duration-500
      hover:scale-100 hover:-translate-y-2 hover:rotate-1
      hover:shadow-[0_0_80px_rgba(255,0,255,0.8)]
      ">
      <h1 className="
        text-4xl font-black mb-4
        bg-gradient-to-r
        from-yellow-300 via-pink-300 to-cyan-300
        bg-clip-text text-transparent
        ">{title}</h1>
      <p className="
        text-2xl font-extrabold
        px-4 py-2
        rounded-full
        bg-black/30
        border border-white/30
        inline-block
        ">₹{content}</p>
    </div>
  );
};

const data = [
  {
    title: "Mouse",
    price: 1000
  },
  {
    title: "keyboard",
    price: 2000
  },
  {
    title: "Moniter",
    price: 2000
  },
  {
    title: "Headphones",
    price: 1000
  },
  {
    title: "Macbook",
    price: 250000
  },
  {
    title: "Mobile",
    price: 25000
  },
  {
    title: "LEDTV",
    price: 45000
  },
  {
    title: "Watch",
    price: 50000
  }
]

function App() {
  return (
    <main>
      {data.map((item) => (
        <Card
          key={item.title}
          title={item.title}
          content={item.price}
        />
      ))}
    </main>
  );
}

export default App;