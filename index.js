const username = process.argv[2];


async function fetchData(username) {
    try{
        const res = await fetch (`https://api.github.com/users/${username}/events`)
        const data = await res.json()
        return data
      
    } catch (error) {
        console.error("Erro ao processar os dados", error)
    } 
}

function displayActicity(data){
    const reposUsados = []

    data.forEach((event) => {
        let commitsNum = 0
        switch(event.type){
            case "PushEvent":
                
                
                if(reposUsados.includes(event.repo.name)){
                    
                    console.log(event.payload.commits.length)
                    
                    
                }
                else{
                    reposUsados.push(event.repo.name)
                }
    
                
                
                //console.log(`- Deu ${event.payload.commits.length} Commits para ${event.repo.name}`)
            case "issuesEvent":
                //console.log(`- Abriu uma nova Issue em ${event.repo.name}`)
        }
    })

}

if (username) {
    fetchData(username).then(data => {displayActicity(data)})
} else {
    console.log("INFORME UM USUARIO")
}

