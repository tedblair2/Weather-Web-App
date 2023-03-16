const container=document.querySelector(".container"),
inputPart=container.querySelector(".input-part"),
infoTxt=inputPart.querySelector(".info-txt"),
inputField=inputPart.querySelector("input"),
weatherIcon=document.querySelector(".weather-part img")

const api_key=""
const api_location=""
const validate=(e)=>{
    if(e.key=="Enter" && inputField.value !== ""){
        requestApi(inputField.value)
    }
}
const getCurrentLocation=()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError)
    }else{
        alert("Browser does not support geolocation")
    }
}

const onSuccess= async(position)=>{
    const{latitude,longitude}=position.coords
    let url_link=`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${api_location}`
    try{
        const response= await fetch(url_link)
        infoTxt.innerHTML="Getting Weather Details..."
        infoTxt.classList.add("pending")
        setTimeout(()=>{
            infoTxt.classList.remove("pending")
        },500)
        const data= await response.json()
        console.log(data)
        getWeatherDetails(data)
        return data
    }catch(err){
        console.error(err)
    } 
}
const onError=(error)=>{
    infoTxt.innerHTML=error.message
    infoTxt.classList.add("error")
}

const requestApi=async(city)=>{
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`
    try{
        const response= await fetch(url)
        infoTxt.innerHTML="Getting Weather Details..."
        infoTxt.classList.add("pending")
        const data= await response.json()
        console.log(data)
        getWeatherDetails(data)
        return data
    }catch(err){
        console.error(err)
    } 
}
const getWeatherDetails=(data)=>{
    if(data.cod== "404"){
        infoTxt.innerHTML=`${inputField.value} is not a valid city name`
        infoTxt.classList.replace("pending" , "error")
    }else{
        const city=data.name
        const country=data.sys.country
        const {description, id}=data.weather[0]
        const {feels_like, humidity, temp}=data.main

        container.querySelector(".temp .num").innerText=Math.floor(temp)
        container.querySelector(".weather").innerText=description
        container.querySelector(".location span").innerText=`${city},${country}`
        container.querySelector(".temp .num-2").innerText=Math.floor(feels_like)
        container.querySelector(".humidity span").innerText=`${humidity}%`

        if(id == 800){
            weatherIcon.src="Weather Icons/clear.svg"
        }else if(id >=200 && id<=232){
            weatherIcon.src="Weather Icons/storm.svg"
        }else if(id >= 600 && id <=622){
            weatherIcon.src="Weather Icons/snow.svg"
        }else if( id >= 701 && id <= 781){
            weatherIcon.src="Weather Icons/haze.svg"
        }else if(id >= 801 && id <=804){
            weatherIcon.src="Weather Icons/cloud.svg"
        }else if((id >=300 && id <=321) || (id >= 500 && id <=531)){
            weatherIcon.src="Weather Icons/rain.svg"
        }
        infoTxt.classList.remove("pending","error")
        container.classList.add("active")
        container.querySelector("header i").addEventListener("click",()=>{
            container.classList.remove("active")
        })
    }
}