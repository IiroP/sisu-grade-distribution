var injectChart = async () => {
    // Check if chart already exists and remove it
    if(document.getElementById("grade-distribution-container")) {
        document.getElementById("grade-distribution-container").remove()
    }
    const lang = document.querySelector("html").lang
    var contentRow = document.querySelector(".modal-body")
    var div = document.createElement("div")
    div.id = "grade-distribution-container"
    var canvas = document.createElement("canvas")
    canvas.id = "public-grade-distribution"
    canvas.style.backgroundColor = 'rgba(255,255,255,255)'

    var title = document.createElement("h3")
    var titleText = lang === "fi" ? "Julkinen arvosanajakauma" : lang === "sv" ? "Publik betygsspridning" : "Public grade distribution"
    title.textContent = titleText

    var downloadCsvButton = document.createElement("button")
    downloadCsvButton.textContent = lang === "fi" ? "Lataa CSV" : lang === "sv" ? "Ladda ner CSV" : "Download CSV"
    downloadCsvButton.style.float = "right"
    downloadCsvButton.className = "btn btn-lg btn-primary"
    downloadCsvButton.onclick = () => {
        var data = JSON.parse(document.querySelector("#__interceptedData")?.innerHTML || '{}')?.publicGradeDistribution?.gradeCounts
        var csvData = []
        for(const count of Object.entries(data)) {
            csvData.push({
                "Grade": count[0],
                "Count": count[1]
            })
        }
        downloadJsonAsCsv(csvData)
    }

    var downloadPngButton = document.createElement("button")
    downloadPngButton.textContent = lang === "fi" ? "Lataa PNG" : lang === "sv" ? "Ladda ner PNG" : "Download PNG"
    downloadPngButton.style.float = "right"
    downloadPngButton.className = "btn btn-lg btn-primary"
    downloadPngButton.onclick = () => {
        downloadChartAsPng()
    }

    div.appendChild(downloadPngButton)
    div.appendChild(downloadCsvButton)
    div.appendChild(title)
    div.appendChild(canvas)

    contentRow.appendChild(div)

    await new Promise(r => setTimeout(r, 300)) // Wait for data to be loaded
    var data = JSON.parse(document.querySelector('#__interceptedData').innerHTML || '{}').publicGradeDistribution.gradeCounts
    console.log("Grade distribution data: " + JSON.stringify(data))

    const chart = new Chart(
        document.getElementById("public-grade-distribution").getContext('2d'),
        {
            type: "bar",
            data: {
                datasets: [{
                    backgroundColor: "blue",
                    data: data,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: lang === "fi" ? "Opiskelijoiden määrä" : lang === "sv" ? "Antal studerande" : "Number of students",
                            font: {
                                size: 16
                            },
                            padding: 10
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: lang === "fi" ? "Arvosana" : lang === "sv" ? "Betyg" : "Grade",
                            font: {
                                size: 16
                            },
                            padding: 10
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: document.getElementById("attainment-details-heading").innerText,
                        font: {
                            size: 20
                        },
                        padding: 20
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    }
                }
            }
        }
    )

    function downloadChartAsPng() {
        var downLoadPng = document.createElement('a')
        downLoadPng.href = chart.toBase64Image()
        var courseName = document.getElementById("attainment-details-heading").innerText
        downLoadPng.download = `${courseName}.png`
        downLoadPng.click()
    }
}

// Add mutation observer to document to detect when the modal is added to dom
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (!mutation.addedNodes.length) return
        for(const node of mutation.addedNodes) {
            if(node.tagName === 'APP-ASSESSMENT-ITEM-ATTAINMENT-DETAILS') {
                injectChart()
                break
            }
        }
    })
})
observer.observe(document, { childList: true, subtree: true })


// JSON to CSV Converter
function downloadJsonAsCsv(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
    var csv = ''
    for (var i = 0; i < array.length; i++) {
        var line = ''
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index]
        }
        csv += line + '\r\n'
    }

    // Create link and download
    var link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv)
    var courseName = document.getElementById("attainment-details-heading").innerText
    link.download = `${courseName}.csv`
    link.click()
}
