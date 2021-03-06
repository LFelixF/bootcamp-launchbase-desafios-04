const fs = require("fs")
const data = require("../data.json")
const { age, graduation, date } = require("../utils")

// Redirect
exports.redirect = (req,res) => {
    return res.redirect("teachers")
}

// Page INDEX
exports.index = (req, res) => {
    const teachers = []
    
    for(let item of data.teachers) {
        let { services } = item
        services = item.services.split(",")

        teachers.push({
            ...item,
            services
        })
    }

    return res.render("teachers/index", { teachers })
}

// Page CREATE
exports.create = (req, res) => {
    return res.render("teachers/create")
}

// Dados do Formulário de criação
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

// Page dos professores
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

// Page do formulário de edição
exports.edit = (req, res) => {
    const { id } =  req.params

    const foundTeacher = data.teachers.find((teacher) => {
        return teacher.id == id
    })

    if(!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso
    }

    return res.render("teachers/edit", { teacher })
}

// Dados do formulário de edição
exports.put = (req, res) => {
    const { id } = req.body
    let index = 0

    const foundTeachers = data.teachers.find((teacher, foundIndex) => {
        if (teacher.id == id) {
            index = foundIndex
            return true
        }
    })

    if (!foundTeachers) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeachers,
        ...req.body,
        id: Number(req.body.id),
        birth: Date.parse(req.body.birth)
    }

    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send("Write file error!")

        return res.redirect(`/teachers/${id}`)
    })
}

// Apaga dado do database
exports.delete = (req, res) => {
    const { id } = req.body

    const filteredTeachers = data.teachers.filter((teacher) => {
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send("Write file error!")

        return res.redirect("/teachers")
    })
}