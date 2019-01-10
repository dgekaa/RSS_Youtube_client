
window.onload = () =>{
    let youtube = new Youtube();
	youtube.submit();
}

class Youtube {
	constructor(){
		this.blockContainer = document.querySelector(".blockContainer");
		this.form = document.querySelector(".form");
		this.search = document.querySelector("#search");
		this.count = 0;
		this.nextPageToken = "";
        this.dotContainer = document.createElement("div");
        this.countDots = 1;
        this.translateValue = 0;
        this.col = 4;
 	}
	// ОЧИСТКА КОНТЕЙНЕРА
	clearBlockContainer() {
        while (this.blockContainer.hasChildNodes()) {
            this.blockContainer.removeChild(this.blockContainer.firstChild);
        }
	}
    // ОЧИСТКА ТОЧЕК
    clearDotsContainer() {
        while (this.dotContainer.hasChildNodes()) {
            this.dotContainer.removeChild(this.dotContainer.firstChild);
            this.countDots = 4;
        }
    }
    //ПОДСТРОЙКА ПОД ЭКРАН
    // resize(){
    //     // window.addEventListener("resize",(e)=>{
    //         console.log(document.documentElement.clientWidth);

    //         if(document.documentElement.clientWidth < 1200 && document.documentElement.clientWidth >= 950){
    //             this.col = 3;

    //         }else if(document.documentElement.clientWidth < 950 && document.documentElement.clientWidth >= 600){
    //             this.col = 2;
    //         }else if(document.documentElement.clientWidth < 600){
    //             this.col = 1;
    //         }
    // // });
    // }

    // СОЗДАНИЕ НИЖНИХ КРУЖКОВ
    createDots(json){
        this.dotContainer.classList.add("dotContainer");
        let dots;

        for(let i = 0; i<Math.ceil((json.items.length)/this.col); i++){
            dots = document.createElement("div");
            dots.classList.add("dots");

            this.dotContainer.appendChild(dots);
            dots.innerHTML = this.countDots;

            dots.style.backgroundColor = "#3d3d3d";
            dots.style.color = "#fff";
            dots.style.borderColor = "#3d3d3d";

            this.countDots++;
        }
        this.blockContainer.addEventListener("wheel",(e)=>{

            // this.resize();

            if(e.deltaY > 0){
                this.translateValue -=100;
            }else{
                if(this.translateValue < 0){
                    this.translateValue +=100;
                }else if(this.translateValue > 0){
                    this.translateValue = 0
                }
            }
            console.log(document.documentElement.clientWidth);

            let dot = document.querySelectorAll(".dots");

            dot.forEach((el,ind,arr)=>{
                let x = (Math.floor(Math.abs((this.translateValue/300/this.col))));

                el.style.backgroundColor="#3d3d3d";
                el.style.color="#fff";

                arr[x].style.backgroundColor = "#fff";
                arr[x].style.color="#3d3d3d";
            });
        });
    }
	// СОЗДАНИЕ И ДОБАВЛЕНИЕ КОНТЕНТА
	createHTML(json){
		console.log(json);
        console.log(json.items);

        json.items.forEach((el,i)=>{

            // this.resize();

            const blockTop = document.createElement("div"),
            	block = document.createElement("div"),
                blockBottom = document.createElement("div"),
                iframe = document.createElement("iframe"),
                p1 = document.createElement("p"),
                p2 = document.createElement("p"),
                p3 = document.createElement("p"),
                p4 = document.createElement("p");

            block.classList.add("block");
            blockTop.classList.add("blockTop");
            blockBottom.classList.add("blockBottom");
            iframe.classList.add("iframe");
            p1.classList.add("p1");
            p2.classList.add("p2");
            p3.classList.add("p3");
            p4.classList.add("p4");

            iframe.src = "https://www.youtube.com/embed/" + el.id.videoId;
            iframe.setAttribute("width","100%");
            iframe.setAttribute("height",iframe.width*0.56225);
            iframe.setAttribute("frameborder","0");
            iframe.setAttribute("allow","accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
            iframe.setAttribute("allowfullscreen","");

            p1.innerHTML ='<i class="fas fa-male" id="person"></i>' + el.snippet.channelTitle;
            p2.innerHTML ='<i class="fas fa-calendar-alt" id="calendar"></i>' + el.snippet.publishedAt.slice(0,10);
            p3.innerHTML ='<i class="far fa-eye" id="eye"></i>' + "!!!!!!";
            p4.innerHTML = el.snippet.description;

            this.blockContainer.appendChild(block);
            block.appendChild(blockTop);
            blockTop.appendChild(iframe);
            block.appendChild(blockBottom);
            blockBottom.appendChild(p1);
            blockBottom.appendChild(p2);
            blockBottom.appendChild(p3);
            blockBottom.appendChild(p4);
        });
        this.count += json.items.length;
        this.blockContainer.style.width = (300 * this.count) + "px";
    }
    // ОТПРАВКА И ОБРАБОТКА ФОРМЫ
    submit () {
        document.querySelector(".container").appendChild(this.dotContainer);

        // this.resize();

    	this.form.addEventListener("submit", (e)=>{
            this.blockContainer.style.transform = "translateX(0px)";
        	fetch("https://www.googleapis.com/youtube/v3/search?key=AIzaSyD3B3yv5YaQmKjWTYKiNgZXy4dbt5EtmO0&type=video&part=snippet&maxResults=15&q=" + this.search.value)
	            .then(response => {
	                return response.json();
	            })
	            .then(json => {
                    this.clearDotsContainer();
	            	this.clearBlockContainer();
	            	this.createHTML(json);
                    this.createDots(json);
	            	this.nextPageToken = json.nextPageToken;
                    this.wheel();
	            })
	            .catch( alert );
   		}) ;
    }
    // ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА
    wheel () {
	    this.blockContainer.addEventListener("wheel",(e)=>{

            // this.resize();

	        let translate = window.getComputedStyle(this.blockContainer),
	       		translateValueThis = translate.transform.split(",")[4];

        	if(e.deltaY > 0 && translateValueThis > -(this.blockContainer.style.width.slice(0,-2))+1200){
        	   	this.blockContainer.style.transform += "translateX(-100px)";
                            // ПОДГРУЗКА ДРУГИХ ВИДЕО
                if(translateValueThis % 2900 === 0 && translateValueThis < -400){
                    fetch("https://www.googleapis.com/youtube/v3/search?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&type=video&part=snippet&maxResults=15&q="+this.search.value+"&pageToken="+ this.nextPageToken)
                        .then(response => {
                            return response.json();
                        })
                        .then(json => {
                            console.log(json.nextPageToken)
                            this.createHTML(json);
                            this.createDots(json);
                            this.nextPageToken = json.nextPageToken;
                        })
                        .catch( alert );
                }
            }else if(e.deltaY < 0 && translateValueThis < 0){
            	this.blockContainer.style.transform += "translateX(100px)";

           	}
            return false;
	    })
    }
}

