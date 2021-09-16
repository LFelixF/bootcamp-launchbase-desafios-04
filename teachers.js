const fs = require("fs")
const data = require("./data.json")

exports.post = (req, res) => {
    const keys = Object.keys(req.body)

    for(let key of keys) {
        if(req.body[key] == "") {
            return res.send("Please, fill all fields!")
        }
    }

    let {avatar_url, name, birth, select, location, services} = req.body

    const id = Number(data.teachers.length + 1)
    const created_at = Date.now()

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        select,
        location,
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send("Write file error!")
        }

        return res.redirect("/teachers")
    })
}