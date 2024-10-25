const username = process.argv[2];

async function fetchData(username) {
    if(!username){
        return []
    }
    try {
        const res = await fetch(`https://api.github.com/users/${username}/events`);
        const data = await res.json();
        if (!res.ok){
            throw new Error(`Erro na Api: ${data.message}`)
        }
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function displayActivity(data) {
    const reposStats = {};

    data.forEach((event) => {
        const repoName = event.repo.name;
        if (!reposStats[repoName]) {
            reposStats[repoName] = { commits: 0, issues: 0, pulls: 0, branches:0, fork:0 };
        }
        switch (event.type) {
            case "PushEvent":
                const commitsCount = event.payload.commits.length;
                reposStats[repoName].commits += commitsCount;
                break;
            case "PullRequestEvent":
                reposStats[repoName].pulls += 1
                break;
            case "IssuesEvent":
                reposStats[repoName].issues += 1;
                break;
            case "CreateEvent":
                let branchesCount = 0 
                if(event.payload.ref_type == "branch"){
                    branchesCount++
                }
                reposStats[repoName].branches += branchesCount
                break  
            case "ForkEvent":
                reposStats[repoName].fork += 1
                break
        }
    });

    for (const repo in reposStats) {
        const activityMessages = [];

        if (reposStats[repo].commits !== 0) {
            activityMessages.push(`Deu ${reposStats[repo].commits} Commits`);
        }

        if (reposStats[repo].branches !== 0) {
            activityMessages.push(`criou ${reposStats[repo].branches} Branch(es)`);
        }

        if (reposStats[repo].issues !== 0) {
            activityMessages.push(`abriu ${reposStats[repo].issues} Issue(s)`);
        }

        if (reposStats[repo].pulls !== 0) {
            activityMessages.push(`teve ${reposStats[repo].pulls} PR(s) abertos`);
        }

        if (reposStats[repo].fork !== 0) {
            activityMessages.push(`criou ${reposStats[repo].fork} Fork(s)`);
        }

        if (activityMessages.length > 0) {
            console.log(`- ${username} ${activityMessages.join(', ')} em ${repo}`);
        }
    }
}

if (username) {
    fetchData(username).then(data => {
        displayActivity(data); 
    });
} else {
    console.log("INFORME UM USUARIO");
}

fetchData(username).then(data => {
    displayActivity(data); 
});