// import { useState } from "react";

// // if state is changed it will re render
// function Main() {
//   const [screen, remote] = useState(0);

//   let count = 0;

//   console.log("rendered", screen);
  
//   function handleClick() {
//     count++;
//     remote(screen + 1); //Noted
//     console.log(screen); //Noted
//   }

//   console.log("count =", count);
  
//   return (
//     <div>
//       <h1>hello world</h1>
//       <button onClick={handleClick}>Increment</button>
//       <h1>{screen}</h1>
//     </div>
//   )
// }


// function Inputshow(){
//   const [name,setname] = useState("Yash");
//   function handleChange(e) {
//     const val = e.target.value;
//     console.log(val);
//     setname(val);
//   }
//   return (
//     <div>
//       <input type="text" onChange={handleChange} value={name}/>
//       <h1>{name}</h1>
//     </div>
//   )
// }


// export {Main, Inputshow};



// DAY 9:
import {useEffect, useState} from "react";
const URL = "https://dummyjson.com/products/search?q=${text}";

const customStyles = {
  display:"flex",
  flexWrap:"wrap",
  gap:"1rem",
  justifyContent:"space-around",
  alignItems:"center"
}
const searchStyle = {
   display:"flex",
   justifyContent:"center",
   alignItems:"center",
   margin:"1rem",
   padding:"1rem",
   fontSize:"2rem",
   borderRadius:"10px",
   width:"95%",
   height:"10vh",
   
}

function App() {
  const[data,setdata] = useState([]);
  const[text,settext] = useState("");
  
  async function getData() {
    const res = await fetch(`https://dummyjson.com/products/search?q=${text}`);
    const data = await res.json();
    console.log(data.products);
    setdata(data.products);
  }

  function handleSearch(e){
    const text = e.target.value;
    settext(text);
  }
    

  useEffect(() => {
    getData()
  },[text])

  return(
    <div>
      <input type="text" placeholder="Search products" style={searchStyle} onChange={handleSearch} value={text}/> 

      <div className="products" style={customStyles}>
          {data.map((item) =>(
            <div key={item.id}>
              <img src={item.thumbnail} alt="" />
              <h2>{item.title}</h2>
              <h3>Price: ${item.price}</h3>
              <h3>Category: {item.category}</h3>
              <h4>Desc: {item.description}</h4>
            </div>
          ))}
      </div>
    </div>
  )
}

export default App;
