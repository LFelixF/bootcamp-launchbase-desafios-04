const fs = require("fs")
const data = require("./data.json")
const { age, graduation, date } = require("./utils")

exports.post = (req, res) => {
    const keys = Object.keys(req.body)

    for(let key of keys) {
        if(req.body[key] == "") {
            return res.send("Please, fill all fields!")
        }
    }

    let {avatar_url, name, birth, select, location, services} = req.body

    birth = Date.parse(req.body.birth)
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

exports.show = (req, res) => {
    const { id } = req.params

    let foundTeachers = data.teachers.find((teacher) => {
        return teacher.id == id
    })

    if(!foundTeachers) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeachers,
        age: age(foundTeachers.birth),
        select: graduation(foundTeachers.select),
        services: foundTeachers.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeachers.created_at)
    }

    return res.render("teachers/show", { teacher })
}

exports.edit = (req, res) => {
    const { id } =  req.params

    const foundTeacher = data.teachers.find((teacher) => {
        return teacher.id == id
    })

    if(!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth)
    }

    return res.render("teachers/edit", { teacher })
}