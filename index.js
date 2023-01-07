document.addEventListener("DOMContentLoaded", () => {
    const start = document.getElementById("startButton")
    const stop  = document.getElementById("stopButton")
    const clear = document.getElementById("clearButton")
    const select = document.getElementById("selectMenu")
    const resume = document.getElementById("resumeButton")
    const clearTrack = document.getElementById("clearTracked")
    const tracked = document.getElementById("tracked")
    const timer = document.getElementById("timer")
    let timeValue ={}

    let x = setInterval( () => {
        chrome.alarms.get("alarm").then((a) =>{
            if(a === undefined){
                clearInterval(x)
            }
            const now = new Date().getTime()
            const remainingSec = Math.floor(((a.scheduledTime - now) % (1000 * 60)) / 1000)
            const remainingMin =  Math.floor(((a.scheduledTime - now) % (1000 * 60 * 60)) / (1000 * 60))
            timer.innerHTML = `${Math.ceil(remainingMin)} : ${remainingSec}`
        })
    }, 1000)


    chrome.storage.local.get(["track"]).then((result) => {
        let amount = result
        if(result.track === undefined){
            amount = 0
        } else {
            amount = result.track
        }
        tracked.innerHTML = `tracked total: ${amount}`
    })


    select.addEventListener("change",(event) => { timeValue = event.target.value } )

    start.addEventListener("click", () =>{
        chrome.storage.local.set({timer : timeValue}).then(() => console.log("timer start set storagfe"))
        chrome.alarms.create("alarm", {
            delayInMinutes : parseInt(timeValue),
        })

        chrome.storage.local.get(["track"]).then((result) => {
            let amount = result
            if(result.track === undefined){
                chrome.storage.local.set({track : parseInt(timeValue)})
                amount = timeValue
            }else{
                chrome.storage.local.set({track:parseInt(result.track) + parseInt(timeValue)})
                amount = parseInt(result.track) + parseInt(timeValue)
            }
            tracked.innerHTML = `tracked total: ${amount} Min`
            })
        location.reload()
    })

    stop.addEventListener("click", () => {
        resume.style.display = "inline-block";
        stop.style.display= "none"
        chrome.alarms.get("alarm").then((res) =>{
            const now = new Date().getTime()
            const timeRemaining = ((res.scheduledTime - now)/ 60000 ).toString()
            chrome.alarms.clear("alarm")
            console.log(timeRemaining)
            timeValue = {
                "timeRemaining" : timeRemaining
            }
        })
    })


    resume.addEventListener("click", () => {
        resume.style.display = "none";
        stop.style.display= "inline-block"
        let timeRemaining = timeValue.timeRemaining
        chrome.alarms.create("alarm", {
            delayInMinutes : parseInt(Math.ceil(timeRemaining))
        })
        console.log("Continue",parseInt(Math.ceil(timeRemaining),10) )
        location.reload()
    })

    clear.addEventListener("click", () => {
    chrome.alarms.clearAll()
    timeValue = {
        "timeRemaining" : 0
    }
    })

    clearTrack.addEventListener("click", () => {chrome.storage.local.remove(["track"])
        location.reload()
    })
})