let weather = {
    "apiKey": "40fe573e2d02437714746e185a41b962",
    fetchGeo: function(city){
        fetch("https://api.openweathermap.org/geo/1.0/direct?q="+ city +"&appid="+this.apiKey)
        .then((response) => response.json())
        .then((data) => {
            const {lat} = data[0];
            const {lon} = data[0];
            document.getElementById('place').textContent = city;
            this.fetchWeather(lat,lon);
        }).catch(()=>{
            errorDia("Enter a Valid City");
        })
        ;       
    },

    fetchUserLoc: function(){
        navigator.geolocation.getCurrentPosition((success) =>{
            let {latitude, longitude} = success.coords;
            fetch("https://api.openweathermap.org/geo/1.0/reverse?lat="+latitude+"&lon="+longitude +"&appid="+this.apiKey).
            then((response) => response.json()).
            then((data) => {
                const {name} = data[0];
                document.getElementById('place').textContent = name;
                this.fetchWeather(latitude,longitude);
            })
        },(error)=>{
            if(error.code==1){
                errorDia("Please allow location Access.")
            }
        })

    },

    fetchWeather: function(lat, lon){
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=metric&exclude=minutely,hourly,alerts&appid="+this.apiKey)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));

    },

    displayWeather: function(data){
        const {temp,feels_like,pressure,humidity,dew_point,uvi,clouds,wind_speed} = data.current;
        const {icon, description} = data.current.weather[0];

        document.querySelector(".w-icon").src ="https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector('.desc').textContent = description;
        let url = `url("https://source.unsplash.com/1600x900/?${description}")`
        document.body.style.backgroundImage = url;

        document.querySelector('.current-temp').textContent = temp + "° C";
        document.querySelector('.current-temp1').textContent = temp + "° C";
        document.querySelector('.feel-temp').textContent = feels_like + "° C";
        document.querySelector('.pressure').textContent = pressure;
        document.querySelector('.humidity').textContent = humidity+"%";
        document.querySelector('.dew-point').textContent = dew_point+ "° C";
        document.querySelector('.uvi').textContent = uvi;
        document.querySelector('.clouds').textContent = clouds;
        document.querySelector('.wind').textContent = wind_speed+ " km/h";


        for(index in data.daily){
            const {min,max} = data.daily[index].temp;
            const {dt,pressure,wind_speed,uvi} = data.daily[index]
            const {description,icon} = data.daily[index].weather[0]
            if(index==0){
                continue;
            }else{
                document.querySelectorAll('.f-day')[index-1].textContent = `${window.moment(dt*1000).format('ddd')}`;
                document.querySelectorAll('.f-desc')[index-1].textContent = description;
                document.querySelectorAll('.max')[index-1].textContent = max;
                document.querySelectorAll('.min')[index-1].textContent = min;
                document.querySelectorAll(".f-icon")[index-1].src ="https://openweathermap.org/img/wn/" + icon + ".png";
                document.querySelectorAll('.f-wind')[index-1].textContent = wind_speed+" km/h";
                document.querySelectorAll('.f-pressure')[index-1].textContent = pressure;
                document.querySelectorAll('.f-uvi')[index-1].textContent = uvi;
            }
        }



        // toggle
        document.querySelector('.t').classList.add('active');
        document.querySelector('.t').nextElementSibling.classList.remove('active');
        document.querySelector('.today').classList.remove('deactive');
        document.querySelector('.fdays').classList.add('deactive');

        removeActiveClasses();
        count++;
        setTimeout(()=>{removeAnimation(count)}, 1000);

    },

    search: function(){
        if(document.getElementById("search-bar").value==""){
            errorDia("Enter a City name");
        }
        else{

            this.fetchGeo(document.getElementById("search-bar").value);
        }
    }
    
}


let time = {
    "time1": document.getElementById('time'),
    'ampm': document.getElementById('am-pm'),
    'date1': document.getElementById('date'),
    'days': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    displayTime: function(){
        setInterval(()=>{
            const time = new Date();
            const month = time.getMonth();
            const day = time.getDay();
            const date = time.getDate();
            const hour = time.getHours();
            const hoursIn12hrFormat = hour >=13 ? hour%12: hour;
            const minutes = time.getMinutes();
            const ampm = hour>=12? "PM":"AM";
            
            this.time1.textContent = `${(hoursIn12hrFormat<10? '0'+hoursIn12hrFormat:hoursIn12hrFormat)}:${(minutes< 10?'0'+minutes:minutes)} `;
            this.ampm.textContent = ampm;
            this.date1.textContent = `${this.days[day]}, ${date} ${this.months[month]}`;

        }, 1000)
    }
}


document.querySelector('.search-btn').addEventListener('click', function(){
    weather.search();
    count=0;
    addAimation(count);
});
document.querySelector(".search-bar").addEventListener("keyup", function(e){
    if(e.key== "Enter"){
        weather.search();
        count=0;
        addAimation(count);
    }
});


// toggle
document.querySelector('.f').addEventListener('click',()=>{
    document.querySelector('.f').classList.add('active');
    document.querySelector('.f').previousElementSibling.classList.remove('active');
    document.querySelector('.today').classList.add('deactive');
    document.querySelector('.fdays').classList.remove('deactive');
})
document.querySelector('.t').addEventListener('click',()=>{
    document.querySelector('.t').classList.add('active');
    document.querySelector('.t').nextElementSibling.classList.remove('active');
    document.querySelector('.today').classList.remove('deactive');
    document.querySelector('.fdays').classList.add('deactive');
})

// animation-load
const animated_bg = document.querySelectorAll('.animated-bg');
let count = 0;
function removeAnimation(count){
    if(count>0){
        animated_bg.forEach(bg => bg.classList.remove('animated-bg'));
    }
}
function addAimation(count){
    if(count==0){
        animated_bg.forEach(bg => bg.classList.add('animated-bg'))
    }
}



// expanding cards
const rows = document.querySelectorAll('.info .fdays .row');
rows.forEach(row =>{
    row.addEventListener('click',()=>{
        removeActiveClasses();
        row.classList.toggle('active');
    })
})
function removeActiveClasses(){
    rows.forEach(row =>{
        row.classList.remove('active');
    })
}


// errors
const btn = document.getElementById('btn');
function errorDia(msg){
    document.querySelector('.msg').textContent = msg;
    document.getElementsByClassName('dia')[0].setAttribute('open','open');
}
btn.addEventListener('click',()=>{
    document.getElementsByClassName('dia')[0].removeAttribute('open');
})


// onload
time.displayTime();
weather.fetchGeo('Mumbai');
weather.fetchUserLoc();
