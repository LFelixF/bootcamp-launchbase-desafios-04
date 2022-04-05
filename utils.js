module.exports = {
    age: (timestamp) => {
        const today = new Date()
        const birth = new Date(timestamp)

        let age = today.getFullYear() - birth.getFullYear()
        const month = today.getMonth() - birth.getMonth()
        const day = today.getDate() - birth.getDate()
        
        if(month < 0 || month == 0 && day < 0) {
            age = age - 1
        }

        return age
    },
    graduation: (select) => {
        if (select == "high_school") {
            return "Ensino Médio Completo"
        } 
        else if (select == "university") {
            return "Ensino Superior Completo"
        }
        else if (select == "masters") {
            return "Mestrado"
        }
        else {
            return "Doutorado"
        }
    },
    date: (timestamp) => {
        const birth = new Date(timestamp)

        const year = birth.getUTCFullYear()
        const month = `0${birth.getUTCMonth() + 1}`.slice(-2)
        const day = `0${birth.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso:`${year}-${month}-${day}`,
            birthDay: `${day}/${month}`
        }
    },
    grade: (select) => {
        return `${select}º ano do ensino fundamental`
    }
}