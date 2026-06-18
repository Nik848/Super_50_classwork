let search = document.getElementById('s')

search.addEventListener("input", debounce(call, 4000))  



function debounce(func, delay) {
    let timerId;

    return function() {
        clearTimeout(timerId);

        timerId = setTimeout(function() {
            func();
        }, delay);
    };
}

function call(){
    console.log("debounced function called")
}


async function getdata(){
    try{
        const res = await fetch(`https://dummyjson.com/products/`)        
        const data = await res.json()
        console.log(data)
    }
    catch(err){
        console.log(err)
        console.log("catch")
    }
    
}

getdata();